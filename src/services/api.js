import axios from 'axios';

const clienteAPI = axios.create({ baseURL: '/api' });

clienteAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const authAPI = {
  register: (datos) => clienteAPI.post('/auth/register', datos),
  login: (datos) => clienteAPI.post('/auth/login', datos),
  getMe: () => clienteAPI.get('/auth/me'),
  updateProfile: (datos) => clienteAPI.put('/auth/profile', datos),
  changePassword: (datos) => clienteAPI.put('/auth/password', datos),
  deleteAccount: () => clienteAPI.delete('/auth/delete'),
};

export const planesAPI = { getAll: () => clienteAPI.get('/plans') };

export const librosAPI = {
  getAll: (params) => clienteAPI.get('/books', { params }),
  getById: (id) => clienteAPI.get(`/books/${id}`),
  create: (datos) => clienteAPI.post('/books', datos),
  update: (id, datos) => clienteAPI.put(`/books/${id}`, datos),
  delete: (id) => clienteAPI.delete(`/books/${id}`),
};

export const bibliotecaAPI = {
  getAll: () => clienteAPI.get('/library'),
  add: (libroId, tipoCompra) => clienteAPI.post('/library', { bookId: libroId, tipoCompra }),
  remove: (libroId) => clienteAPI.delete(`/library/${libroId}`),
};

export const pagosAPI = {
  getAll: () => clienteAPI.get('/payments'),
  getById: (id) => clienteAPI.get(`/payments/${id}`),
  create: (datos) => clienteAPI.post('/payments', datos),
};

export const categoriasAPI = {
  getAll: () => clienteAPI.get('/categories'),
  getById: (id) => clienteAPI.get(`/categories/${id}`),
};

export default clienteAPI;
