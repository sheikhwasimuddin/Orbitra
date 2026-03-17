from typing import Dict

from app.models.prithvi_embedder import PrithviEmbedder

_cached_embedder: PrithviEmbedder | None = None


def get_prithvi_embedder() -> PrithviEmbedder:
    global _cached_embedder
    if _cached_embedder is None:
        _cached_embedder = PrithviEmbedder(device="cpu")
    return _cached_embedder


class PrithviService:
    def run_embedding(self, input_array: list | None = None, demo_mode: bool = True) -> Dict:
        embedder = get_prithvi_embedder()
        if demo_mode or input_array is None:
            payload = embedder.extract_dummy_embedding()
        else:
            payload = embedder.extract_embedding_from_array(input_array)
        return {
            "success": True,
            "model": "Prithvi EO 2.0 Tiny TL",
            **payload,
        }
