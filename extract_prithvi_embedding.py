import os
import sys
import json
import torch

# ---------------------------------------------------
# 1. Paths
# ---------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models", "prithvi_100m_full")
WEIGHTS_PATH = os.path.join(MODEL_DIR, "Prithvi_EO_V2_100M_TL.pt")
CONFIG_PATH = os.path.join(MODEL_DIR, "config.json")

sys.path.append(MODEL_DIR)

import prithvi_mae

# ---------------------------------------------------
# 2. Load config
# ---------------------------------------------------
with open(CONFIG_PATH, "r") as f:
    cfg = json.load(f)

pretrained_cfg = cfg["pretrained_cfg"]

# ---------------------------------------------------
# 3. Build model + load weights
# ---------------------------------------------------
model = prithvi_mae.PrithviMAE(**pretrained_cfg)

checkpoint = torch.load(WEIGHTS_PATH, map_location="cpu")
model.load_state_dict(checkpoint, strict=True)
model.eval()

print("✅ Prithvi model loaded successfully")

# ---------------------------------------------------
# 4. Create dummy multispectral + temporal input
# Expected shape: [B, C, T, H, W]
# ---------------------------------------------------
img_size = pretrained_cfg["img_size"]
in_chans = pretrained_cfg["in_chans"]
num_frames = pretrained_cfg["num_frames"]

x = torch.randn(1, in_chans, num_frames, img_size, img_size)

# ---------------------------------------------------
# 5. Build coordinate tensors
# IMPORTANT:
# We try shapes likely expected by the encoder.
# If one fails, we try alternatives.
# ---------------------------------------------------

# Candidate time coords shapes
time_candidates = [
    torch.zeros((1, num_frames), dtype=torch.float32),         # [B, T]
    torch.zeros((1, num_frames, 2), dtype=torch.float32),      # [B, T, 2]
    torch.zeros((1, num_frames, 1), dtype=torch.float32),      # [B, T, 1]
]

# Candidate location coords shapes
location_candidates = [
    torch.zeros((1, 2), dtype=torch.float32),                  # [B, 2]
    torch.zeros((1, num_frames, 2), dtype=torch.float32),      # [B, T, 2]
    torch.zeros((1, 1, 2), dtype=torch.float32),               # [B, 1, 2]
]

# ---------------------------------------------------
# 6. Try encoder-only forward for embeddings
# ---------------------------------------------------
success = False

for t_idx, time_coords in enumerate(time_candidates):
    for l_idx, location_coords in enumerate(location_candidates):
        try:
            with torch.no_grad():
                # Try keyword args first
                output = model.encoder(
                    x,
                    time_coords=time_coords,
                    location_coords=location_coords
                )

            print(f"\n✅ Encoder forward worked!")
            print(f"Used time candidate #{t_idx+1} shape: {tuple(time_coords.shape)}")
            print(f"Used location candidate #{l_idx+1} shape: {tuple(location_coords.shape)}")

            if isinstance(output, (tuple, list)):
                print("Encoder output type: tuple/list")
                for i, item in enumerate(output):
                    if hasattr(item, "shape"):
                        print(f"  Output[{i}] shape: {item.shape}")
                    else:
                        print(f"  Output[{i}] type: {type(item)}")

                # Usually first output is token embeddings
                tokens = output[0] if hasattr(output[0], "shape") else None
            else:
                print("Encoder output shape:", output.shape if hasattr(output, "shape") else type(output))
                tokens = output if hasattr(output, "shape") else None

            # Pool to a single embedding if possible
            if tokens is not None and len(tokens.shape) == 3:
                # tokens shape likely [B, N, D]
                embedding = tokens.mean(dim=1)  # mean pool over tokens
                print("✅ Pooled embedding shape:", embedding.shape)
                print("Sample embedding first 10 values:", embedding[0, :10])
            elif tokens is not None:
                print("⚠️ Tokens found but unexpected shape:", tokens.shape)

            success = True
            break

        except TypeError:
            try:
                with torch.no_grad():
                    # Try positional args
                    output = model.encoder(x, time_coords, location_coords)

                print(f"\n✅ Encoder forward worked with positional args!")
                print(f"Used time candidate #{t_idx+1} shape: {tuple(time_coords.shape)}")
                print(f"Used location candidate #{l_idx+1} shape: {tuple(location_coords.shape)}")

                if isinstance(output, (tuple, list)):
                    print("Encoder output type: tuple/list")
                    for i, item in enumerate(output):
                        if hasattr(item, "shape"):
                            print(f"  Output[{i}] shape: {item.shape}")
                        else:
                            print(f"  Output[{i}] type: {type(item)}")
                    tokens = output[0] if hasattr(output[0], "shape") else None
                else:
                    print("Encoder output shape:", output.shape if hasattr(output, "shape") else type(output))
                    tokens = output if hasattr(output, "shape") else None

                if tokens is not None and len(tokens.shape) == 3:
                    embedding = tokens.mean(dim=1)
                    print("✅ Pooled embedding shape:", embedding.shape)
                    print("Sample embedding first 10 values:", embedding[0, :10])

                success = True
                break

            except Exception as e:
                print(f"❌ Failed with time {tuple(time_coords.shape)} and location {tuple(location_coords.shape)}")
                print("Error:", e)

        except Exception as e:
            print(f"❌ Failed with time {tuple(time_coords.shape)} and location {tuple(location_coords.shape)}")
            print("Error:", e)

    if success:
        break

if not success:
    print("\n⚠️ Could not find the exact coordinate tensor shape automatically.")
    print("👉 But the model itself is loaded correctly.")
    print("👉 Next best step: inspect model.encoder.forward signature.")