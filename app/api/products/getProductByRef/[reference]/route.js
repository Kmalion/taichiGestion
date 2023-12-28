// getProductQuantity.js
import Product from '@/models/Product';
import connectDB from '@/utils/db';
import { NextResponse } from 'next/server';

export const GET = async (request, { params }) => {
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

    // Responde con la cantidad actual del producto
    return new NextResponse(JSON.stringify({ quantity: existingProduct.quantity }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
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
