// pages/api/searchReferences/index.js
import connectDB from '../../../../utils/db';
import Product from '../../../../models/Product';
import { NextResponse } from 'next/server';

export const GET = async (request) => {
  let client;

  try {
    const { query } = request.query;

    // Conecta a la base de datos
    client = await connectDB();

    // Realiza la operación para buscar productos por referencia
    const products = await Product.find({
      reference: { $regex: new RegExp(query, 'i') },
    });

    // Responde con los productos en formato JSON
    return new NextResponse(JSON.stringify(products), {
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
