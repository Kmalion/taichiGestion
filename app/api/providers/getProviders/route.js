import connectDB from '@/utils/db';
import Provider from '@/models/Proveedor';
import { NextResponse } from 'next/server';

export const GET = async (request) => {
    try {
        // Conecta a la base de datos
        await connectDB();

        // Realiza la operación para obtener todos los proveedores
        const providers = await Provider.find();

        // Responde con los proveedores en formato JSON
        return new NextResponse(JSON.stringify(providers), {
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
