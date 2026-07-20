import mongoose from 'mongoose';

const planSchema = new mongoose.Schema({
  nombre: { type: String, required: true },          
  precio: { type: Number, required: true },           
  duracionDias: { type: Number, required: true },     
  maxLibros: { type: Number, default: null },         
  descripcion: { type: String, required: true },      
}, { timestamps: true });


export default mongoose.model('Plan', planSchema, 'planes');
