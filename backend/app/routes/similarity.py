from fastapi import APIRouter, File, HTTPException, UploadFile

from app.schemas.responses import SimilarityResponse
from app.services.lightweight_service import LightweightAnalyzerService
from app.services.similarity_service import SimilarityService

router = APIRouter()
analyzer = LightweightAnalyzerService()
similarity_service = SimilarityService(dim=256)

ALLOWED_TYPES = {
    "image/jpeg",
    "image/png",
    "image/tiff",
    "image/x-tiff",
}


@router.post("/similarity-search", response_model=SimilarityResponse)
async def similarity_search(file: UploadFile = File(...)) -> dict:
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only JPG, PNG, and TIF/TIFF uploads are supported.")

    try:
        image_bytes = await file.read()
        analysis = analyzer.analyze(image_bytes)
        query_embedding = analysis["embedding"]
        results = similarity_service.search(query_embedding, top_k=4)

        return {
            "success": True,
            "query_model": analyzer.model_name,
            "results": results,
        }
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Similarity search failed: {exc}") from exc
