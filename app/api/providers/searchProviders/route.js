import connectDB from '@/utils/db';
import Provider from '@/models/Proveedor';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic'

export const GET = async (params) => {
  let client;

  try {
    // Conecta a la base de datos
    client = await connectDB();

    // Asegúrate de que searchParams esté definido
    const queryUrl = params.url;
    const encodedQueryValue = queryUrl.split('=')[1] || '';
    const queryValue = decodeURIComponent(encodedQueryValue.replace(/\+/g, ' '));
  
    // Realiza la operación para obtener proveedores que coincidan con el nombre
    const providers = await Provider.find({
      nombre: { $regex: new RegExp(queryValue, 'i') }, // Filtra insensible a mayúsculas y minúsculas
    });
  
    return new NextResponse(JSON.stringify(providers), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // Maneja errores y responde con un código de estado 500
    console.error('Error al buscar proveedores:', error);

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
