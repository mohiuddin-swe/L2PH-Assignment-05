import Cookies from "js-cookie";

// Determine the base URL dynamically for Server vs Client components
const getBaseUrl = () => {
  if (typeof window !== "undefined") {
    // Client-side: use relative path so Next.js proxy handles it
    return "/api";
  }
  // Server-side: use absolute localhost URL during development, or production environment variable
  return process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000/api";
};

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const token = typeof window !== "undefined" ? Cookies.get("accessToken") : undefined;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };

  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  // Ensure endpoint starts with a slash
  const formattedEndpoint = endpoint.startsWith("/") ? endpoint : `/${endpoint}`;
  const url = `${getBaseUrl()}${formattedEndpoint}`;

  const response = await fetch(url, {
    ...options,
    headers,
  });

  const contentType = response.headers.get("content-type");
  const isJson = contentType && contentType.includes("application/json");
  const data = isJson ? await response.json() : await response.text();

  if (!response.ok) {
    console.error("API Error Response:", {
      status: response.status,
      url,
      data,
    });

    throw new Error(
      isJson && data.message ? data.message : (typeof data === 'string' ? data : "An error occurred.")
    );
  }

  return data;
}