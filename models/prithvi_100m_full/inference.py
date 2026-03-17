import argparse
import functools
import os
from typing import List, Union
import re
import datetime
import numpy as np
import pandas as pd
import rasterio
import torch
import yaml
from einops import rearrange

from functools import partial

from torch.distributed.checkpoint import state_dict

from prithvi_mae import PrithviMAE

NO_DATA = -9999
NO_DATA_FLOAT = 0.0001
OFFSET = 0
PERCENTILE = 99.9


def process_channel_group(orig_img, new_img, channels, mean, std):
    """Process *orig_img* and *new_img* for RGB visualization. Each band is rescaled back to the
        original range using *data_mean* and *data_std* and then lowest and highest percentiles are
        removed to enhance contrast. Data is rescaled to (0, 1) range and stacked channels_first.

    Args:
        orig_img: torch.Tensor representing original image (reference) with shape = (bands, H, W).
        new_img: torch.Tensor representing image with shape = (bands, H, W).
        channels: list of indices representing RGB channels.
        mean: list of mean values for each band.
        std: list of std values for each band.

    Returns:
        torch.Tensor with shape (num_channels, height, width) for original image
        torch.Tensor with shape (num_channels, height, width) for the other image
    """

    mean = torch.tensor(np.asarray(mean)[:, None, None])  # C H W
    std = torch.tensor(np.asarray(std)[:, None, None])
    orig_img = orig_img[channels, ...]
    valid_mask = torch.ones_like(orig_img, dtype=torch.bool)
    valid_mask[orig_img == NO_DATA_FLOAT] = False

    # Back to original data range
    orig_img = (orig_img * std[channels]) + mean[channels]
    new_img = (new_img[channels, ...] * std[channels]) + mean[channels]

    # Rescale (enhancing contrast)
    max_value = max(3000, np.percentile(orig_img[valid_mask], PERCENTILE))
    min_value = OFFSET

    orig_img = torch.clamp((orig_img - min_value) / (max_value - min_value), 0, 1)
    new_img = torch.clamp((new_img - min_value) / (max_value - min_value), 0, 1)

    # No data as zeros
    orig_img[~valid_mask] = 0
    new_img[~valid_mask] = 0

    return orig_img, new_img


def read_geotiff(file_path: str):
    """Read all bands from *file_path* and return image + meta info.

    Args:
        file_path: path to image file.

    Returns:
        np.ndarray with shape (bands, height, width)
        meta info dict
    """

    with rasterio.open(file_path) as src:
        img = src.read()
        meta = src.meta
        try:
            coords = src.lnglat()
        except:
            # Cannot read coords
            coords = None

    return img, meta, coords


def save_geotiff(image, output_path: str, meta: dict):
    """Save multi-band image in Geotiff file.

    Args:
        image: np.ndarray with shape (bands, height, width)
        output_path: path where to save the image
        meta: dict with meta info.
    """

    with rasterio.open(output_path, "w", **meta) as dest:
        for i in range(image.shape[0]):
            dest.write(image[i, :, :], i + 1)

    return


def _convert_np_uint8(float_image: torch.Tensor):
    image = float_image.numpy() * 255.0
    image = image.astype(dtype=np.uint8)

    return image


def load_example(
    file_paths: List[str],
    mean: List[float],
    std: List[float],
    indices: Union[list[int], None] = None,
):
    """Build an input example by loading images in *file_paths*.

    Args:
        file_paths: list of file paths .
        mean: list containing mean values for each band in the images in *file_paths*.
        std: list containing std values for each band in the images in *file_paths*.

    Returns:
        np.array containing created example
        list of meta info for each image in *file_paths*
    """

    imgs = []
    metas = []
    temporal_coords = []
    location_coords = []

    for file in file_paths:
        img, meta, coords = read_geotiff(file)

        # Rescaling (don't normalize on nodata)
        img = np.moveaxis(img, 0, -1)  # channels last for rescaling
        if indices is not None:
            img = img[..., indices]
        img = np.where(img == NO_DATA, NO_DATA_FLOAT, (img - mean) / std)

        imgs.append(img)
        metas.append(meta)
        if coords is not None:
            location_coords.append(coords)

        try:
            match = re.search(r'(\d{7,8}T\d{6})', file)
            if match:
                    year = int(match.group(1)[:4])
                    julian_day = match.group(1).split('T')[0][4:]
                    if len(julian_day) == 3:
                        julian_day = int(julian_day)
                    else:
                        julian_day = datetime.datetime.strptime(julian_day, '%m%d').timetuple().tm_yday
            temporal_coords.append([year, julian_day])
        except Exception as e:
            print(f'Could not extract timestamp for {file} ({e})')

    imgs = np.stack(imgs, axis=0)  # num_frames, H, W, C
    imgs = np.moveaxis(imgs, -1, 0).astype("float32")  # C, num_frames, H, W
    imgs = np.expand_dims(imgs, axis=0)  # add batch di

    return imgs, temporal_coords, location_coords, metas


def run_model(
    model: torch.nn.Module,
    input_data: torch.Tensor,
    temporal_coords: None | torch.Tensor,
    location_coords: None | torch.Tensor,
    mask_ratio: float,
    device: torch.device,
):
    """Run *model* with *input_data* and create images from output tokens (mask, reconstructed + visible).

    Args:
        model: MAE model to run.
        input_data: torch.Tensor with shape (B, C, T, H, W).
        mask_ratio: mask ratio to use.
        device: device where model should run.

    Returns:
        3 torch.Tensor with shape (B, C, T, H, W).
    """

    with torch.no_grad():
        x = input_data.to(device)

        _, pred, mask = model(x, temporal_coords, location_coords, mask_ratio)

    # Create mask and prediction images (un-patchify)
    mask_img = (
        model.unpatchify(mask.unsqueeze(-1).repeat(1, 1, pred.shape[-1])).detach().cpu()
    )
    pred_img = model.unpatchify(pred).detach().cpu()

    # Mix visible and predicted patches
    rec_img = input_data.clone()
    rec_img[mask_img == 1] = pred_img[
        mask_img == 1
    ]  # binary mask: 0 is keep, 1 is remove

    # Switch zeros/ones in mask images so masked patches appear darker in plots (better visualization)
    mask_img = (~(mask_img.to(torch.bool))).to(torch.float)

    return rec_img, mask_img


def save_rgb_imgs(
    input_img, rec_img, mask_img, channels, mean, std, output_dir, meta_data
):
    """Wrapper function to save Geotiff images (original, reconstructed, masked) per timestamp.

    Args:
        input_img: input torch.Tensor with shape (C, T, H, W).
        rec_img: reconstructed torch.Tensor with shape (C, T, H, W).
        mask_img: mask torch.Tensor with shape (C, T, H, W).
        channels: list of indices representing RGB channels.
        mean: list of mean values for each band.
        std: list of std values for each band.
        output_dir: directory where to save outputs.
        meta_data: list of dicts with geotiff meta info.
    """

    for t in range(input_img.shape[1]):
        rgb_orig, rgb_pred = process_channel_group(
            orig_img=input_img[:, t, :, :],
            new_img=rec_img[:, t, :, :],
            channels=channels,
            mean=mean,
            std=std,
        )

        rgb_mask = mask_img[channels, t, :, :] * rgb_orig

        # Saving images

        save_geotiff(
            image=_convert_np_uint8(rgb_orig),
            output_path=os.path.join(output_dir, f"original_rgb_t{t}.tiff"),
            meta=meta_data[t],
        )

        save_geotiff(
            image=_convert_np_uint8(rgb_pred),
            output_path=os.path.join(output_dir, f"predicted_rgb_t{t}.tiff"),
            meta=meta_data[t],
        )

        save_geotiff(
            image=_convert_np_uint8(rgb_mask),
            output_path=os.path.join(output_dir, f"masked_rgb_t{t}.tiff"),
            meta=meta_data[t],
        )


def save_imgs(rec_img, mask_img, mean, std, output_dir, meta_data):
    """Wrapper function to save Geotiff images (reconstructed, mask) per timestamp.

    Args:
        rec_img: reconstructed torch.Tensor with shape (C, T, H, W).
        mask_img: mask torch.Tensor with shape (C, T, H, W).
        mean: list of mean values for each band.
        std: list of std values for each band.
        output_dir: directory where to save outputs.
        meta_data: list of dicts with geotiff meta info.
    """

    mean = torch.tensor(np.asarray(mean)[:, None, None])  # C H W
    std = torch.tensor(np.asarray(std)[:, None, None])

    for t in range(rec_img.shape[1]):
        # Back to original data range
        rec_img_t = ((rec_img[:, t, :, :] * std) + mean).to(torch.int16)

        mask_img_t = mask_img[:, t, :, :].to(torch.int16)

        # Saving images

        save_geotiff(
            image=rec_img_t,
            output_path=os.path.join(output_dir, f"predicted_t{t}.tiff"),
            meta=meta_data[t],
        )

        save_geotiff(
            image=mask_img_t,
            output_path=os.path.join(output_dir, f"mask_t{t}.tiff"),
            meta=meta_data[t],
        )


def main(
    data_files: List[str],
    config_path: str,
    checkpoint: str,
    output_dir: str,
    rgb_outputs: bool,
    mask_ratio: float = None,
    input_indices: list[int] = None,
):
    os.makedirs(output_dir, exist_ok=True)

    # Get parameters --------

    import json
    with open(config_path, "r") as f:
        config = yaml.safe_load(f)['pretrained_cfg']

    batch_size = 1
    bands = config['bands']
    num_frames = len(data_files)
    mean = config['mean']
    std = config['std']
    coords_encoding = config['coords_encoding']
    img_size = config['img_size']
    mask_ratio = mask_ratio or config['mask_ratio']

    print(
        f"\nTreating {len(data_files)} files as {len(data_files)} time steps from the same location\n"
    )
    if len(data_files) != 4:
        print(
            "The original model was trained for four time steps. \nResults with different numbers of time steps may vary"
        )

    if torch.cuda.is_available():
        device = torch.device("cuda")
    else:
        device = torch.device("cpu")

    print(f"Using {device} device.\n")

    # Loading data ---------------------------------------------------------------------------------

    input_data, temporal_coords, location_coords, meta_data = load_example(
        file_paths=data_files, indices=input_indices, mean=mean, std=std
    )

    if len(temporal_coords) != num_frames and 'time' in coords_encoding:
        coords_encoding.pop('time')
    if not len(location_coords) and 'location' in coords_encoding:
        coords_encoding.pop('location')

    # Create model and load checkpoint -------------------------------------------------------------

    config.update(
        coords_encoding=coords_encoding,
        num_frames=num_frames,
        in_chans=len(bands),
    )

    model = PrithviMAE(**config)

    total_params = sum(p.numel() for p in model.parameters() if p.requires_grad)
    print(f"\n--> Model has {total_params:,} parameters.\n")

    model.to(device)

    state_dict = torch.load(checkpoint, map_location=device, weights_only=True)
    # discard fixed pos_embedding weight
    for k in list(state_dict.keys()):
        if k == 'encoder.pos_embed':
            state_dict[k] = model.encoder.pos_embed
        elif k == 'decoder.decoder_pos_embed':
            state_dict[k] = model.decoder.decoder_pos_embed
    model.load_state_dict(state_dict, strict=True)
    print(f"Loaded checkpoint from {checkpoint}")

    # Running model --------------------------------------------------------------------------------

    model.eval()
    channels = [bands.index(b) for b in ["B04", "B03", "B02"]]  # BGR -> RGB

    # Reflect pad if not divisible by img_size
    original_h, original_w = input_data.shape[-2:]
    pad_h = img_size - (original_h % img_size)
    pad_w = img_size - (original_w % img_size)
    input_data = np.pad(
        input_data, ((0, 0), (0, 0), (0, 0), (0, pad_h), (0, pad_w)), mode="reflect"
    )

    # Build sliding window
    batch = torch.tensor(input_data, device="cpu")
    windows = batch.unfold(3, img_size, img_size).unfold(4, img_size, img_size)
    h1, w1 = windows.shape[3:5]
    windows = rearrange(
        windows, "b c t h1 w1 h w -> (b h1 w1) c t h w", h=img_size, w=img_size
    )

    # Split into batches if number of windows > batch_size
    num_batches = windows.shape[0] // batch_size if windows.shape[0] > batch_size else 1
    windows = torch.tensor_split(windows, num_batches, dim=0)

    temporal_coords = torch.Tensor(temporal_coords, device=device).unsqueeze(0)
    location_coords = torch.Tensor(location_coords[0], device=device).unsqueeze(0)

    # Run model
    rec_imgs = []
    mask_imgs = []
    for x in windows:
        rec_img, mask_img = run_model(model, x, temporal_coords, location_coords, mask_ratio, device)
        rec_imgs.append(rec_img)
        mask_imgs.append(mask_img)

    rec_imgs = torch.concat(rec_imgs, dim=0)
    mask_imgs = torch.concat(mask_imgs, dim=0)

    # Build images from patches
    rec_imgs = rearrange(
        rec_imgs,
        "(b h1 w1) c t h w -> b c t (h1 h) (w1 w)",
        h=img_size,
        w=img_size,
        b=1,
        c=len(bands),
        t=num_frames,
        h1=h1,
        w1=w1,
    )
    mask_imgs = rearrange(
        mask_imgs,
        "(b h1 w1) c t h w -> b c t (h1 h) (w1 w)",
        h=img_size,
        w=img_size,
        b=1,
        c=len(bands),
        t=num_frames,
        h1=h1,
        w1=w1,
    )

    # Cut padded images back to original size
    rec_imgs_full = rec_imgs[..., :original_h, :original_w]
    mask_imgs_full = mask_imgs[..., :original_h, :original_w]
    batch_full = batch[..., :original_h, :original_w]

    # Build output images
    if rgb_outputs:
        for d in meta_data:
            d.update(count=3, dtype="uint8", compress="lzw", nodata=0)

        save_rgb_imgs(
            batch_full[0, ...],
            rec_imgs_full[0, ...],
            mask_imgs_full[0, ...],
            channels,
            mean,
            std,
            output_dir,
            meta_data,
        )
    else:
        for d in meta_data:
            d.update(compress="lzw", nodata=0)

        save_imgs(
            rec_imgs_full[0, ...],
            mask_imgs_full[0, ...],
            mean,
            std,
            output_dir,
            meta_data,
        )

    print("Done!")


if __name__ == "__main__":
    parser = argparse.ArgumentParser("MAE run inference", add_help=False)

    parser.add_argument(
        "--data_files",
        type=str,
        nargs="+",
        default=["examples/Mexico_HLS.S30.T13REM.2018026T173609.v2.0_cropped.tif",
                 "examples/Mexico_HLS.S30.T13REM.2018106T172859.v2.0_cropped.tif",
                 "examples/Mexico_HLS.S30.T13REM.2018201T172901.v2.0_cropped.tif",
                 "examples/Mexico_HLS.S30.T13REM.2018266T173029.v2.0_cropped.tif",
                 ],
        help="Path to the data files. Assumes multi-band files.",
    )
    parser.add_argument(
        "--config_path",
        "-c",
        type=str,
        default="config.json",
        help="Path to json file containing model training parameters.",
    )
    parser.add_argument(
        "--checkpoint",
        type=str,
        default="Prithvi_EO_V2_100M_TL.pt",
        help="Path to a checkpoint file to load from.",
    )
    parser.add_argument(
        "--output_dir",
        type=str,
        default="output",
        help="Path to the directory where to save outputs.",
    )
    parser.add_argument(
        "--mask_ratio",
        default=0.75,
        type=float,
        help="Masking ratio (percentage of removed patches). "
        "If None (default) use same value used for pretraining.",
    )
    parser.add_argument(
        "--input_indices",
        default=None,
        type=int,
        nargs="+",
        help="0-based indices of channels to be selected from the input. By default takes all.",
    )
    parser.add_argument(
        "--rgb_outputs",
        action="store_true",
        help="If present, output files will only contain RGB channels. "
        "Otherwise, all bands will be saved.",
    )
    args = parser.parse_args()

    main(**vars(args))
