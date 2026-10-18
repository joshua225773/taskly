// All HTTP calls to the backend live in this one file.
const BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const tokenStore = {
  get: () => {
    try { return localStorage.getItem('token'); } catch { return null; }
  },
  set: (t) => {
    try { localStorage.setItem('token', t); } catch { /* ignore */ }
  },
  clear: () => {
    try { localStorage.removeItem('token'); } catch { /* ignore */ }
  },
};

async function request(path, { method = 'GET', body } = {}) {
  const headers = { 'Content-Type': 'application/json' };
  const token = tokenStore.get();
  if (token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE}${path}`, { method, headers, body: body ? JSON.stringify(body) : undefined });
  } catch {
    throw new Error('Cannot reach the server. Check your internet and try again.');
  }
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.message || 'Request failed');
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  register: (b) => request('/auth/register', { method: 'POST', body: b }),
  login: (b) => request('/auth/login', { method: 'POST', body: b }),
  me: () => request('/auth/me'),
  listTasks: (page = 1, limit = 10) => request(`/tasks?page=${page}&limit=${limit}`),
  createTask: (b) => request('/tasks', { method: 'POST', body: b }),
  updateTask: (id, b) => request(`/tasks/${id}`, { method: 'PATCH', body: b }),
  deleteTask: (id) => request(`/tasks/${id}`, { method: 'DELETE' }),
};
