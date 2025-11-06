// src/models/RSVP.ts
import mongoose, { Schema, Model } from 'mongoose';

export interface IRSVP {
  name: string;
  email?: string | null;
  status: 'yes' | 'no';
  message?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const RSVPSchema = new Schema<IRSVP>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['yes', 'no'],
      required: true,
      default: 'no',
    },
    message: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true, // crea createdAt y updatedAt
  }
);

// evitar recompilar el modelo en hot reload de Next
export const RSVP: Model<IRSVP> =
  mongoose.models.RSVP || mongoose.model<IRSVP>('RSVP', RSVPSchema);
