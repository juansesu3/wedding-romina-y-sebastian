// models/Invitation.ts
import mongoose, { Schema, Model, Types } from 'mongoose'

export type MemberRole = 'primary' | 'companion'
export type Dietary =
  | 'none' | 'vegetarian' | 'vegan' | 'pescatarian'
  | 'gluten_free' | 'halal' | 'kosher' | 'no_pork' | 'no_alcohol' | 'other'

export interface InvitationMember {
  _id: Types.ObjectId
  // Identidad
  firstName: string
  lastName: string

  // Emails
  targetEmail: string                 // a dónde se envía (puede ser el del contacto si el miembro no tiene)
  originalGuestEmail?: string | null  // si el miembro aportó su propio correo

  // Datos RSVP
  age: number
  isChild?: boolean
  phone?: string
  allergies?: string
  dietary?: Dietary
  dietaryOther?: string
  mobilityNeeds?: string
  songSuggestion?: string

  // Acceso por miembro
  role: MemberRole
  token: string
  accessLink: string

  // Estado por miembro
  status: 'sent' | 'confirmed'
  used: boolean
  sentAt?: Date
  confirmedAt?: Date
}

export interface Invitation {
  _id: Types.ObjectId
  groupId: string

  // Contacto principal (metadatos del grupo)
  contactName: string
  contactEmail: string
  contactPhone?: string
  preferredLanguage?: 'es' | 'fr'
  notes?: string

  // Miembros (incluye al contacto principal como 'primary')
  members: InvitationMember[]

  createdAt: Date
  updatedAt: Date
}

const MemberSchema = new Schema<InvitationMember>(
  {
    firstName: { type: String, required: true, trim: true },
    lastName:  { type: String, required: true, trim: true },

    targetEmail: { type: String, required: true, trim: true, lowercase: true },
    originalGuestEmail: { type: String, trim: true, lowercase: true, default: null },

    age: { type: Number, required: true, min: 0, max: 120 },
    isChild: { type: Boolean, default: false },
    phone: { type: String },
    allergies: { type: String },
    dietary: {
      type: String,
      enum: ['none','vegetarian','vegan','pescatarian','gluten_free','halal','kosher','no_pork','no_alcohol','other'],
      default: 'none'
    },
    dietaryOther: { type: String },
    mobilityNeeds: { type: String },
    songSuggestion: { type: String },

    role: { type: String, enum: ['primary','companion'], required: true },

    token: { type: String, required: true },
    accessLink: { type: String, required: true },

    status: { type: String, enum: ['sent','confirmed'], default: 'sent' },
    used: { type: Boolean, default: false },
    sentAt: { type: Date, default: Date.now },
    confirmedAt: { type: Date },
  },
  { _id: true }
)

const InvitationSchema = new Schema<Invitation>(
  {
    groupId: { type: String, required: true, index: true },

    contactName:  { type: String, required: true },
    contactEmail: { type: String, required: true, lowercase: true, trim: true, index: true },
    contactPhone: { type: String },
    preferredLanguage: { type: String, enum: ['es','fr'], default: 'es' },
    notes: { type: String },

    members: { type: [MemberSchema], default: [] },
  },
  { timestamps: true }
)

// Índices útiles
// Buscar por token dentro de members (confirmación de acceso)
InvitationSchema.index({ 'members.token': 1 }, { unique: true })
// Buscar todos los miembros por email destino (reportes/soporte)
InvitationSchema.index({ 'members.targetEmail': 1 })
// Consultas por estado/rol
InvitationSchema.index({ 'members.status': 1 })
InvitationSchema.index({ 'members.role': 1 })

const Invitation: Model<Invitation> =
  mongoose.models.Invitation || mongoose.model<Invitation>('Invitation', InvitationSchema)

export default Invitation
