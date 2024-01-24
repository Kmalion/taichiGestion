import Client from '@/models/Cliente';
import connectDB from '@/utils/db';
import { NextResponse } from 'next/server';

// Handler para la ruta de actualización del cliente
export const PUT = async (request, { params }) => {
  const { body } = request;
  const _id = params._id; // Cambia el nombre del parámetro según lo que estás usando

  // Maneja el caso donde _id es undefined
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

    // Lee el cuerpo de la solicitud y conviértelo a JSON manualmente
    const chunks = [];
    for await (const chunk of body) {
      chunks.push(chunk);
    }
    const bodyText = Buffer.concat(chunks).toString('utf-8');

    // Intenta parsear el cuerpo de la solicitud como JSON
    let updatedClientData;
    try {
      updatedClientData = JSON.parse(bodyText);
    } catch (parseError) {
      console.error('Error al parsear JSON:', parseError);
      return new NextResponse('Cuerpo de solicitud no es un JSON válido', { status: 400 });
    }

    // Actualiza el cliente con los datos del cuerpo de la solicitud
    existingClient.set(updatedClientData);
    await existingClient.save();

    // Responde con éxito
    return new NextResponse('Cliente actualizado con éxito', {
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
