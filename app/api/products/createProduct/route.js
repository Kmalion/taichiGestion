import Product from '../../../../models/Product';
import connectDB from '../../../../utils/db';
import { NextResponse } from 'next/server';

export const POST = async (request) => {

    const { idp, reference, image, description, category, price, quantity, serials, brand, rating, inventoryStatus, owner, created, exp_date, lote } = await request.json();

    let client
  try {
      // Conecta a la base de datos
      client = await connectDB();


    // Busca si ya existe un producto con la misma referencia
    const existingProduct = await Product.findOne({ reference });
    if (existingProduct) {
      return new NextResponse('La referencia del producto ya existe', { status: 400 });
    }

    // Crea un nuevo producto
    const newProduct = new Product({
      idp,
      reference,
      description,
      category,
      image,
      price,
      quantity,
      serials,
      brand,
      rating,
      inventoryStatus,
      owner,
      created,
      exp_date,
      lote
    });
    // Realiza la operación de creación de producto
    await newProduct.save();

    console.log(newProduct)

    // Responde con éxito y la información del nuevo producto
    return new NextResponse(JSON.stringify({ redirect: '/entradas' }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
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
