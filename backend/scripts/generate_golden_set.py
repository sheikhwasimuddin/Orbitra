import json
from pathlib import Path
import sys

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parents[1]
if str(ROOT) not in sys.path:
    sys.path.insert(0, str(ROOT))

from app.services.lightweight_service import LightweightAnalyzerService


def make_image(rgb: tuple[int, int, int], path: Path) -> None:
    arr = np.zeros((256, 256, 3), dtype=np.uint8)
    arr[:, :, 0] = rgb[0]
    arr[:, :, 1] = rgb[1]
    arr[:, :, 2] = rgb[2]
    Image.fromarray(arr).save(path, format="PNG")


def main() -> None:
    root = ROOT
    image_dir = root / "golden" / "images"
    expected_path = root / "golden" / "expected_analyze.json"
    image_dir.mkdir(parents=True, exist_ok=True)

    # Chosen RGB mixes to represent typical pseudo-satellite class tendencies.
    fixtures = [
        {"id": "urban_like", "rgb": (170, 150, 120)},
        {"id": "vegetation_like", "rgb": (60, 180, 70)},
        {"id": "water_like", "rgb": (45, 80, 190)},
    ]

    analyzer = LightweightAnalyzerService()
    expected = []

    for item in fixtures:
        file_name = f"{item['id']}.png"
        file_path = image_dir / file_name
        make_image(item["rgb"], file_path)

        with file_path.open("rb") as f:
            result = analyzer.analyze(f.read())

        expected.append(
            {
                "id": item["id"],
                "file": f"golden/images/{file_name}",
                "rgb": item["rgb"],
                "top_label": result["predictions"][0]["label"],
                "predictions": [
                    {
                        "label": p["label"],
                        "confidence": round(float(p["confidence"]), 6),
                    }
                    for p in result["predictions"]
                ],
                "embedding_summary": {
                    "dimension": int(result["embedding_summary"]["dimension"]),
                    "mean": round(float(result["embedding_summary"]["mean"]), 6),
                    "std": round(float(result["embedding_summary"]["std"]), 6),
                },
            }
        )

    payload = {
        "model": "lightweight-demo",
        "note": "Generated from deterministic synthetic PNG fixtures.",
        "items": expected,
    }

    with expected_path.open("w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2)

    print(f"Golden fixture set generated at: {expected_path}")


if __name__ == "__main__":
    main()
