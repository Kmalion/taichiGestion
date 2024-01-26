import connectDB from '@/utils/db';
import Client from '@/models/Cliente';
import { NextResponse } from 'next/server';


export const GET = async (params) => {
  let client;

  try {
    // Conecta a la base de datos
    client = await connectDB();

    // Asegúrate de que query.valor esté definido
    const queryUrl = params.url;
    const encodedQueryValue = queryUrl.split('=')[1] || '';
    const queryValue = decodeURIComponent(encodedQueryValue.replace(/\+/g, ' '));
    
    // Verifica si 'valor' está presente antes de intentar acceder
    const clients = await Client.find({
      nombre: { $regex: new RegExp(queryValue, 'i') },
    });

    return new NextResponse(JSON.stringify(clients), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // Maneja errores y responde con un código de estado 500
    console.error('Error al buscar clientes:', error);

    return new NextResponse(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } finally {
    // Cierra la conexión después de realizar la operación
    if (client) {
      await client.connection.close();
    }
  }
};
