import connectDB from '../../../../utils/db';
import User from '../../../../models/User';
import { NextResponse } from 'next/server';

export const GET = async (request) => {
  let client;

  try {
    // Conecta a la base de datos
    client = await connectDB();

    // Realiza la operación para obtener todos los usuarios
    const users = await User.find();


    // Retorna la lista de usuarios en formato JSON
    return new NextResponse(
      JSON.stringify({ users }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    // Maneja errores y responde con un código de estado 500
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } finally {
    // Cierra la conexión después de realizar la operación
    if (client) {
      await client.connection.close();
    }
  }
};
