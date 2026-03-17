from typing import List

import numpy as np

DEMO_CLASSES: List[str] = [
    "Urban Area",
    "Vegetation",
    "Water",
    "Bare Soil",
    "Snow/Ice",
    "Cloud Cover",
]

DEMO_SIMILARITY_ITEMS = [
    {"id": "demo_001", "title": "Urban Cluster A", "thumbnail": "/demo/urban1.svg"},
    {"id": "demo_002", "title": "River Delta B", "thumbnail": "/demo/water1.svg"},
    {"id": "demo_003", "title": "Agriculture Patch C", "thumbnail": "/demo/veg1.svg"},
    {"id": "demo_004", "title": "Industrial Grid D", "thumbnail": "/demo/urban2.svg"},
    {"id": "demo_005", "title": "Wetland Mosaic E", "thumbnail": "/demo/water2.svg"},
]


def build_demo_embedding(seed: int, dim: int = 256) -> np.ndarray:
    rng = np.random.default_rng(seed)
    vec = rng.normal(loc=0.0, scale=1.0, size=(dim,)).astype(np.float32)
    norm = np.linalg.norm(vec)
    if norm == 0:
        return vec
    return vec / norm
