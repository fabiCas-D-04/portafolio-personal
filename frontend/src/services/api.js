const API_BASE = import.meta.env.VITE_API_URL || '';

async function request(path, options = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });

  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Error ${res.status}`);
  }

  if (res.status === 204) return null;
  return res.json();
}

export function getProjects() {
  return request('/api/projects');
}

export function createProject(data) {
  return request('/api/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}

export function deleteProject(id) {
  return request(`/api/projects/${id}`, { method: 'DELETE' });
}

export function sendContact(data) {
  return request('/api/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  });
}
