// ============================================================
// server/index.js — Punto de entrada del servidor Express.js
// ============================================================
// Este archivo arranca el servidor backend que sirve la API REST.
// Se conecta a MongoDB Atlas y monta todas las rutas de la API.

import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Importar todas las rutas (endpoints) de la API
import rutasAuth from './routes/autenticacion.js';      // Registro, login, perfil
import rutasLibros from './routes/libros.js';           // CRUD de libros
import rutasPlanes from './routes/planes.js';           // Planes de suscripción
import rutasBiblioteca from './routes/biblioteca.js';   // Biblioteca del usuario
import rutasPagos from './routes/pagos.js';             // Historial de pagos
import rutasCategorias from './routes/categorias.js';   // Categorías de libros

// Cargar variables de entorno desde el archivo .env
dotenv.config();

const app = express();

// Middleware: CORS permite peticiones desde el frontend (puerto diferente)
app.use(cors());
// Middleware: parsear bodies JSON que llegan en las peticiones
app.use(express.json());

// Conexión a MongoDB Atlas (la URI está en .env)
// Si no hay URI configurada, usa una base de datos local por defecto
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/amoxcalli')
  .then(() => console.log('MongoDB conectado'))
  .catch((error) => console.error('Error al conectar con MongoDB:', error));

// ============================================================
// Montaje de rutas — Cada grupo de rutas maneja una sección de la API
// ============================================================
app.use('/api/auth', rutasAuth);           // /api/auth/* — Autenticación
app.use('/api/books', rutasLibros);        // /api/books/* — Catálogo de libros
app.use('/api/plans', rutasPlanes);        // /api/plans/* — Planes de suscripción
app.use('/api/library', rutasBiblioteca);  // /api/library/* — Biblioteca del usuario
app.use('/api/payments', rutasPagos);      // /api/payments/* — Pagos
app.use('/api/categories', rutasCategorias); // /api/categories/* — Categorías

// Iniciar el servidor en el puerto configurado (por defecto 4000)
const PUERTO = process.env.PORT || 4000;
app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en el puerto ${PUERTO}`);
});