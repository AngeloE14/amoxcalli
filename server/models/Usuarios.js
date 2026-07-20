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

userSchema.pre('save', async function () {
  if (!this.isModified('contraseña')) return; // Si la contraseña no cambió, no hacer nada
  this.contraseña = await bcrypt.hash(this.contraseña, 10); // 10 rondas de salt (nivel de seguridad)
});


userSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.contraseña); 
};


export default mongoose.model('Usuario', userSchema, 'usuarios');
