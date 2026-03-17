from typing import Any, Dict, List

from pydantic import BaseModel


class PredictionItem(BaseModel):
    label: str
    confidence: float


class EmbeddingSummary(BaseModel):
    dimension: int
    mean: float
    std: float


class AnalyzeResponse(BaseModel):
    success: bool
    model: str
    predictions: List[PredictionItem]
    embedding_summary: EmbeddingSummary
    analysis_time_ms: int


class SimilarityItem(BaseModel):
    id: str
    title: str
    similarity: float
    thumbnail: str


class SimilarityResponse(BaseModel):
    success: bool
    query_model: str
    results: List[SimilarityItem]


class CompareResponse(BaseModel):
    success: bool
    image1_top_class: str
    image2_top_class: str
    cosine_similarity: float
    change_score: float


class PrithviResponse(BaseModel):
    success: bool
    model: str
    token_shape: List[int]
    embedding_shape: List[int]
    embedding_preview: List[float]
    embedding_stats: Dict[str, float]
    metadata: Dict[str, Any]
