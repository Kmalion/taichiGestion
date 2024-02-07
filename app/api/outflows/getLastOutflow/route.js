import connectDB from '../../../../utils/db';
import Outflow from '../../../../models/Outflow';
import { NextResponse } from 'next/server';

export const GET = async (request) => {
  try {
    // Conecta a la base de datos
    await connectDB();

    // Realiza la operación para obtener la última salida de inventario
    const lastOutflow = await Outflow.findOne().sort({ _id: -1 });

    let salidaNo;

    // Verifica si hay una última salida de inventario
    if (lastOutflow) {
      // Si hay una última salida de inventario, toma su salidaNo
      salidaNo = lastOutflow.salidaNo;
    } else {
      // Si no hay una última salida de inventario, genera una con el formato "año-1"
      const currentYear = new Date().getFullYear();
      salidaNo = `${currentYear}-0`;
    }


    // Responde solo con la propiedad salidaNo de la última salida de inventario en formato JSON
    return new NextResponse(JSON.stringify(salidaNo), {
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
  }
};
