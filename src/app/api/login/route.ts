import { connectDB } from '@/lib/mongoose';
import Invitado from '@/models/Invitado';
import jwt from 'jsonwebtoken';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = process.env.JWT_SECRET!;

export async function POST(req: NextRequest) {
  await connectDB();

  const { codigo } = await req.json();

  if (!codigo) {
    return NextResponse.json({ success: false, message: 'Código requerido' }, { status: 400 });
  }

  const invitado = await Invitado.findOne({ codigo: codigo.trim().toUpperCase(), autorizado: true });

  if (!invitado) {
    return NextResponse.json({ success: false, message: 'Código no válido o no estás invitado' }, { status: 401 });
  }

  // Opcional: marcar como usado
  invitado.usado = true;
  invitado.fechaIngreso = new Date();
  await invitado.save();

  const token = jwt.sign(
    {
      id: invitado._id,
      codigo: invitado.codigo,
      nombre: invitado.nombre
    },
    JWT_SECRET,
    { expiresIn: '1d' }
  );

  const res = NextResponse.json({ success: true });
  res.cookies.set('user_token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24
  });

  return res;
}
