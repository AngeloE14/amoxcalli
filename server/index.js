import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import rutasAuth from './routes/auth.js';
import rutasPlanes from './routes/plans.js';
import rutasLibros from './routes/books.js';
import rutasSuscripciones from './routes/subscriptions.js';
import rutasResenas from './routes/reviews.js';
import rutasBiblioteca from './routes/library.js';
import rutasCompras from './routes/purchases.js';
import rutasProgresoLectura from './routes/readingProgress.js';
import rutasFavoritos from './routes/favorites.js';
import rutasListaDeseos from './routes/wishlist.js';
import rutasTransacciones from './routes/transactions.js';

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/amoxcalli')
  .then(() => console.log('MongoDB conectado'))
  .catch((error) => console.error('Error al conectar con MongoDB:', error));

app.use('/api/auth', rutasAuth);
app.use('/api/plans', rutasPlanes);
app.use('/api/books', rutasLibros);
app.use('/api/subscriptions', rutasSuscripciones);
app.use('/api/reviews', rutasResenas);
app.use('/api/library', rutasBiblioteca);
app.use('/api/purchases', rutasCompras);
app.use('/api/reading-progress', rutasProgresoLectura);
app.use('/api/favorites', rutasFavoritos);
app.use('/api/wishlist', rutasListaDeseos);
app.use('/api/transactions', rutasTransacciones);

const PUERTO = process.env.PORT || 4000;
app.listen(PUERTO, () => {
  console.log(`Servidor corriendo en el puerto ${PUERTO}`);
});
