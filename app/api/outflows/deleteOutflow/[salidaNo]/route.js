import Outflow from '@/models/Outflow';
import connectDB from '@/utils/db';
import { NextResponse } from 'next/server';

export const DELETE = async (request, { params }) => {
    const salidaNo = params.salidaNo;

    // Manejar el caso donde salidaNo es undefined
    if (!salidaNo) {
        return new NextResponse('Salida No. no proporcionada', { status: 400 });
    }

    let client;

    try {
        // Conecta a la base de datos
        client = await connectDB();

        // Busca la salida por el número de salida
        const existingOutflow = await Outflow.findOne({ salidaNo });

        // Si no se encuentra la salida, responde con un error 404
        if (!existingOutflow) {
            return new NextResponse('Salida de inventario no encontrada', { status: 404 });
        }

        // Asegúrate de que existingOutflow es un documento de Mongoose
        if (existingOutflow instanceof Outflow) {
            // Elimina la salida de inventario
            await existingOutflow.deleteOne();
        } else {
            console.error('existingOutflow no es un documento de Mongoose:', existingOutflow);
        }

        // Responde con éxito
        return new NextResponse('Salida de inventario eliminada con éxito', {
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
