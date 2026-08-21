import Cookies from "js-cookie";

const BASE_URL = "/api"; // Routes through the Next.js proxy, bypassing CORS

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = Cookies.get("accessToken");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    console.error("API Error Response:", {
      status: response.status,
      endpoint,
      data,
    });

    throw new Error(
      isJson && data.message ? data.message : (typeof data === 'string' ? data : "An error occurred.")
    );
  }

  return data;
}