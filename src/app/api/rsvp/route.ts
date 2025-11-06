// src/app/api/rsvp/route.ts
import { NextResponse } from 'next/server';
import { connectDB } from '@/lib/mongoose';
import { RSVP } from '@/models/rsvp';

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = body.name?.trim();
    const email = body.email?.trim() || null;
    const message = body.message?.trim() || '';
    // tu form ya manda 'no', pero lo normalizamos
    const status: 'yes' | 'no' = body.status === 'yes' ? 'yes' : 'no';

    if (!name) {
      return NextResponse.json(
        { error: 'Nombre es obligatorio' },
        { status: 400 }
      );
    }

    await connectDB();

    await RSVP.create({
      name,
      email,
      status,
      message,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error('Error saving RSVP', error);
    return NextResponse.json(
      { error: 'Error guardando la confirmación' },
      { status: 500 }
    );
  }
}
