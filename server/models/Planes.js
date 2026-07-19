// ============================================================
// server/models/Planes.js — Modelo de Plan de Suscripción (MongoDB)
// ============================================================
// Define los planes de suscripción que los usuarios pueden elegir.
// Ejemplo: Estándar ($79.99, 5 libros, 3 meses) y Premium ($149.99, ilimitado).

import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  nombre: { type: String, required: true },          // Nombre del plan (ej: "Premium")
  precio: { type: Number, required: true },           // Precio en MXN
  duracionDias: { type: Number, required: true },     // Duración en días (ej: 90 = 3 meses)
  maxLibros: { type: Number, default: null },         // Límite de libros (null = ilimitado)
  descripcion: { type: String, required: true },      // Descripción del plan
}, { timestamps: true });

// Exportar el modelo. 'planes' es el nombre de la colección en MongoDB
export default mongoose.model('Plan', planSchema, 'planes');
