import connectDB from '../../../../utils/db';
import Client from '@/models/Cliente';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic'

export const GET = async (request) => {
    try {
        // Conecta a la base de datos
        await connectDB();

        // Realiza la operación para obtener todos los clientes
        const clients = await Client.find();

        // Responde con los clientes en formato JSON
        return new NextResponse(JSON.stringify(clients), {
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
