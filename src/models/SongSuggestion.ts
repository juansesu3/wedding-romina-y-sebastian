import { Schema, model, models } from 'mongoose'

export interface ISongSuggestion {
  songName: string
  artist: string
  personName: string
  createdAt?: Date
  updatedAt?: Date
}

const SongSuggestionSchema = new Schema<ISongSuggestion>(
  {
    songName: { type: String, required: true, trim: true, maxlength: 150 },
    artist:   { type: String, required: true, trim: true, maxlength: 150 },
    personName:{ type: String, required: true, trim: true, maxlength: 100 },
  },
  { timestamps: true }
)

// Índice útil para ordenar recientes
SongSuggestionSchema.index({ createdAt: -1 })
// (Opcional) Evitar duplicados exactos por misma persona:
// SongSuggestionSchema.index({ songName: 1, artist: 1, personName: 1 }, { unique: true })

export const SongSuggestion =
  models.SongSuggestion || model<ISongSuggestion>('SongSuggestion', SongSuggestionSchema)
