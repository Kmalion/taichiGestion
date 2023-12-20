import connectDB from '../../../../../utils/db';
import User from '../../../../../models/User';
import { NextResponse } from 'next/server';



export const DELETE = async (request, {params}) => {
  const { query } = request; // Obtén el correo electrónico del usuario desde los parámetros
  const email = params.email
  console.log("email a borrar :", email)
  let client;

  try {
    // Conecta a la base de datos
    client = await connectDB();

    // Realiza la operación para encontrar y eliminar el usuario por su correo electrónico
    const deletedUser = await User.findOneAndDelete({ email });

    if (!deletedUser) {
      // Si no se encuentra el usuario, responde con un código de estado 404
      return new NextResponse(
        JSON.stringify({ error: 'User not found' }),
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }

    console.log('Usuario eliminado desde MongoDB:', deletedUser);

    // Retorna la información del usuario eliminado en formato JSON
    return new NextResponse(
      JSON.stringify({ deletedUser }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } catch (error) {
    // Maneja errores y responde con un código de estado 500
    return new NextResponse(
      JSON.stringify({ error: 'Internal Server Error' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  } finally {
    // Cierra la conexión después de realizar la operación
    if (client) {
      await client.connection.close();
    }
  }
};
