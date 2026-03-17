import json
import os
import sys
from pathlib import Path
from typing import Any, Dict, Tuple

import numpy as np
import torch


class PrithviEmbedder:
    def __init__(self, device: str = "cpu") -> None:
        self.device = device

        base_dir = Path(__file__).resolve().parents[3]
        model_dir = base_dir / "models" / "prithvi_100m_full"
        self.model_dir = model_dir
        self.weights_path = model_dir / "Prithvi_EO_V2_100M_TL.pt"
        self.config_path = model_dir / "config.json"

        if not self.weights_path.exists() or not self.config_path.exists():
            raise FileNotFoundError(
                "Prithvi model files missing. Expected config.json and Prithvi_EO_V2_100M_TL.pt in models/prithvi_100m_full."
            )

        sys.path.append(str(model_dir))
        import prithvi_mae  # type: ignore

        with open(self.config_path, "r", encoding="utf-8") as f:
            cfg = json.load(f)

        self.cfg = cfg
        self.pretrained_cfg = cfg["pretrained_cfg"]

        self.img_size = int(self.pretrained_cfg["img_size"])
        self.in_chans = int(self.pretrained_cfg["in_chans"])
        self.num_frames = int(self.pretrained_cfg["num_frames"])
        self.embed_dim = int(self.pretrained_cfg["embed_dim"])
        self.mean = np.array(self.pretrained_cfg["mean"], dtype=np.float32)
        self.std = np.array(self.pretrained_cfg["std"], dtype=np.float32)

        self.model = prithvi_mae.PrithviMAE(**self.pretrained_cfg)
        checkpoint = torch.load(self.weights_path, map_location=device)
        self.model.load_state_dict(checkpoint, strict=True)
        self.model.eval()
        self.model.to(device)

    def _get_default_coords(self) -> Tuple[torch.Tensor, torch.Tensor]:
        # Exact working coordinate shapes discovered in your local validation.
        time_coords = torch.zeros((1, self.num_frames, 2), dtype=torch.float32, device=self.device)
        location_coords = torch.zeros((1, 2), dtype=torch.float32, device=self.device)
        return time_coords, location_coords

    def extract_embedding(self, x: torch.Tensor) -> Tuple[torch.Tensor, torch.Tensor]:
        time_coords, location_coords = self._get_default_coords()

        with torch.no_grad():
            output = self.model.encoder(x, time_coords, location_coords)

        tokens = output[0]
        embedding = tokens.mean(dim=1)
        return embedding, tokens

    def preprocess_real_array(self, arr: Any) -> torch.Tensor:
        np_arr = np.asarray(arr, dtype=np.float32)
        expected_shape = (self.in_chans, self.num_frames, self.img_size, self.img_size)
        if tuple(np_arr.shape) != expected_shape:
            raise ValueError(f"Expected array shape {expected_shape}, got {tuple(np_arr.shape)}")

        mean = self.mean[:, None, None, None]
        std = self.std[:, None, None, None]
        np_arr = (np_arr - mean) / std

        x = torch.tensor(np_arr, dtype=torch.float32).unsqueeze(0)
        return x.to(self.device)

    def extract_dummy_embedding(self) -> Dict[str, Any]:
        # Exact working input shape: [1, 6, 4, 224, 224]
        x = torch.randn(
            1,
            self.in_chans,
            self.num_frames,
            self.img_size,
            self.img_size,
            dtype=torch.float32,
            device=self.device,
        )

        embedding, tokens = self.extract_embedding(x)

        embedding_np = embedding.detach().cpu().numpy()
        tokens_shape = list(tokens.shape)
        embedding_shape = list(embedding.shape)

        return {
            "token_shape": tokens_shape,
            "embedding_shape": embedding_shape,
            "embedding_preview": [round(float(v), 6) for v in embedding_np[0, :16]],
            "embedding_stats": {
                "mean": round(float(embedding_np.mean()), 6),
                "std": round(float(embedding_np.std()), 6),
                "min": round(float(embedding_np.min()), 6),
                "max": round(float(embedding_np.max()), 6),
            },
            "metadata": {
                "img_size": self.img_size,
                "in_chans": self.in_chans,
                "num_frames": self.num_frames,
                "bands": ["B02", "B03", "B04", "B05", "B06", "B07"],
            },
        }

    def extract_embedding_from_array(self, arr: Any) -> Dict[str, Any]:
        x = self.preprocess_real_array(arr)
        embedding, tokens = self.extract_embedding(x)

        embedding_np = embedding.detach().cpu().numpy()

        return {
            "token_shape": list(tokens.shape),
            "embedding_shape": list(embedding.shape),
            "embedding_preview": [round(float(v), 6) for v in embedding_np[0, :16]],
            "embedding_stats": {
                "mean": round(float(embedding_np.mean()), 6),
                "std": round(float(embedding_np.std()), 6),
                "min": round(float(embedding_np.min()), 6),
                "max": round(float(embedding_np.max()), 6),
            },
            "metadata": {
                "img_size": self.img_size,
                "in_chans": self.in_chans,
                "num_frames": self.num_frames,
                "bands": ["B02", "B03", "B04", "B05", "B06", "B07"],
            },
        }
