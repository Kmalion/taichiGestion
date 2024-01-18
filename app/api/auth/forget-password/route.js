import User from '@/models/User';
import connectDB from '@/utils/db';
import { NextResponse } from 'next/server';
import crypto from 'crypto';

export const POST = async (request) => {
  const { email } = await request.json();

  let client;

  try {
    // Conecta a la base de datos
    client = await connectDB();
    if (!client) {
      throw new Error('Error al conectar a la base de datos');
    }

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return new NextResponse('El email no se encuentra registrado', { status: 400 });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const passwordResetToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');

    const passwordResetExpires = Date.now() + 3600000;

    existingUser.resetToken = passwordResetToken;
    existingUser.resetTokenExpiry = passwordResetExpires;

    // La siguiente línea al pasarla a producción debe tener la variable de entorno
    const resetUrl = `localhost:3000/reset-password/${resetToken}`;

    console.log('Reset URL', resetUrl);
  } catch (error) {
    console.error(error);
  } finally {
    // Cerrar la conexión a la base de datos si está abierta
    if (client && client.close) {
      await client.close();
    }
  }
};
