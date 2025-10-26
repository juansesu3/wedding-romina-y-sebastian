// models/Invitado.ts
import mongoose, { Schema, Model } from 'mongoose';

export interface IInvitado {
  // identidad
  firstName: string;
  lastName: string;
  email: string;

  // datos RSVP
  age: number;
  isChild?: boolean;
  phone?: string;
  allergies?: string;
  dietary?: 'none' | 'vegetarian' | 'vegan' | 'pescatarian' | 'gluten_free' | 'halal' | 'kosher' | 'no_pork' | 'no_alcohol' | 'other';
  dietaryOther?: string;
  mobilityNeeds?: string;
  songSuggestion?: string;

  // acceso
  token: string;        // JWT emitido (puedes guardar hash si prefieres)
  accessLink: string;   // URL enviada por email

  // estado
  status: 'sent' | 'confirmed';
  sentAt?: Date;
  confirmedAt?: Date;
  used?: boolean;       // si ya usó el magic link
  fechaIngreso?: Date;  // alias/compat con tu campo previo
}

const InvitadoSchema = new Schema<IInvitado>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },
    email:     { type: String, required: true, trim: true, lowercase: true },

    age:       { type: Number, required: true, min: 0, max: 120 },
    isChild:   { type: Boolean, default: false },
    phone:     { type: String },
    allergies: { type: String },
    dietary:   { type: String, enum: ['none','vegetarian','vegan','pescatarian','gluten_free','halal','kosher','no_pork','no_alcohol','other'], default: 'none' },
    dietaryOther:   { type: String },
    mobilityNeeds:  { type: String },
    songSuggestion: { type: String },

    token:      { type: String, required: true },
    accessLink: { type: String, required: true },

    status:   { type: String, enum: ['sent','confirmed'], default: 'sent' },
    sentAt:   { type: Date, default: Date.now },
    confirmedAt: { type: Date },
    used:     { type: Boolean, default: false },
    fechaIngreso: { type: Date }, // para mantener naming previo si lo usas en informes
  },
  { timestamps: true }
);

// Único por email + token para permitir varios envíos a mismo email si renuevas token
InvitadoSchema.index({ email: 1, token: 1 }, { unique: true });

const Invitado: Model<IInvitado> = mongoose.models.Invitado || mongoose.model<IInvitado>('Invitado', InvitadoSchema);
export default Invitado;
