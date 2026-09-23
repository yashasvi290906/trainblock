/**
 * RAILBLOCK Frontend API Client
 * Connects Next.js to FastAPI Python Optimization Engine (http://localhost:8000)
 * Includes graceful local fallback if backend server is not running during standalone dev.
 */

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function fetchApi<T>(endpoint: string, options?: RequestInit): Promise<{ data: T | null; error: string | null; isBackend: boolean }> {
  try {
    const res = await fetch(`${API_BASE}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...options?.headers,
      },
      // Timeout after 3.5s to fall back gracefully
      signal: AbortSignal.timeout(3500)
    });

    if (!res.ok) {
      return { data: null, error: `HTTP ${res.status}: ${res.statusText}`, isBackend: false };
    }

    const data = await res.json();
    return { data, error: null, isBackend: true };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Backend connection offline';
    return { data: null, error: message, isBackend: false };
  }
}
