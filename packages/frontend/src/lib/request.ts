import { ApiError } from "./api-error";

export async function request<T>(url: string, requestInit: RequestInit) {
  try {
    const response = await fetch(url, requestInit);

    if (!response.ok) {
      throw new ApiError(
        `Response status: ${response.status}`,
        response.status
      );
    }

    const result = (await response.json()) as T;

    return result;
  } catch (err) {
    console.error("Error on API request", err);
    throw err;
  }
}

function buildAuthHeaders(token?: string) {
  return { ...(token ? { Authorization: `Bearer ${token}` } : {}) };
}

export async function get<T>(url: string, token?: string) {
  return request<T>(url, {
    method: "GET",
    headers: { ...buildAuthHeaders(token) },
  });
}

export async function post<T>(url: string, body: unknown, token?: string) {
  return request<T>(url, {
    method: "POST",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      ...buildAuthHeaders(token),
    },
  });
}

export async function put<T>(url: string, body: unknown, token?: string) {
  return request<T>(url, {
    method: "PUT",
    body: JSON.stringify(body),
    headers: {
      "Content-Type": "application/json",
      ...buildAuthHeaders(token),
    },
  });
}
