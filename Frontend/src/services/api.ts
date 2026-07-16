const API_BASE = import.meta.env.VITE_BACKEND_URL || "http://localhost:3001";

export interface ModelResponse {
  model: string;
  response: string | null;
}

export interface QueryResult {
  responses: ModelResponse[];
  judgment: string | null;
}

/** Query a single model */
export async function queryModel(
  model: string,
  question: string
): Promise<ModelResponse> {
  const res = await fetch(`${API_BASE}/api/query`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ model, question }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  return res.json() as Promise<ModelResponse>;
}

/** Call the judge endpoint once all model responses are collected */
export async function judgeModelResponses(
  question: string,
  responses: ModelResponse[]
): Promise<string | null> {
  const res = await fetch(`${API_BASE}/api/judge`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ question, responses }),
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error((body as { error?: string }).error ?? `HTTP ${res.status}`);
  }
  const data = (await res.json()) as { judgment: string | null };
  return data.judgment;
}
