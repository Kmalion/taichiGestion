import Entry from '@/models/Entry';
import connectDB from '@/utils/db';
import { NextResponse } from 'next/server';

export const DELETE = async (request, { params }) => {
    const entradaNo = params.entradaNo;

    // Manejar el caso donde entradaNo es undefined
    if (!entradaNo) {
        return new NextResponse('Entrada No. no proporcionada', { status: 400 });
    }

    let client;

    try {
        // Conecta a la base de datos
        client = await connectDB();

        // Busca la entrada por el número de entrada
        const existingEntry = await Entry.findOne({ entradaNo });

        // Si no se encuentra la entrada, responde con un error 404
        if (!existingEntry) {
            return new NextResponse('Entrada no encontrada', { status: 404 });
        }

        // Asegúrate de que existingEntry es un documento de Mongoose
        if (existingEntry instanceof Entry) {
            // Elimina la entrada
            await existingEntry.deleteOne();
        } else {
            console.error('existingEntry no es un documento de Mongoose:', existingEntry);
        }

        // Responde con éxito
        return new NextResponse('Entrada eliminada con éxito', {
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
        if (client) {
            await client.connection.close();
        }
    }
};
