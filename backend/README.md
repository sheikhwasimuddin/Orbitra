# GeoVision FM Backend

FastAPI backend for the GeoVision FM satellite image analysis platform.

## Features

- Modular FastAPI architecture with production-style routes/services split.
- Lightweight deployable analysis module for JPG/PNG uploads.
- Similarity search with FAISS (and NumPy fallback).
- Image comparison endpoint with cosine similarity and change score.
- Advanced IBM-NASA Prithvi EO 2.0 Tiny TL embedding endpoint using the exact validated encoder flow.
- CORS preconfigured for local Next.js frontend.

## Folder Structure

```txt
backend/
  app/
    main.py
    routes/
    services/
    models/
    schemas/
    utils/
  requirements.txt
  .env.example
```

## Setup

1. Create and activate a Python environment.
2. Install dependencies:

```bash
pip install -r requirements.txt
```

3. Run backend:

```bash
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

4. Open docs:

- Swagger UI: http://localhost:8000/docs

## Docker Deployment

From workspace root:

```bash
docker compose up --build
```

Backend will be available at `http://localhost:8000`.

## API Endpoints

- `GET /api/health`
- `POST /api/analyze`
- `POST /api/similarity-search`
- `POST /api/compare`
- `POST /api/prithvi-embed`

## Prithvi Model Integration

The Prithvi endpoint uses the exact validated logic:

- Builds `PrithviMAE` from `config.json` pretrained config.
- Loads `Prithvi_EO_V2_100M_TL.pt` with strict state dict matching.
- Uses encoder call:

```python
output = model.encoder(x, time_coords, location_coords)
```

- Uses shapes:
  - `x`: `[1, 6, 4, 224, 224]`
  - `time_coords`: `[1, 4, 2]`
  - `location_coords`: `[1, 2]`
- Pools token embeddings with:

```python
embedding = tokens.mean(dim=1)
```

## Notes

- The lightweight analyzer is intentionally pluggable and can be swapped later with TorchGeo/RemoteCLIP style backends.
- Ensure the top-level workspace contains:
  - `models/prithvi_100m_full/config.json`
  - `models/prithvi_100m_full/Prithvi_EO_V2_100M_TL.pt`
  - `models/prithvi_100m_full/prithvi_mae.py`

## Model Correctness Smoke Test

Run from workspace root after backend starts:

```bash
python backend/scripts/verify_model_api.py
```

The script validates the Prithvi output shapes and endpoint responses.

## Golden Image Validation (Known Inputs -> Known Outputs)

Use this when you want fixed test images with expected outputs.

1. Generate or refresh the golden fixtures:

```bash
python scripts/generate_golden_set.py
```

2. Start backend:

```bash
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000
```

3. Verify API against expected results:

```bash
python scripts/verify_golden_images_api.py
```

Golden files:

- `golden/images/urban_like.png`
- `golden/images/vegetation_like.png`
- `golden/images/water_like.png`
- `golden/expected_analyze.json`
