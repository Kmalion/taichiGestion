import connectDB from '../../../../utils/db';
import Product from '../../../../models/Product';
import { NextResponse } from 'next/server';

export const GET = async (request, { params }) => {
  let client;

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query'); // Obtén el valor del parámetro 'query'
    console.log('url búsqueda', searchParams);

    // Conecta a la base de datos
    client = await connectDB();

    // Realiza la operación para buscar productos por referencia
    const products = await Product.find({
      reference: { $regex: new RegExp(query, 'i') },
    });
    console.log(JSON.stringify(products));

    // Extrae solo el campo "referencia" de cada producto
    const references = products.map((product) => product.reference);

    // Responde con las referencias en formato JSON
    return new NextResponse(JSON.stringify(references), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    // Maneja errores y responde con un código de estado 500
    return new NextResponse(error, {
      status: 500,
    });
  } finally {
    // Cierra la conexión después de realizar la operación
    if (client) {
      await client.connection.close();
    }
  }
};
