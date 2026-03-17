# GeoVision FM

Full-stack satellite image analysis platform with:

- Lightweight deployable analyzer module
- Advanced IBM-NASA Prithvi EO 2.0 Tiny TL embedding lab

## One-command local deployment (Docker)

From the project root:

```bash
docker compose up --build
```

Apps:

- Frontend: http://localhost:3000
- Backend: http://localhost:8000
- Backend docs: http://localhost:8000/docs

## Verify the models are working correctly

After backend is running, execute:

```bash
python backend/scripts/verify_model_api.py
```

This smoke test validates:

- `GET /api/health` returns healthy service state
- `POST /api/analyze` returns valid lightweight predictions
- `POST /api/prithvi-embed` returns exact expected output shapes
  - token shape `[1, 197, 768]`
  - embedding shape `[1, 768]`

## Local non-Docker run

### Backend

```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```
