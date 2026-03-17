import io
import json
import sys
from typing import Dict

import requests
from PIL import Image


def create_test_image() -> bytes:
    img = Image.new("RGB", (256, 256), color=(40, 120, 190))
    buf = io.BytesIO()
    img.save(buf, format="PNG")
    return buf.getvalue()


def assert_true(condition: bool, message: str) -> None:
    if not condition:
        raise AssertionError(message)


def check_health(base_url: str) -> None:
    r = requests.get(f"{base_url}/health", timeout=20)
    r.raise_for_status()
    data = r.json()
    assert_true(data.get("status") == "ok", "health status should be ok")


def check_analyze(base_url: str, image_bytes: bytes) -> None:
    files = {"file": ("test.png", image_bytes, "image/png")}
    r = requests.post(f"{base_url}/analyze", files=files, timeout=60)
    r.raise_for_status()
    data = r.json()

    assert_true(data.get("success") is True, "analyze success should be true")
    assert_true(data.get("model") == "lightweight-demo", "unexpected analyze model name")
    assert_true(len(data.get("predictions", [])) >= 1, "predictions should not be empty")


def check_prithvi(base_url: str) -> Dict:
    # Demo mode path: exact known working shape logic in backend.
    r = requests.post(f"{base_url}/prithvi-embed", json={"demo_mode": True}, timeout=180)
    r.raise_for_status()
    data = r.json()

    assert_true(data.get("success") is True, "prithvi success should be true")
    assert_true(data.get("token_shape") == [1, 197, 768], "token shape mismatch")
    assert_true(data.get("embedding_shape") == [1, 768], "embedding shape mismatch")

    stats = data.get("embedding_stats", {})
    for key in ["mean", "std", "min", "max"]:
      assert_true(key in stats, f"missing embedding stat: {key}")

    return data


def main() -> int:
    base_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000/api"
    print(f"Checking GeoVision FM backend at {base_url}")

    test_image = create_test_image()

    check_health(base_url)
    print("health check passed")

    check_analyze(base_url, test_image)
    print("analyze endpoint passed")

    prithvi_data = check_prithvi(base_url)
    print("prithvi endpoint passed")

    print("Prithvi preview (first 8):", prithvi_data["embedding_preview"][:8])
    print("ALL CHECKS PASSED")
    return 0


if __name__ == "__main__":
    try:
        raise SystemExit(main())
    except Exception as exc:
        print("CHECK FAILED:", str(exc))
        raise
