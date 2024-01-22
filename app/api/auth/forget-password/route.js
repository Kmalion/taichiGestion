import User from '@/models/User';
import connectDB from '@/utils/db';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import { Resend } from 'resend';
import EmailResetTemplate from '@/components/email/EmailTemplate';

const resend = new Resend(process.env.RESEND_API_KEY);

export const POST = async (request) => {
  const { email } = await request.json();

  let client;

  try {
    // Validar la dirección de correo electrónico
    if (!isValidEmail(email)) {
      return new NextResponse('Correo electrónico no válido', { status: 400 });
    }

    // Conectar a la base de datos
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

    await existingUser.save()
    
    const data = await resend.emails.send({
      from: 'Tacihi <info@taichi-holdings-colombia.com>',
      to: [email],
      subject: 'Cambio de contraseña',
      react: EmailResetTemplate({ resetUrl }), // Corregido aquí
      text: ""
    });
    
    

    console.log("ID email enviado", data);
    console.log('Reset URL', resetUrl);

    return new NextResponse({ message: "Email enviado" }, { status: 200 });
  } catch (error) {
    console.error('Error al enviar el correo electrónico:', error);
    return new NextResponse({ message: "Error" }, { status: 400 });
  } finally {
    // Cerrar la conexión a la base de datos si está abierta
    if (client && client.close) {
      await client.close();
    }
  }
};

// Función de validación de correo electrónico
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};
