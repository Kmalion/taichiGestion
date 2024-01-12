import Provider from '@/models/Proveedor'; // Asegúrate de importar el modelo correcto
import connectDB from '@/utils/db';
import { NextResponse } from 'next/server';

// Handler para la ruta de actualización del proveedor
export const PUT = async (request, { params }) => {
  const { body } = request;
  const idp = params.idp; // Cambia el nombre del parámetro según lo que estás usando

  // Maneja el caso donde idp es undefined
  if (!idp) {
    return new NextResponse('IDP no proporcionado', { status: 400 });
  }

  let provider;

  try {
    // Conecta a la base de datos
    provider = await connectDB();

    // Busca el proveedor por idp
    const existingProvider = await Provider.findOne({ idp });

    // Si no se encuentra el proveedor, responde con un error 404
    if (!existingProvider) {
      return new NextResponse('Proveedor no encontrado', { status: 404 });
    }

    // Lee el cuerpo de la solicitud y conviértelo a JSON manualmente
    const chunks = [];
    for await (const chunk of body) {
      chunks.push(chunk);
    }
    const bodyText = Buffer.concat(chunks).toString('utf-8');

    // Intenta parsear el cuerpo de la solicitud como JSON
    let updatedProviderData;
    try {
      updatedProviderData = JSON.parse(bodyText);
    } catch (parseError) {
      console.error('Error al parsear JSON:', parseError);
      return new NextResponse('Cuerpo de solicitud no es un JSON válido', { status: 400 });
    }

    // Actualiza el proveedor con los datos del cuerpo de la solicitud
    existingProvider.set(updatedProviderData);
    await existingProvider.save();

    // Responde con éxito
    return new NextResponse('Proveedor actualizado con éxito', {
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
    if (provider) {
      await provider.connection.close();
    }
  }
};
