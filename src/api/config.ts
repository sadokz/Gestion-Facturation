export const API_BASE = "http://localhost:8080/api";

export const fetcher = async (endpoint: string, options?: RequestInit) => {
  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({ message: "Une erreur est survenue" }));
    throw new Error(error.message || "Erreur serveur");
  }

  return response.json();
};