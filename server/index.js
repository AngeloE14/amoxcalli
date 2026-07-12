import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import rutasAuth from './routes/autenticacion.js';
import rutasLibros from './routes/libros.js';
import rutasPlanes from './routes/planes.js';
import rutasBiblioteca from './routes/biblioteca.js';
import rutasPagos from './routes/pagos.js';
import rutasCategorias from './routes/categorias.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/amoxcalli')
  .then(() => console.log('MongoDB conectado'))
  .catch((error) => console.error('Error al conectar con MongoDB:', error));

app.use('/api/auth', rutasAuth);
app.use('/api/books', rutasLibros);
app.use('/api/plans', rutasPlanes);
app.use('/api/library', rutasBiblioteca);
app.use('/api/payments', rutasPagos);
app.use('/api/categories', rutasCategorias);

const PUERTO = process.env.PORT || 4000;
app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en el puerto ${PUERTO}`);
});