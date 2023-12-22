import EntryServiceManager from '../../services/entry/EntryServiceManager'; // Ajusta la importación según la ubicación de tu servicio
import connectDB from '../../../../utils/db'; // Ajusta la importación según la ubicación de tu utilidad de conexión a la base de datos
import { NextResponse } from 'next/server';

export const POST = async (request) => {
  try {
    // Conecta a la base de datos
    await connectDB();

    // Extrae los datos de la solicitud
    const { entradaNo, fechaEntrada, proveedor, tipo, asigned_to, products, totalCost, totalQuantity, created_by, subtotal } = await request.json();

    // Crea una instancia del servicio EntryServiceManager
    const entryServiceManager = new EntryServiceManager();

    // Crea una nueva entrada utilizando el servicio
    await entryServiceManager.addEntry({
      entradaNo,
      fechaEntrada,
      proveedor,
      tipo,
      asigned_to,
      totalCost,
      totalQuantity,
      created_by,
      subtotal
    }, products);

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
