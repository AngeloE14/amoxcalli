import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
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
mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/amoxcalli')
  .then(() => console.log('MongoDB conectado'))
  .catch((error) => console.error('Error al conectar con MongoDB:', error));


app.use('/api/auth', rutasAuth);           // Autenticación
app.use('/api/books', rutasLibros);        // Catálogo de libros
app.use('/api/plans', rutasPlanes);        // Planes de suscripción
app.use('/api/library', rutasBiblioteca);  // Biblioteca del usuario
app.use('/api/payments', rutasPagos);      // Pagos
app.use('/api/categories', rutasCategorias); // Categorías


const PUERTO = process.env.PORT || 4000;
app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en el puerto ${PUERTO}`);
});