import connectDB from '../../../../utils/db';
import Entry from '../../../../models/Entry';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic'

export const GET = async (request) => {
  try {
    // Conecta a la base de datos
    await connectDB();

    // Realiza la operación para obtener la última entrada
    const lastEntry = await Entry.findOne().sort({ _id: -1 });

    let entradaNo;

    // Verifica si hay una última entrada
    if (lastEntry) {
      // Si hay una última entrada, toma su entradaNo
      entradaNo = lastEntry.entradaNo;
    } else {
      // Si no hay una última entrada, genera una con el formato "año-1"
      const currentYear = new Date().getFullYear();
      entradaNo = `${currentYear}-0`;
    }

    // Responde solo con la propiedad entradaNo de la última entrada en formato JSON
    return new NextResponse(JSON.stringify(entradaNo), {
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
