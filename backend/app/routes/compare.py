from fastapi import APIRouter, File, HTTPException, UploadFile

from app.schemas.responses import CompareResponse
from app.services.compare_service import CompareService
from app.services.lightweight_service import LightweightAnalyzerService

router = APIRouter()
analyzer = LightweightAnalyzerService()
compare_service = CompareService(analyzer)

ALLOWED_TYPES = {
    "image/jpeg",
    "image/png",
    "image/tiff",
    "image/x-tiff",
}


@router.post("/compare", response_model=CompareResponse)
async def compare_images(
    image1: UploadFile = File(...),
    image2: UploadFile = File(...),
) -> dict:
    if image1.content_type not in ALLOWED_TYPES or image2.content_type not in ALLOWED_TYPES:
        raise HTTPException(status_code=400, detail="Only JPG, PNG, and TIF/TIFF uploads are supported.")

    try:
        image1_bytes = await image1.read()
        image2_bytes = await image2.read()
        return compare_service.compare(image1_bytes=image1_bytes, image2_bytes=image2_bytes)
    except HTTPException:
        raise
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Comparison failed: {exc}") from exc
