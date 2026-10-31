
const API_URL = "http://localhost:5000/api";

export async function apiRequest(endpoint, options = {}) {
  const token = localStorage.getItem("resumecraft_token");

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });

  const data = await response.json().catch(() => ({}));

  console.log("API endpoint:", endpoint);
  console.log("API response:", data);

  if (!response.ok) {
    throw new Error(data.message || "Something went wrong.");
  }

  return data;
}
