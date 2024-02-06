// api/products/getAllLotes.js

import connectDB from '../../../../utils/db';
import Product from '../../../../models/Product';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export const GET = async (request) => {
    let client;

    try {
        // Conecta a la base de datos
        client = await connectDB();

        // Realiza la operación para obtener todos los productos
        const products = await Product.find();
       

        // Obtén todos los lotes de los productos
        const allLotes = products.reduce((lotes, product) => {
            if (product.lote) {
                lotes.push(product.lote);
            }

            return lotes;
        }, []);

        return new NextResponse(JSON.stringify(allLotes), {
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
    } finally {
        // Cierra la conexión después de realizar la operación
        if (client) {
            await client.connection.close();
        }
    }
};
