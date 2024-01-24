import Client from '@/models/Cliente';
import connectDB from '@/utils/db';
import { NextResponse } from 'next/server';

export const DELETE = async (request, { params }) => {
  const _id = params._id;

  // Manejar el caso donde _id es undefined
  if (!_id) {
    return new NextResponse('_ID no proporcionado', { status: 400 });
  }

  let client;

  try {
    // Conecta a la base de datos
    client = await connectDB();

    // Busca el cliente por _id
    const existingClient = await Client.findOne({ _id });

    // Si no se encuentra el cliente, responde con un error 404
    if (!existingClient) {
      return new NextResponse('Cliente no encontrado', { status: 404 });
    }

    // Asegúrate de que existingClient es un documento de Mongoose
    if (existingClient instanceof Client) {
      // Elimina el cliente
      await existingClient.deleteOne();
    } else {
      console.error('existingClient no es un documento de Mongoose:', existingClient);
    }

    // Responde con éxito
    return new NextResponse('Cliente eliminado con éxito', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (err) {
    console.error('Error al procesar la solicitud:', err);
    return new NextResponse('Error interno del servidor', {
      status: 500,
    });
  } finally {
    // Cierra la conexión después de realizar la operación
    if (client) {
      await client.connection.close();
    }
  }
};
