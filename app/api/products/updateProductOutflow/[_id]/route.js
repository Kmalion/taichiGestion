import Product from '../../../../../models/Product';
import connectDB from '../../../../../utils/db';
import { NextResponse } from 'next/server';

export const PATCH = async (request, { params }) => {
    const { body } = request;
    const reference = params.reference;

    if (!reference) {
        return new NextResponse('Reference no proporcionado', { status: 400 });
    }

    let client;

    try {
        client = await connectDB();
        const existingProduct = await Product.findOne({ reference });

        if (!existingProduct) {
            return new NextResponse('Producto no encontrado', { status: 404 });
        }

        const chunks = [];
        for await (const chunk of body) {
            chunks.push(chunk);
        }
        const bodyText = Buffer.concat(chunks).toString('utf-8');

        let updatedProductData;
        try {
            updatedProductData = JSON.parse(bodyText);
        } catch (parseError) {
            console.error('Error al parsear JSON:', parseError);
            return new NextResponse('Cuerpo de solicitud no es un JSON válido', { status: 400 });
        }

      

        if (updatedProductData.price) {
            existingProduct.price = updatedProductData.cost;
        }

        if (updatedProductData.ubicacion) {
            existingProduct.ubicacion = updatedProductData.ubicacion;
        }

        existingProduct.serials = existingProduct.serials.concat(updatedProductData.serials || []);
        existingProduct.lote = existingProduct.lote.concat(updatedProductData.lote || []);

        existingProduct.serials = [...new Set(existingProduct.serials)];
        existingProduct.lote = [...new Set(existingProduct.lote)];

        await existingProduct.save();

        return new NextResponse('Producto actualizado con éxito', {
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
        if (client) {
            await client.connection.close();
        }
    }
};
