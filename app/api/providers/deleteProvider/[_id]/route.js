import Provider from '@/models/Proveedor';
import connectDB from '@/utils/db';
import { NextResponse } from 'next/server';

export const DELETE = async (request, { params }) => {
    const _id = params._id;

    // Manejar el caso donde _id es undefined
    if (!_id) {
        return new NextResponse('IDP no proporcionado', { status: 400 });
    }

    let connection;

    try {
        // Conecta a la base de datos
        connection = await connectDB();

        // Busca el proveedor por _id
        const existingProvider = await Provider.findOne({ _id });

        // Si no se encuentra el proveedor, responde con un error 404
        if (!existingProvider) {
            return new NextResponse('Proveedor no encontrado', { status: 404 });
        }

        // Asegúrate de que existingProvider es un documento de Mongoose
        if (existingProvider instanceof Provider) {
            // Elimina el proveedor
            await existingProvider.deleteOne();
        } else {
            console.error('existingProvider no es un documento de Mongoose:', existingProvider);
        }

        // Responde con éxito
        return new NextResponse('Proveedor eliminado con éxito', {
            status: 200,
            headers: {
                'Content-Type': 'text/plain',
            },
        });
    } catch (err) {
        console.error('Error al procesar la solicitud:', err);
        return new NextResponse('Error interno del servidor', {
            status: 500,
        });
    } finally {
        // Cierra la conexión después de realizar la operación
        if (connection) {
            await connection.connection.close();
        }
    }
};
