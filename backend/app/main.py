from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes import analyze, compare, health, prithvi, similarity

app = FastAPI(
    title="GeoVision FM Backend",
    version="1.0.0",
    description="Production-style backend for lightweight and foundation-model satellite analysis.",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(health.router, prefix="/api", tags=["health"])
app.include_router(analyze.router, prefix="/api", tags=["analyze"])
app.include_router(similarity.router, prefix="/api", tags=["similarity"])
app.include_router(compare.router, prefix="/api", tags=["compare"])
app.include_router(prithvi.router, prefix="/api", tags=["prithvi"])
