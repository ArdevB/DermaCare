const API_BASE_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api"
).replace(/\/$/, "");

const TOKEN_KEY = "dermacare_token";

export function getToken() {
  if (typeof window === "undefined") return null;
  return window.localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  constructor(message, status, errors) {
    super(message);
    this.status = status;
    this.errors = errors;
  }
}

/**
 * Calls the DermaCare backend. Pass `body` as a plain object for JSON
 * requests, or a FormData instance for multipart (image upload) requests.
 */
export async function apiFetch(path, { method = "GET", body, params } = {}) {
  let url = `${API_BASE_URL}${path}`;

  if (params) {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        query.set(key, value);
      }
    });
    const qs = query.toString();
    if (qs) url += `?${qs}`;
  }

  const isFormData =
    typeof FormData !== "undefined" && body instanceof FormData;
  const headers = {};
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  if (body && !isFormData) headers["Content-Type"] = "application/json";

  let res;
  try {
    res = await fetch(url, {
      method,
      headers,
      credentials: "include",
      body: body ? (isFormData ? body : JSON.stringify(body)) : undefined,
    });
  } catch {
    throw new ApiError(
      "Can't reach the DermaCare API. Make sure the backend server is running and CORS_ORIGIN allows this origin.",
      0,
      [],
    );
  }

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const payload = isJson ? await res.json().catch(() => null) : null;

  if (!res.ok) {
    const message =
      (payload?.errors &&
        payload.errors.length > 0 &&
        payload.errors.join(" ")) ||
      payload?.message ||
      `Request failed with status ${res.status}`;
    throw new ApiError(message, res.status, payload?.errors ?? []);
  }

  return payload;
}

export const api = {
  get: (path, params) => apiFetch(path, { method: "GET", params }),
  post: (path, body) => apiFetch(path, { method: "POST", body }),
  put: (path, body) => apiFetch(path, { method: "PUT", body }),
  delete: (path, body) => apiFetch(path, { method: "DELETE", body }),
};

export function getErrorMessage(err) {
  if (err instanceof ApiError) return err.message;
  if (err instanceof Error) return err.message;
  return "Something went wrong. Please try again.";
}
