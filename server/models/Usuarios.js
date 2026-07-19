// ============================================================
// server/models/Usuarios.js — Modelo de Usuario (MongoDB)
// ============================================================
// Define la estructura de los documentos en la colección "usuarios".
// Un usuario tiene: nombre, correo, contraseña hasheada, rol y plan.

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs'; // Librería para hashear contraseñas de forma segura

// Esquema que define todos los campos y tipos de dato de un usuario
const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },                    // Nombre completo del usuario
  correo: { type: String, required: true, unique: true },      // Email único (no se puede repetir)
  contraseña: { type: String, required: true },                 // Contraseña hasheada con bcrypt (nunca se guarda en texto plano)
  rol: { type: String, enum: ['user', 'admin'], default: 'user' }, // Rol: 'user' normal o 'admin' con permisos especiales
  plan: { type: String, enum: ['standard', 'premium', ''], default: '' }, // Plan de suscripción del usuario
}, { timestamps: true }); // timestamps crea automáticamente createdAt y updatedAt

// ============================================================
// Hook pre-save: Antes de GUARDAR el usuario en la base de datos,
// hashea la contraseña si fue modificada (solo si es nueva o cambió)
// ============================================================
userSchema.pre('save', async function () {
  if (!this.isModified('contraseña')) return; // Si la contraseña no cambió, no hacer nada
  this.contraseña = await bcrypt.hash(this.contraseña, 10); // 10 rondas de salt (nivel de seguridad)
});

// ============================================================
// Método de instancia: Compara una contraseña ingresada con la hasheada en la BD
// Se usa durante el login para verificar si la contraseña es correcta
// ============================================================
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.contraseña); // Retorna true/false
};

// Exportar el modelo. 'usuarios' es el nombre de la colección en MongoDB
export default mongoose.model('Usuario', userSchema, 'usuarios');
