import mongoose from 'mongoose';

const pagoSchema = new mongoose.Schema({
  usuario: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario', required: true }, 
  libro: { type: mongoose.Schema.Types.ObjectId, ref: 'Libro' },   
  plan: { type: mongoose.Schema.Types.ObjectId, ref: 'Plan' },     
  monto: { type: Number, required: true },                         
  metodoPago: { type: String, required: true },                     
  idTransaccion: { type: String, required: true },                  
  fechaPago: { type: Date, default: Date.now },                     
}, { timestamps: true });


export default mongoose.model('Pago', pagoSchema, 'pagos');