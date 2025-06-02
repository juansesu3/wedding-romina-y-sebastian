// models/Invitado.ts
import mongoose from 'mongoose';

const InvitadoSchema = new mongoose.Schema({
  codigo: { type: String, required: true, unique: true },
  nombre: { type: String, required: true },
  autorizado: { type: Boolean, default: true },
  usado: { type: Boolean, default: false },
  fechaIngreso: { type: Date, default: null }
});

export default mongoose.models.Invitado || mongoose.model('Invitado', InvitadoSchema);
