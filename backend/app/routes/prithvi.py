from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.schemas.responses import PrithviResponse
from app.services.prithvi_service import PrithviService

router = APIRouter()
prithvi_service = PrithviService()


class PrithviEmbedRequest(BaseModel):
    demo_mode: bool = True
    input_array: list | None = None


@router.post("/prithvi-embed", response_model=PrithviResponse)
def prithvi_embed_demo(payload: PrithviEmbedRequest | None = None) -> dict:
    try:
        if payload is None:
            return prithvi_service.run_embedding(demo_mode=True)

        return prithvi_service.run_embedding(
            input_array=payload.input_array,
            demo_mode=payload.demo_mode,
        )
    except ValueError as exc:
        raise HTTPException(status_code=400, detail=str(exc)) from exc
    except FileNotFoundError as exc:
        raise HTTPException(status_code=500, detail=str(exc)) from exc
    except Exception as exc:
        raise HTTPException(status_code=500, detail=f"Prithvi embedding failed: {exc}") from exc
