const BASE = '/api';

const h = () => ({
  'Content-Type': 'application/json',
  ...(localStorage.getItem('token')
    ? { Authorization: `Bearer ${localStorage.getItem('token')}` }
    : {}),
});

export const api = {
  post: (path: string, body: object) =>
    fetch(BASE + path, { method: 'POST', headers: h(), body: JSON.stringify(body) }).then(r => r.json()),
  get: (path: string) =>
    fetch(BASE + path, { headers: h() }).then(r => r.json()),
  patch: (path: string, body?: object) =>
    fetch(BASE + path, { method: 'PATCH', headers: h(), body: body ? JSON.stringify(body) : undefined }).then(r => r.json()),
  delete: (path: string) =>
    fetch(BASE + path, { method: 'DELETE', headers: h() }).then(r => r.json()),
};
