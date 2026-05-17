const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001';

const TOKEN_KEY = 'ganesh_spices_token';

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function setToken(token) {
  if (token) {
    localStorage.setItem(TOKEN_KEY, token);
  } else {
    localStorage.removeItem(TOKEN_KEY);
  }
}

async function request(path, options = {}) {
  const headers = { ...(options.headers || {}) };
  const token = getToken();
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (options.body && !(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json';
  }

  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers,
    body:
      options.body instanceof FormData || options.body == null
        ? options.body
        : JSON.stringify(options.body),
  });

  if (res.status === 204) {
    return null;
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    const err = new Error(data.error || res.statusText || 'Request failed');
    err.status = res.status;
    throw err;
  }
  return data;
}

export const api = {
  health: () => request('/api/health'),

  login: (username, password) =>
    request('/api/auth/login', { method: 'POST', body: { username, password } }),

  register: (name, username, password) =>
    request('/api/auth/register', {
      method: 'POST',
      body: { name, username, password },
    }),

  getProducts: () => request('/api/products'),

  createProduct: (product) =>
    request('/api/products', { method: 'POST', body: product }),

  updateProduct: (id, updates) =>
    request(`/api/products/${id}`, { method: 'PATCH', body: updates }),

  deleteProduct: (id) => request(`/api/products/${id}`, { method: 'DELETE' }),

  uploadProductImage: (id, file) => {
    const form = new FormData();
    form.append('image', file);
    return request(`/api/products/${id}/image`, { method: 'POST', body: form });
  },

  getOrders: () => request('/api/orders'),

  placeOrder: (payload) =>
    request('/api/orders', { method: 'POST', body: payload }),
};

/** Convert base64 data URL from ImageUploadField to a File for multipart upload */
export async function dataUrlToFile(dataUrl, filename = 'product.jpg') {
  const res = await fetch(dataUrl);
  const blob = await res.blob();
  return new File([blob], filename, { type: blob.type || 'image/jpeg' });
}
