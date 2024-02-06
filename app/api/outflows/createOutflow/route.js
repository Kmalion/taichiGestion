import OutflowServiceManager from '../../services/outflow/OutflowServiceManager'; // Ajusta la importación según la ubicación de tu servicio
import connectDB from '../../../../utils/db'; // Ajusta la importación según la ubicación de tu utilidad de conexión a la base de datos
import { NextResponse } from 'next/server';

export const POST = async (request) => {
  try {
    // Conecta a la base de datos
    await connectDB();
    
    // Extrae los datos de la solicitud
    const { salidaNo, fechaSalida, destino, tipo, asigned_to, products, totalCost, totalQuantity, created_by, cliente, document, comment } = await request.json();

    const modifiedProducts = products.map((product) => ({
      ...product,
      serials: Array.isArray(product.serials) ? product.serials : [{ serial: product.serials, status: 'disponible' }],
    }));
    
    const outflowServiceManager = new OutflowServiceManager();

    // Crea una nueva salida utilizando el servicio
    await outflowServiceManager.addOutflow({
      salidaNo,
      fechaSalida,
      destino,
      tipo,
      asigned_to,
      totalCost,
      totalQuantity,
      created_by,
      cliente,
      document,
      comment
    }, modifiedProducts);
    
    // Responde con éxito y la información de la nueva salida
    return new NextResponse(JSON.stringify({ redirect: '/salidas' }), {
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
