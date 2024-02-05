import connectDB from '../../../../utils/db';
import Entry from '../../../../models/Entry';
import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic'

export const GET = async (request) => {
    try {
        // Conecta a la base de datos
        await connectDB();

        // Realiza la operación para obtener todas las entradas
        const entries = await Entry.find().populate('products'); // Asegúrate de ajustar 'products' según el nombre de la propiedad en tu modelo
        const formattedEntries = entries.map(entry => ({
            entradaNo: entry.entradaNo,
            fechaEntrada: `${new Date(entry.fechaEntrada).getDate()}/${new Date(entry.fechaEntrada).getMonth() + 1}/${new Date(entry.fechaEntrada).getFullYear()}`,
            proveedor: entry.proveedor,
            tipo: entry.tipo,
            asigned_to: entry.asigned_to,
            totalCost: entry.totalCost,
            totalQuantity: entry.totalQuantity,
            created_by: entry.created_by,
            subtotal: entry.subtotal,
            products: entry.products, 
            document: entry.document,
            cliente: entry.cliente,
            comment: entry.comment
        }));

        // Responde con las entradas en formato JSON
        return new NextResponse(JSON.stringify(formattedEntries), {
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
