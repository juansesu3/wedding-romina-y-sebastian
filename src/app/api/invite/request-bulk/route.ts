// app/api/invite/request-bulk/route.ts
export const runtime = 'nodejs';

import { NextResponse } from 'next/server';
import { Resend } from 'resend';
import { render } from '@react-email/render';
import { signGuestToken } from '@/lib/jwt';
import { connectDB } from '@/lib/mongoose';
import Invitado from '@/models/Invitado';
import  InviteMagicLinkEmail  from '@/lib/emails';

const resend = new Resend(process.env.RESEND_API_KEY);
const APP_URL = (process.env.APP_URL || 'http://localhost:3000').replace(/\/+$/, ''); // sin barra final
const EMAIL_FROM = process.env.EMAIL_FROM || 'Romina & Sebas <noreply@romyseb.ch>';

type Guest = {
  firstName: string;
  lastName: string;
  email: string;
  age: number;
  isChild?: boolean;
  phone?: string;
  allergies?: string;
  dietary?: any;
  dietaryOther?: string;
  mobilityNeeds?: string;
  songSuggestion?: string;
};

export async function POST(req: Request) {
  try {
    await connectDB();

    const { guests } = (await req.json()) as { guests: Guest[] };
    if (!Array.isArray(guests) || guests.length === 0) {
      return NextResponse.json({ message: 'Guests requeridos' }, { status: 400 });
    }

    // Validación mínima
    for (const g of guests) {
      if (!g.firstName || !g.lastName || !g.email) {
        return NextResponse.json({ message: 'Nombre, apellidos y email requeridos.' }, { status: 400 });
      }
      if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(g.email)) {
        return NextResponse.json({ message: `Email inválido: ${g.email}` }, { status: 400 });
      }
      const ageNum = Number(g.age);
      if (!Number.isFinite(ageNum) || ageNum < 0 || ageNum > 120) {
        return NextResponse.json({ message: `Edad inválida para ${g.email}` }, { status: 400 });
      }
      if (g.isChild && ageNum >= 18) {
        return NextResponse.json({ message: `Marcado como niño/niña con 18+ para ${g.email}` }, { status: 400 });
      }
    }

    const results: Array<{ email: string; ok: boolean; id?: string; error?: string }> = [];

    for (const g of guests) {
      const token = await signGuestToken({
        email: g.email,
        firstName: g.firstName,
        lastName: g.lastName,
        age: Number(g.age),
        isChild: !!g.isChild,
      });

      const link = `${APP_URL}/acceso?token=${encodeURIComponent(token)}`;

      // 1) Guarda/Actualiza invitado en Mongo (estado "sent")
      //    Usamos create; si quieres permitir múltiples envíos al mismo email, deja así (índice email+token).
      await Invitado.create({
        firstName: g.firstName,
        lastName: g.lastName,
        email: g.email.toLowerCase(),
        age: Number(g.age),
        isChild: !!g.isChild,
        phone: g.phone,
        allergies: g.allergies,
        dietary: g.dietary ?? 'none',
        dietaryOther: g.dietaryOther,
        mobilityNeeds: g.mobilityNeeds,
        songSuggestion: g.songSuggestion,
        token,
        accessLink: link,
        status: 'sent',
        sentAt: new Date(),
        used: false,
      });

      // 2) Render HTML email y enviar
      const html = await render(InviteMagicLinkEmail({ firstName: g.firstName, link }));

      const { data, error } = await resend.emails.send({
        from: EMAIL_FROM, // remitente verificado
        to: g.email,
        subject: 'Tu enlace de acceso a la boda',
        html,
      });

      if (error) {
        console.error('Resend error', error);
        results.push({ email: g.email, ok: false, error: String(error) });
      } else {
        results.push({ email: g.email, ok: true, id: data?.id });
      }
    }

    const anyFail = results.some((r) => !r.ok);
    if (anyFail) {
      return NextResponse.json({ message: 'Algunos correos no se pudieron enviar', results }, { status: 207 });
    }

    return NextResponse.json({ ok: true, results });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ message: 'Error procesando la solicitud' }, { status: 500 });
  }
}
