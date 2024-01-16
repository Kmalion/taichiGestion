import Product from '@/models/Product';
import connectDB from '@/utils/db';
import { NextResponse } from 'next/server';

export const DELETE = async (request, { params }) => {
  const { reference } = params;

  console.log("Referencia a eliminar SERVICIO", reference);

  if (!reference) {
    return new NextResponse('Referencia no proporcionada', { status: 400 });
  }

  let client;

  try {
    client = await connectDB();

    const existingProduct = await Product.findOne({ reference });

    if (!existingProduct) {
      return new NextResponse('Producto no encontrado', { status: 404 });
    }

    const bodyText = await request.text();
    const { serials, lote, ubicacion } = JSON.parse(bodyText);

    if (!serials) {
      return new NextResponse('Serial no proporcionado', { status: 400 });
    }

    const result = await Product.updateOne(
      { reference },
      {
        $pull: {
          serials: { serial: serials },
          ubicacion: ubicacion,
          lote: lote,
        }
      }
    );

    if (result.nModified === 0) {
      return new NextResponse('Serial no encontrado en el producto', { status: 404 });
    }

    return new NextResponse('Serial eliminado con éxito', {
      status: 200,
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (err) {
    console.error('Error al procesar la solicitud:', err);
    return new NextResponse('Error interno del servidor', { status: 500 });
  } finally {
    if (client) {
      await client.connection.close();
    }
  }
};
