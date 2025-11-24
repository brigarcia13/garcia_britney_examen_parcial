import mongoose from 'mongoose';

const ContactSchema = new mongoose.Schema({
  nombre: { type: String, required: true, trim: true },
  apellido: { type: String, required: true, trim: true },
  email: { type: String, required: true, trim: true, lowercase: true },
  telefono: { type: String, required: false, trim: true },
  nota: { type: String, required: false, trim: true }
}, { timestamps: true });

export default mongoose.model('Contact', ContactSchema);
