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
};

export const planesAPI = { getAll: () => clienteAPI.get('/plans') };

export const librosAPI = {
  getAll: (params) => clienteAPI.get('/books', { params }),
  getById: (id) => clienteAPI.get(`/books/${id}`),
  getReviews: (id) => clienteAPI.get(`/books/${id}/reviews`),
  create: (datos) => clienteAPI.post('/books', datos),
  update: (id, datos) => clienteAPI.put(`/books/${id}`, datos),
  delete: (id) => clienteAPI.delete(`/books/${id}`),
};

export const suscripcionesAPI = {
  create: (planId, metodoPago) => clienteAPI.post('/subscriptions', { planId, paymentMethod: metodoPago }),
  getMine: () => clienteAPI.get('/subscriptions/me'),
};

export const resenasAPI = {
  create: (datos) => clienteAPI.post('/reviews', datos),
  getMine: () => clienteAPI.get('/reviews/me'),
  delete: (id) => clienteAPI.delete(`/reviews/${id}`),
};

export const bibliotecaAPI = {
  getAll: () => clienteAPI.get('/library'),
  add: (libroId, tipoCompra) => clienteAPI.post('/library', { bookId: libroId, purchaseType: tipoCompra }),
  remove: (libroId) => clienteAPI.delete(`/library/${libroId}`),
};

export const comprasAPI = {
  create: (datos) => clienteAPI.post('/purchases', datos),
  getAll: () => clienteAPI.get('/purchases'),
};

export const progresoLecturaAPI = {
  get: (libroId) => clienteAPI.get(`/reading-progress/${libroId}`),
  save: (libroId, datos) => clienteAPI.post(`/reading-progress/${libroId}`, datos),
};

export const favoritosAPI = {
  getAll: () => clienteAPI.get('/favorites'),
  add: (libroId) => clienteAPI.post('/favorites', { bookId: libroId }),
  remove: (libroId) => clienteAPI.delete(`/favorites/${libroId}`),
};

export const listaDeseosAPI = {
  getAll: () => clienteAPI.get('/wishlist'),
  add: (libroId) => clienteAPI.post('/wishlist', { bookId: libroId }),
  remove: (libroId) => clienteAPI.delete(`/wishlist/${libroId}`),
};

export const transaccionesAPI = { getAll: () => clienteAPI.get('/transactions') };

export default clienteAPI;
