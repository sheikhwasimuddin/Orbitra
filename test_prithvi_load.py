import os
import sys
import json
import torch

# ---------------------------------------------------
# 1. Absolute paths
# ---------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_DIR = os.path.join(BASE_DIR, "models", "prithvi_100m_full")
WEIGHTS_PATH = os.path.join(MODEL_DIR, "Prithvi_EO_V2_100M_TL.pt")
CONFIG_PATH = os.path.join(MODEL_DIR, "config.json")

print("BASE_DIR:", BASE_DIR)
print("MODEL_DIR:", MODEL_DIR)
print("WEIGHTS_PATH exists:", os.path.exists(WEIGHTS_PATH))
print("CONFIG_PATH exists:", os.path.exists(CONFIG_PATH))

# Add model folder to Python path
sys.path.append(MODEL_DIR)

# ---------------------------------------------------
# 2. Import model code
# ---------------------------------------------------
try:
    import prithvi_mae
    print("✅ prithvi_mae imported successfully")
except Exception as e:
    print("❌ Failed to import prithvi_mae")
    print("Error:", e)
    sys.exit(1)

# ---------------------------------------------------
# 3. Load config
# ---------------------------------------------------
try:
    with open(CONFIG_PATH, "r") as f:
        cfg = json.load(f)
    print("✅ config loaded")
    print("Architecture name:", cfg.get("architecture"))
    print("Num features:", cfg.get("num_features"))
except Exception as e:
    print("❌ Failed to load config")
    print("Error:", e)
    sys.exit(1)

# ---------------------------------------------------
# 4. Build model using pretrained_cfg
# ---------------------------------------------------
pretrained_cfg = cfg.get("pretrained_cfg", {})
print("\n🔍 pretrained_cfg:")
for k, v in pretrained_cfg.items():
    print(f"  {k}: {v}")

model = None

try:
    model = prithvi_mae.PrithviMAE(**pretrained_cfg)
    print("\n✅ PrithviMAE created successfully with pretrained_cfg")
except Exception as e:
    print("\n❌ Failed to initialize PrithviMAE with pretrained_cfg")
    print("Error:", e)
    sys.exit(1)

# ---------------------------------------------------
# 5. Load checkpoint
# ---------------------------------------------------
try:
    checkpoint = torch.load(WEIGHTS_PATH, map_location="cpu")
    print("\n✅ checkpoint loaded")
    print("Checkpoint type:", type(checkpoint))
    if isinstance(checkpoint, dict):
        print("Checkpoint keys sample:", list(checkpoint.keys())[:20])
except Exception as e:
    print("❌ Failed to load checkpoint")
    print("Error:", e)
    sys.exit(1)

# This checkpoint appears to be a direct state_dict
state_dict = checkpoint

# Remove possible "module." prefix
clean_state_dict = {}
for k, v in state_dict.items():
    if k.startswith("module."):
        clean_state_dict[k.replace("module.", "", 1)] = v
    else:
        clean_state_dict[k] = v

# ---------------------------------------------------
# 6. Load weights into model
# ---------------------------------------------------
try:
    missing, unexpected = model.load_state_dict(clean_state_dict, strict=False)
    print("\n✅ Weights loaded into PrithviMAE")
    print("Missing keys:", len(missing))
    print("Unexpected keys:", len(unexpected))

    if missing[:10]:
        print("Sample missing keys:", missing[:10])
    if unexpected[:10]:
        print("Sample unexpected keys:", unexpected[:10])

except Exception as e:
    print("❌ Failed to load state_dict into model")
    print("Error:", e)
    sys.exit(1)

model.eval()
print("✅ Model set to eval mode")

# ---------------------------------------------------
# 7. Inspect structure
# ---------------------------------------------------
print("\n📦 Model type:", type(model))

if hasattr(model, "encoder"):
    print("✅ model.encoder exists:", type(model.encoder))
if hasattr(model, "decoder"):
    print("✅ model.decoder exists:", type(model.decoder))

# ---------------------------------------------------
# 8. Dummy forward test using expected shape from config
# Expected:
# batch=1, channels=6, frames=4, H=224, W=224
# ---------------------------------------------------
print("\n🧪 Trying dummy input with expected Prithvi shape...")

try:
    img_size = pretrained_cfg.get("img_size", 224)
    in_chans = pretrained_cfg.get("in_chans", 6)
    num_frames = pretrained_cfg.get("num_frames", 4)

    # Likely expected shape: [B, C, T, H, W]
    x = torch.randn(1, in_chans, num_frames, img_size, img_size)
    print("Dummy input shape:", x.shape)

    # Try optional coords if model requires them
    # time coords shape guess: [B, T]
    time_coords = torch.zeros((1, num_frames), dtype=torch.float32)

    # location coords shape guess: [B, 2] -> lat, lon
    location_coords = torch.zeros((1, 2), dtype=torch.float32)

    with torch.no_grad():
        try:
            out = model(x, time_coords=time_coords, location_coords=location_coords)
            print("✅ Forward pass worked with coords kwargs")
        except TypeError:
            try:
                out = model(x, time_coords, location_coords)
                print("✅ Forward pass worked with positional coords args")
            except TypeError:
                out = model(x)
                print("✅ Forward pass worked without coords")
    
    if isinstance(out, (tuple, list)):
        print("Output type: tuple/list")
        for i, item in enumerate(out):
            if hasattr(item, "shape"):
                print(f"  Output[{i}] shape: {item.shape}")
            else:
                print(f"  Output[{i}] type: {type(item)}")
    elif hasattr(out, "shape"):
        print("Output shape:", out.shape)
    else:
        print("Output type:", type(out))

except Exception as e:
    print("⚠️ Dummy forward failed (this can still be okay)")
    print("Forward error:", e)

print("\n🎉 DONE!")
print("If weights loaded successfully, next step is to use model.encoder for embeddings.")