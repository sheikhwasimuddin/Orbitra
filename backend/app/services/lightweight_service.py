import io
import time
from typing import Dict, List

import numpy as np
from PIL import Image
import tifffile

from app.utils.demo_data import DEMO_CLASSES


class LightweightAnalyzerService:
    def __init__(self, embedding_dim: int = 256) -> None:
        self.model_name = "lightweight-demo"
        self.embedding_dim = embedding_dim

    def _read_image(self, image_bytes: bytes) -> Image.Image:
        try:
            return Image.open(io.BytesIO(image_bytes)).convert("RGB")
        except Exception:
            # Some GeoTIFFs are unsupported by local Pillow build; decode with tifffile fallback.
            arr = tifffile.imread(io.BytesIO(image_bytes))
            rgb = self._to_uint8_rgb(arr)
            return Image.fromarray(rgb, mode="RGB")

    def _to_uint8_rgb(self, arr: np.ndarray) -> np.ndarray:
        np_arr = np.asarray(arr)

        if np_arr.ndim == 2:
            np_arr = np_arr[:, :, None]
        elif np_arr.ndim == 3 and np_arr.shape[0] <= 16 and np_arr.shape[0] < np_arr.shape[-1]:
            # Convert channel-first arrays (C, H, W) to (H, W, C).
            np_arr = np.transpose(np_arr, (1, 2, 0))
        elif np_arr.ndim > 3:
            # For stacks/time-series, use the first frame.
            np_arr = np_arr[0]
            if np_arr.ndim == 3 and np_arr.shape[0] <= 16 and np_arr.shape[0] < np_arr.shape[-1]:
                np_arr = np.transpose(np_arr, (1, 2, 0))

        if np_arr.ndim != 3:
            raise ValueError(f"Unsupported TIFF array shape: {np_arr.shape}")

        if np_arr.shape[2] == 1:
            np_arr = np.repeat(np_arr, 3, axis=2)
        elif np_arr.shape[2] >= 3:
            np_arr = np_arr[:, :, :3]
        else:
            raise ValueError(f"Unsupported TIFF channels: {np_arr.shape[2]}")

        np_arr = np_arr.astype(np.float32)
        min_v = float(np_arr.min())
        max_v = float(np_arr.max())
        if max_v <= min_v:
            return np.zeros(np_arr.shape, dtype=np.uint8)

        scaled = (np_arr - min_v) / (max_v - min_v)
        return (scaled * 255.0).clip(0, 255).astype(np.uint8)

    def _embedding_from_image(self, img: Image.Image) -> np.ndarray:
        # A deterministic lightweight embedding: grayscale 16x16 flattened to 256 dims.
        gray_small = img.convert("L").resize((16, 16))
        vec = np.asarray(gray_small, dtype=np.float32).reshape(-1) / 255.0
        return vec

    def _predict_land_cover(self, img: Image.Image) -> List[Dict[str, float]]:
        arr = np.asarray(img.resize((224, 224)), dtype=np.float32) / 255.0
        r_mean = float(arr[:, :, 0].mean())
        g_mean = float(arr[:, :, 1].mean())
        b_mean = float(arr[:, :, 2].mean())

        urban = 0.45 * r_mean + 0.30 * b_mean + 0.25 * (1.0 - g_mean)
        vegetation = 0.65 * g_mean + 0.20 * (1.0 - r_mean) + 0.15 * (1.0 - b_mean)
        water = 0.60 * b_mean + 0.25 * (1.0 - r_mean) + 0.15 * (1.0 - g_mean)
        bare_soil = 0.55 * r_mean + 0.35 * g_mean + 0.10 * (1.0 - b_mean)
        snow_ice = 0.40 * (r_mean + g_mean + b_mean) / 3.0 + 0.60 * min(r_mean, g_mean, b_mean)
        cloud_cover = 0.55 * max(r_mean, g_mean, b_mean) + 0.45 * (1.0 - np.std(arr))

        raw_scores = np.array([urban, vegetation, water, bare_soil, snow_ice, cloud_cover], dtype=np.float32)
        # Stable softmax conversion to confidence scores.
        shifted = raw_scores - raw_scores.max()
        probs = np.exp(shifted)
        probs = probs / probs.sum()

        pairs = [{"label": label, "confidence": float(conf)} for label, conf in zip(DEMO_CLASSES, probs)]
        pairs.sort(key=lambda x: x["confidence"], reverse=True)
        return pairs[:3]

    def analyze(self, image_bytes: bytes) -> Dict:
        start = time.perf_counter()
        img = self._read_image(image_bytes)
        embedding = self._embedding_from_image(img)
        predictions = self._predict_land_cover(img)

        duration_ms = int((time.perf_counter() - start) * 1000)
        return {
            "success": True,
            "model": self.model_name,
            "predictions": predictions,
            "embedding_summary": {
                "dimension": int(embedding.shape[0]),
                "mean": round(float(embedding.mean()), 6),
                "std": round(float(embedding.std()), 6),
            },
            "analysis_time_ms": duration_ms,
            "embedding": embedding,
        }
