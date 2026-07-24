const API = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

async function request(path, options = {}) {
  const response = await fetch(`${API}${path}`, options);
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed.");
  return data;
}

export const api = {
  createProject: (body) => request("/projects", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
  joinProject: (pin) => request("/projects/join", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ pin }) }),
  getProject: (pin) => request(`/projects/${pin}`),
  uploadDocument: (pin, file) => { const body = new FormData(); body.append("document", file); return request(`/projects/${pin}/documents`, { method: "POST", body }); },
  uploadMeeting: (pin, file) => { const body = new FormData(); body.append("document", file); return request(`/projects/${pin}/meetings`, { method: "POST", body }); },
  updateTask: (pin, taskId, status) => request(`/projects/${pin}/tasks/${taskId}`, { method: "PATCH", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ status }) }),
  chat: (pin, question) => request(`/projects/${pin}/chat`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question }) })
};
