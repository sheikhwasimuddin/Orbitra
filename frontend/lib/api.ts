import {
  AnalyzeResponse,
  CompareResponse,
  PrithviResponse,
  SimilarityResponse,
} from "@/lib/types";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:8000/api";
const REQUEST_TIMEOUT_MS = 60000;

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    let message = "";
    try {
      const payload = await res.json();
      message = payload?.detail ?? JSON.stringify(payload);
    } catch {
      message = await res.text();
    }
    throw new Error(message || `Request failed (${res.status})`);
  }
  return (await res.json()) as T;
}

function withTimeoutSignal(timeoutMs = REQUEST_TIMEOUT_MS): AbortSignal {
  return AbortSignal.timeout(timeoutMs);
}

export async function healthCheck(): Promise<{ status: string; service: string }> {
  const res = await fetch(`${API_BASE}/health`, { cache: "no-store", signal: withTimeoutSignal(8000) });
  return handleResponse(res);
}

export async function analyzeImage(file: File): Promise<AnalyzeResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/analyze`, {
    method: "POST",
    body: formData,
    signal: withTimeoutSignal(),
  });
  return handleResponse<AnalyzeResponse>(res);
}

export async function similaritySearch(file: File): Promise<SimilarityResponse> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch(`${API_BASE}/similarity-search`, {
    method: "POST",
    body: formData,
    signal: withTimeoutSignal(),
  });
  return handleResponse<SimilarityResponse>(res);
}

export async function compareImages(image1: File, image2: File): Promise<CompareResponse> {
  const formData = new FormData();
  formData.append("image1", image1);
  formData.append("image2", image2);

  const res = await fetch(`${API_BASE}/compare`, {
    method: "POST",
    body: formData,
    signal: withTimeoutSignal(),
  });
  return handleResponse<CompareResponse>(res);
}

export async function runPrithviEmbedding(): Promise<PrithviResponse> {
  const res = await fetch(`${API_BASE}/prithvi-embed`, {
    method: "POST",
    signal: withTimeoutSignal(),
  });
  return handleResponse<PrithviResponse>(res);
}
