// src/app/api/songs/route.ts
export const runtime = 'nodejs'

import { NextResponse, type NextRequest } from 'next/server'
import { connectDB } from '@/lib/mongoose'
import { SongSuggestion } from '@/models/SongSuggestion'
import { MongoServerError } from 'mongodb'

export async function GET() {
  await connectDB()
  const items = await SongSuggestion.find().sort({ createdAt: -1 }).lean()
  return NextResponse.json({ items })
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { songName, artist, personName } = (body ?? {}) as {
      songName?: unknown
      artist?: unknown
      personName?: unknown
    }

    // Validaciones simples
    if (
      typeof songName !== 'string' || !songName.trim() ||
      typeof artist   !== 'string' || !artist.trim()   ||
      typeof personName !== 'string' || !personName.trim()
    ) {
      return NextResponse.json(
        { error: 'songName, artist y personName son requeridos.' },
        { status: 400 }
      )
    }

    await connectDB()
    const created = await SongSuggestion.create({
      songName: songName.trim(),
      artist: artist.trim(),
      personName: personName.trim(),
    })

    return NextResponse.json({ item: created }, { status: 201 })
  } catch (err: unknown) {
    // Duplicados (índice único)
    if (err instanceof MongoServerError && err.code === 11000) {
      return NextResponse.json(
        { error: 'Esta sugerencia ya existe.' },
        { status: 409 }
      )
    }

    const detail = err instanceof Error ? err.message : 'unknown'
    return NextResponse.json(
      { error: 'Error al crear la sugerencia.', detail },
      { status: 500 }
    )
  }
}
