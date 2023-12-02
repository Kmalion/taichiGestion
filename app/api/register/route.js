import User from '../../../models/User';
import connect from '@/utils/db';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

export const POST = async (request) => {
  const { email, password, role, nombre, apellido, cargo, foto } = await request.json();

  let client;

  try {
    // Conecta a la base de datos
    client = await connect();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return new NextResponse('El email ya se encuentra registrado', { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 5);
    const newUser = new User({
      email,
      password: hashedPassword,
      nombre,
      apellido,
      cargo,
      foto,
      role,
    });

    // Realiza la operación de registro
    await newUser.save();

    // Incluye la URL de redirección en el cuerpo de la respuesta
    return new NextResponse(JSON.stringify({ redirect: '/' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (err) {
    return new NextResponse(err, {
      status: 500,
    });
  } finally {
    // Cierra la conexión después de realizar la operación
    if (client) {
      await client.close();
    }
  }
};
