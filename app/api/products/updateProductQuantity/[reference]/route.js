// updateProductQuantity.js
import Product from '@/models/Product';
import connectDB from '@/utils/db';
import { NextResponse } from 'next/server';

export const PUT = async (request, { params }) => {
  const { reference } = params;

  // Maneja el caso donde la referencia es undefined
  if (!reference) {
    return new NextResponse('Referencia no proporcionada', { status: 400 });
  }

  let client;

  try {
    // Conecta a la base de datos
    client = await connectDB();

    // Busca el producto por referencia
    const existingProduct = await Product.findOne({ reference });

    // Si no se encuentra el producto, responde con un error 404
    if (!existingProduct) {
      return new NextResponse('Producto no encontrado', { status: 404 });
    }

    // Lee el cuerpo de la solicitud y conviértelo a JSON manualmente
    const chunks = [];
    for await (const chunk of request.body) {
      chunks.push(chunk);
    }
    const bodyText = Buffer.concat(chunks).toString('utf-8');

    // Intenta parsear el cuerpo de la solicitud como JSON
    let { quantity } = JSON.parse(bodyText);

    // Actualiza la cantidad del producto
    existingProduct.quantity = quantity;
    await existingProduct.save();

    // Responde con éxito
    return new NextResponse('Cantidad del producto actualizada con éxito', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (err) {
    console.error('Error al procesar la solicitud:', err);
    return new NextResponse('Error interno del servidor', { status: 500 });
  } finally {
    // Cierra la conexión después de realizar la operación
    if (client) {
      await client.connection.close();
    }
  }
};
