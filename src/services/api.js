// ============================================================
// src/services/api.js — Cliente HTTP centralizado (Axios)
// ============================================================
// Este archivo configura Axios para comunicarse con el backend.
// Crear UN solo cliente evita repetir configuración en cada archivo.
// El interceptor agrega automáticamente el token JWT a cada petición.

import axios from 'axios';

// Crear instancia de Axios con la URL base de la API
// En desarrollo, Vite proxea /api a localhost:4000
// En producción, la API está en el mismo servidor
const clienteAPI = axios.create({ baseURL: '/api' });

// ============================================================
// Interceptor de solicitudes: Se ejecuta ANTES de cada petición HTTP
// Agrega el token JWT del localStorage al header Authorization
// ============================================================
clienteAPI.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// ============================================================
// API de Autenticación — Login, registro, perfil, contraseña, eliminar
// ============================================================
export const authAPI = {
  register: (datos) => clienteAPI.post('/auth/register', datos),     // POST — Crear cuenta nueva
  login: (datos) => clienteAPI.post('/auth/login', datos),           // POST — Iniciar sesión
  getMe: () => clienteAPI.get('/auth/me'),                            // GET — Obtener perfil
  updateProfile: (datos) => clienteAPI.put('/auth/profile', datos),  // PUT — Actualizar nombre/correo/plan
  changePassword: (datos) => clienteAPI.put('/auth/password', datos), // PUT — Cambiar contraseña
  deleteAccount: () => clienteAPI.delete('/auth/delete'),             // DELETE — Eliminar cuenta
};

// ============================================================
// API de Planes — Obtener planes de suscripción
// ============================================================
export const planesAPI = { getAll: () => clienteAPI.get('/plans') };

// ============================================================
// API de Libros — CRUD del catálogo de libros
// ============================================================
export const librosAPI = {
  getAll: (params) => clienteAPI.get('/books', { params }),           // GET — Listar con filtros
  getById: (id) => clienteAPI.get(`/books/${id}`),                    // GET — Obtener un libro
  create: (datos) => clienteAPI.post('/books', datos),               // POST — Crear libro (admin)
  update: (id, datos) => clienteAPI.put(`/books/${id}`, datos),      // PUT — Actualizar libro (admin)
  delete: (id) => clienteAPI.delete(`/books/${id}`),                  // DELETE — Eliminar libro (admin)
};

// ============================================================
// API de Biblioteca — Guardar/quitar libros del usuario
// ============================================================
export const bibliotecaAPI = {
  getAll: () => clienteAPI.get('/library'),                                       // GET — Libros guardados
  add: (libroId, tipoCompra) => clienteAPI.post('/library', { bookId: libroId, tipoCompra }), // POST — Agregar
  remove: (libroId) => clienteAPI.delete(`/library/${libroId}`),                  // DELETE — Quitar
};

// ============================================================
// API de Pagos — Historial de transacciones
// ============================================================
export const pagosAPI = {
  getAll: () => clienteAPI.get('/payments'),                          // GET — Historial completo
  getById: (id) => clienteAPI.get(`/payments/${id}`),                // GET — Detalle de un pago
  create: (datos) => clienteAPI.post('/payments', datos),            // POST — Registrar nuevo pago
};

// ============================================================
// API de Categorías — Obtener categorías de libros
// ============================================================
export const categoriasAPI = {
  getAll: () => clienteAPI.get('/categories'),                        // GET — Todas las categorías
  getById: (id) => clienteAPI.get(`/categories/${id}`),              // GET — Una categoría específica
};

// Exportar la instancia base para uso externo si se necesita
export default clienteAPI;
