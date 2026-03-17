from typing import Dict

import numpy as np

from app.services.lightweight_service import LightweightAnalyzerService


class CompareService:
    def __init__(self, analyzer: LightweightAnalyzerService) -> None:
        self.analyzer = analyzer

    @staticmethod
    def _cosine_similarity(a: np.ndarray, b: np.ndarray) -> float:
        denom = np.linalg.norm(a) * np.linalg.norm(b)
        if denom == 0:
            return 0.0
        return float(np.dot(a, b) / denom)

    def compare(self, image1_bytes: bytes, image2_bytes: bytes) -> Dict:
        result1 = self.analyzer.analyze(image1_bytes)
        result2 = self.analyzer.analyze(image2_bytes)

        emb1 = result1["embedding"]
        emb2 = result2["embedding"]

        cosine = self._cosine_similarity(emb1, emb2)
        change_score = float(max(0.0, min(1.0, 1.0 - ((cosine + 1.0) / 2.0))))

        return {
            "success": True,
            "image1_top_class": result1["predictions"][0]["label"],
            "image2_top_class": result2["predictions"][0]["label"],
            "cosine_similarity": round(cosine, 4),
            "change_score": round(change_score, 4),
        }
