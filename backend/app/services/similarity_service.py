from typing import Dict, List

import numpy as np

from app.utils.demo_data import DEMO_SIMILARITY_ITEMS, build_demo_embedding

try:
    import faiss  # type: ignore
except Exception:
    faiss = None


class SimilarityService:
    def __init__(self, dim: int = 256) -> None:
        self.dim = dim
        self.catalog = []
        self.embeddings = []

        for idx, item in enumerate(DEMO_SIMILARITY_ITEMS):
            emb = build_demo_embedding(seed=100 + idx, dim=dim)
            self.catalog.append(item)
            self.embeddings.append(emb)

        self.matrix = np.stack(self.embeddings).astype("float32")

        self.index = None
        if faiss is not None:
            self.index = faiss.IndexFlatIP(self.dim)
            self.index.add(self.matrix)

    def search(self, query_embedding: np.ndarray, top_k: int = 4) -> List[Dict]:
        query = query_embedding.astype("float32")
        q_norm = np.linalg.norm(query)
        if q_norm > 0:
            query = query / q_norm

        if self.index is not None:
            scores, indices = self.index.search(query.reshape(1, -1), top_k)
            sims = scores[0]
            idxs = indices[0]
        else:
            sims = self.matrix @ query
            idxs = np.argsort(-sims)[:top_k]
            sims = sims[idxs]

        results: List[Dict] = []
        for rank, idx in enumerate(idxs):
            if idx < 0:
                continue
            item = self.catalog[int(idx)]
            results.append(
                {
                    "id": item["id"],
                    "title": item["title"],
                    "similarity": round(float(sims[rank]), 4),
                    "thumbnail": item["thumbnail"],
                }
            )

        return results
