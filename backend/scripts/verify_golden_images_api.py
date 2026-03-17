import json
import sys
from pathlib import Path
import mimetypes

import requests

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))


def assert_close(a: float, b: float, tol: float, msg: str) -> None:
    if abs(a - b) > tol:
        raise AssertionError(f"{msg}: expected {b}, got {a}")


def main() -> int:
    base_url = sys.argv[1] if len(sys.argv) > 1 else "http://localhost:8000/api"

    root = ROOT
    expected_path = root / "golden" / "expected_analyze.json"

    if not expected_path.exists():
        raise FileNotFoundError(
            "Golden expected file missing. Run: python backend/scripts/generate_golden_set.py"
        )

    with expected_path.open("r", encoding="utf-8") as f:
        expected = json.load(f)

    print(f"Verifying API outputs against golden set at {expected_path}")

    try:
        health = requests.get(f"{base_url}/health", timeout=10)
        health.raise_for_status()
    except Exception as exc:
        raise RuntimeError(
            f"Backend is not reachable at {base_url}. Start backend first, then rerun. Details: {exc}"
        ) from exc

    for item in expected["items"]:
        image_path = root / item["file"]
        mime_type, _ = mimetypes.guess_type(str(image_path))
        if not mime_type:
            mime_type = "application/octet-stream"
        with image_path.open("rb") as img_file:
            files = {"file": (image_path.name, img_file.read(), mime_type)}

        r = requests.post(f"{base_url}/analyze", files=files, timeout=60)
        r.raise_for_status()
        data = r.json()

        if not data.get("success"):
            raise AssertionError(f"{item['id']}: success=false")

        actual_top = data["predictions"][0]["label"]
        expected_top = item["top_label"]
        if actual_top != expected_top:
            raise AssertionError(f"{item['id']}: top label mismatch, expected {expected_top}, got {actual_top}")

        for i, pred in enumerate(item["predictions"]):
            actual_pred = data["predictions"][i]
            if actual_pred["label"] != pred["label"]:
                raise AssertionError(
                    f"{item['id']}: prediction[{i}] label mismatch, expected {pred['label']}, got {actual_pred['label']}"
                )
            assert_close(
                float(actual_pred["confidence"]),
                float(pred["confidence"]),
                tol=1e-5,
                msg=f"{item['id']}: prediction[{i}] confidence mismatch",
            )

        actual_summary = data["embedding_summary"]
        expected_summary = item["embedding_summary"]
        if int(actual_summary["dimension"]) != int(expected_summary["dimension"]):
            raise AssertionError(f"{item['id']}: embedding dimension mismatch")

        assert_close(
            float(actual_summary["mean"]),
            float(expected_summary["mean"]),
            tol=1e-5,
            msg=f"{item['id']}: embedding mean mismatch",
        )
        assert_close(
            float(actual_summary["std"]),
            float(expected_summary["std"]),
            tol=1e-5,
            msg=f"{item['id']}: embedding std mismatch",
        )

        print(f"PASS: {item['id']} -> {actual_top}")

    print("ALL GOLDEN IMAGE CHECKS PASSED")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
