// ============================================================
// server/models/Pagos.js — Modelo de Pago (MongoDB)
// ============================================================
// Registra cada transacción de compra: qué usuario pagó, por qué
// (libro o plan), cuánto pagó, método de pago e ID de transacción.

import mongoose from 'mongoose';

const pagoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }, // Quién pagó
  libro: { type: mongoose.Schema.Types.ObjectId, ref: 'Libro' },   // Libro comprado (puede ser null si es un plan)
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },     // Plan comprado (puede ser null si es un libro)
  monto: { type: Number, required: true },                          // Cantidad pagada en MXN
  metodoPago: { type: String, required: true },                     // Método: "Tarjeta de crédito", "PayPal", etc.
  idTransaccion: { type: String, required: true },                  // ID único de la transacción (simulado)
  fechaPago: { type: Date, default: Date.now },                     // Fecha y hora del pago
}, { timestamps: true });

// Exportar el modelo. 'pagos' es el nombre de la colección en MongoDB
export default mongoose.model('Pago', pagoSchema, 'pagos');