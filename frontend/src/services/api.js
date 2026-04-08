import { API_BASE_URL } from "../config";

async function request(path, { method = "GET", token, body } = {}) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}

export function signup(payload) {
  return request("/api/auth/signup", { method: "POST", body: payload });
}

export function login(payload) {
  return request("/api/auth/login", { method: "POST", body: payload });
}

export function getUsers(token) {
  return request("/api/chat/users", { token });
}

export function getMessages(token, userId) {
  return request(`/api/chat/messages/${userId}`, { token });
}
