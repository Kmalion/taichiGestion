import Entry from '../../../../models/Entry';
import connectDB from '../../../../utils/db';
import { NextResponse } from 'next/server';

export const POST = async (request) => {
  try {
    // Conecta a la base de datos
    await connectDB();

    // Extrae los datos de la solicitud
    const { entradaNo, fechaEntrada, proveedor, tipo, asigned_to, products, totalCost, totalQuantity, created_by, subtotal } = await request.json();

    // Convierte 'asigned_to' a una cadena si es un objeto
    const asignedToString = typeof asigned_to === 'object' ? asigned_to.email : asigned_to;

    // Convierte 'products' a un array de objetos si es una cadena
    const productsArray = typeof products === 'string' ? JSON.parse(products) : products;

    // Log de los datos recibidos
    console.log('Datos recibidos del frontend:');
    console.log({
      entradaNo,
      fechaEntrada,
      proveedor,
      tipo,
      asigned_to: asignedToString,
      products: productsArray,
      totalCost,
      totalQuantity,
      created_by,
      subtotal
    });

    // Crea una nueva entrada
    const newEntry = new Entry({
      entradaNo,
      fechaEntrada,
      proveedor,
      tipo,
      asigned_to: asignedToString,
      products: productsArray,
      totalCost,
      totalQuantity,
      created_by,
      subtotal
    });

    // Guarda la nueva entrada en la base de datos
    await newEntry.save();

    // Responde con éxito y la información de la nueva entrada
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
  }
};
