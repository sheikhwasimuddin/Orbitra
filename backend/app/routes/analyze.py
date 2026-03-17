from fastapi import APIRouter, File, HTTPException, UploadFile

from app.schemas.responses import AnalyzeResponse
from app.services.lightweight_service import LightweightAnalyzerService

router = APIRouter()
analyzer = LightweightAnalyzerService()

ALLOWED_TYPES = {
    "image/jpeg",
    "image/png",
    "image/tiff",
    "image/x-tiff",
}


@router.post("/analyze", response_model=AnalyzeResponse)
async def analyze_image(file: UploadFile = File(...)) -> dict:
    if file.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only JPG, PNG, and TIF/TIFF uploads are supported.")

    try:
        image_bytes = await file.read()
        result = analyzer.analyze(image_bytes)

        return {
            "success": result["success"],
            "model": result["model"],
            "predictions": result["predictions"],
            "embedding_summary": result["embedding_summary"],
            "analysis_time_ms": result["analysis_time_ms"],
        }
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {exc}") from exc
