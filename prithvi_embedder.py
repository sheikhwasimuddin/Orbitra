import os
import sys
import json
import torch
import numpy as np

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models", "prithvi_100m_full")
WEIGHTS_PATH = os.path.join(MODEL_DIR, "Prithvi_EO_V2_100M_TL.pt")
CONFIG_PATH = os.path.join(MODEL_DIR, "config.json")

sys.path.append(MODEL_DIR)
import prithvi_mae


class PrithviEmbedder:
    def __init__(self, device="cpu"):
        self.device = device

        with open(CONFIG_PATH, "r") as f:
            cfg = json.load(f)

        self.cfg = cfg
        self.pretrained_cfg = cfg["pretrained_cfg"]

        self.img_size = self.pretrained_cfg["img_size"]
        self.in_chans = self.pretrained_cfg["in_chans"]      # 6
        self.num_frames = self.pretrained_cfg["num_frames"]  # 4
        self.embed_dim = self.pretrained_cfg["embed_dim"]    # 768
        self.mean = np.array(self.pretrained_cfg["mean"], dtype=np.float32)
        self.std = np.array(self.pretrained_cfg["std"], dtype=np.float32)

        self.model = prithvi_mae.PrithviMAE(**self.pretrained_cfg)
        checkpoint = torch.load(WEIGHTS_PATH, map_location=device)
        self.model.load_state_dict(checkpoint, strict=True)
        self.model.eval()
        self.model.to(device)

        print("✅ PrithviEmbedder initialized successfully")

    def preprocess_dummy(self):
        """
        Creates dummy multispectral-temporal data for testing.
        Shape expected: [B, C, T, H, W] = [1, 6, 4, 224, 224]
        """
        x = torch.randn(
            1,
            self.in_chans,
            self.num_frames,
            self.img_size,
            self.img_size,
            dtype=torch.float32
        )
        return x.to(self.device)

    def preprocess_real_array(self, arr):
        """
        arr expected shape:
        [C, T, H, W] = [6, 4, 224, 224]
        Returns:
        [1, C, T, H, W]
        """
        arr = np.asarray(arr, dtype=np.float32)

        if arr.shape != (self.in_chans, self.num_frames, self.img_size, self.img_size):
            raise ValueError(
                f"Expected shape {(self.in_chans, self.num_frames, self.img_size, self.img_size)}, got {arr.shape}"
            )

        # Normalize per channel (broadcast over T,H,W)
        mean = self.mean[:, None, None, None]
        std = self.std[:, None, None, None]
        arr = (arr - mean) / std

        x = torch.tensor(arr, dtype=torch.float32).unsqueeze(0)  # [1, C, T, H, W]
        return x.to(self.device)

    def get_default_coords(self):
        """
        Based on successful discovery:
        time_coords shape = [1, 4, 2]
        location_coords shape = [1, 2]
        """
        time_coords = torch.zeros((1, self.num_frames, 2), dtype=torch.float32, device=self.device)
        location_coords = torch.zeros((1, 2), dtype=torch.float32, device=self.device)
        return time_coords, location_coords

    def extract_embedding(self, x):
        """
        x shape: [1, C, T, H, W]
        Returns:
        - embedding: [1, 768]
        - tokens: [1, 197, 768]
        """
        time_coords, location_coords = self.get_default_coords()

        with torch.no_grad():
            output = self.model.encoder(x, time_coords, location_coords)

        tokens = output[0]  # [B, N, D] = [1, 197, 768]
        embedding = tokens.mean(dim=1)  # [1, 768]

        return embedding, tokens

    def extract_dummy_embedding(self):
        x = self.preprocess_dummy()
        return self.extract_embedding(x)


if __name__ == "__main__":
    embedder = PrithviEmbedder(device="cpu")

    embedding, tokens = embedder.extract_dummy_embedding()

    print("✅ Tokens shape:", tokens.shape)
    print("✅ Embedding shape:", embedding.shape)
    print("First 10 values:", embedding[0, :10])