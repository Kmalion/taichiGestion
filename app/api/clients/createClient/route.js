import { NextResponse } from 'next/server';
import Client from '@/models/Cliente';
import connectDB from '@/utils/db'; // Ajusta la importación según la ubicación de tu utilidad de conexión a la base de datos

export const POST = async (request) => {
  try {
    // Conecta a la base de datos
    await connectDB();

    // Extrae los datos de la solicitud
    const { idc, nombre, contacto, email, telefono, direccion, ubicación, created, linea, asesor, especialidad, tipoCliente } = await request.json();

 

    // Crea un nuevo cliente
    const newClient = new Client({
      idc,
      nombre,
      contacto,
      email,
      telefono,
      direccion,
      ubicación,
      created,
      linea,
      asesor,
      especialidad,
      tipoCliente
    });

    // Guarda el nuevo cliente en la base de datos
    const savedClient = await newClient.save();

    // Responde con éxito y la información del nuevo cliente utilizando NextResponse
    return new NextResponse(JSON.stringify(savedClient), {
      status: 201,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);

    // Responde con un mensaje de error utilizando NextResponse
    return new NextResponse(JSON.stringify({ error: 'Error interno del servidor' }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
};
