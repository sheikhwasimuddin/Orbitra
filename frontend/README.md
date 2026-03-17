# GeoVision FM Frontend

Next.js 15 + TypeScript frontend for the GeoVision FM platform.

## Features

- Modern App Router architecture with page modules:
  - `/` landing
  - `/analyze`
  - `/similarity`
  - `/compare`
  - `/prithvi-lab`
  - `/dashboard`
- Reusable typed API client (`lib/api.ts`).
- Strong TypeScript response contracts (`lib/types.ts`).
- Tailwind-powered space-tech UI with glass cards and gradient accents.
- Framer Motion animation for Prithvi Lab hero interactions.
- Recharts visual analytics in analyze/dashboard pages.
- React Dropzone upload UX.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

```bash
cp .env.example .env.local
```

3. Run dev server:

```bash
npm run dev
```

Frontend runs at http://localhost:3000.

## Full Stack Docker Run

From workspace root:

```bash
docker compose up --build
```

This starts frontend on `http://localhost:3000` and backend on `http://localhost:8000`.

## Backend Connection

Default backend URL: `http://localhost:8000/api`

Override with env var:

- `NEXT_PUBLIC_API_BASE_URL`

## Notes

- Demo similarity thumbnails live in `public/demo`.
- Prithvi Lab calls `POST /api/prithvi-embed` and renders token/embedding diagnostics.
- Backend correctness verification script: `python backend/scripts/verify_model_api.py`
