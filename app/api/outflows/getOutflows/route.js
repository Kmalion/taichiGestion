import connectDB from '../../../../utils/db';
import Outflow from '../../../../models/Outflow';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = async (request) => {
    try {
        // Conecta a la base de datos
        await connectDB();

        // Realiza la operación para obtener todas las salidas de inventario
        const outflows = await Outflow.find().populate('products'); // Asegúrate de ajustar 'products' según el nombre de la propiedad en tu modelo
        const formattedOutflows = outflows.map(outflow => ({
            salidaNo: outflow.salidaNo,
            fechaSalida: `${new Date(outflow.fechaSalida).getDate()}/${new Date(outflow.fechaSalida).getMonth() + 1}/${new Date(outflow.fechaSalida).getFullYear()}`,
            proveedor: outflow.proveedor,
            tipo: outflow.tipo,
            asigned_to: outflow.asigned_to,
            totalPrice: outflow.totalPrice,
            totalQuantity: outflow.totalQuantity,
            created_by: outflow.created_by,
            cliente: outflow.cliente,
            document: outflow.document,
            comment: outflow.comment,
            products: outflow.products,
        }));

        // Responde con las salidas de inventario en formato JSON
        return new NextResponse(JSON.stringify(formattedOutflows), {
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
