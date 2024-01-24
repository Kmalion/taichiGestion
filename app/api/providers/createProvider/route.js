import { NextResponse } from 'next/server';
import Provider from '@/models/Proveedor';
import connectDB from '@/utils/db';

export const POST = async (request) => {
  try {
    await connectDB();

    // Extrae los datos de la solicitud
    const { idp, nombre, contacto, email, telefono, direccion, ubicacion, especialidad, created } = await request.json();

    // Crea un nuevo proveedor
    const newProvider = new Provider({
      idp,
      nombre,
      contacto,
      email,
      telefono,
      direccion,
      ubicacion,
      especialidad,
      created,
    });

    // Guarda el nuevo proveedor en la base de datos
    const savedProvider = await newProvider.save();

    // Responde con éxito y la información del nuevo proveedor utilizando NextResponse
    return new NextResponse(JSON.stringify(savedProvider), {
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
