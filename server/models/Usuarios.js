import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  contraseña: { type: String, required: true },
  rol: { type: String, enum: ['user', 'admin'], default: 'user' },
  plan: { type: String, enum: ['standard', 'premium', ''], default: '' }, // Plan de suscripción del usuario
}, { timestamps: true });

// Antes de guardar, hashear la contraseña si fue modificada
userSchema.pre('save', async function () {
  if (!this.isModified('contraseña')) return;
  this.contraseña = await bcrypt.hash(this.contraseña, 10);
});

// Comparar contraseña ingresada con la hasheada en la BD
userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.contraseña);
};

export default mongoose.model('Usuario', userSchema, 'usuarios');
