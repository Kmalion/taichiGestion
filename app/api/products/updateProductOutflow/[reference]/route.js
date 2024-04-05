import Product from '../../../../../models/Product';
import connectDB from '../../../../../utils/db';
import { NextResponse } from 'next/server';

export const PATCH = async (request, { params }) => {
    const { body } = request;
    const reference = params.reference;
    console.log("Referencia en backend a actualizar: ", reference)

    if (!reference) {
        return new NextResponse('Reference no proporcionado', { status: 400 });
    }

    let client;

    try {
        client = await connectDB();
        const existingProduct = await Product.findOne({ reference });

        console.log("Producto existente en backend: ", existingProduct)

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
            console.log("Informacion para actualizar", updatedProductData)
        } catch (parseError) {
            console.error('Error al parsear JSON:', parseError);
            return new NextResponse('Cuerpo de solicitud no es un JSON válido', { status: 400 });
        }

        // Actualizar los campos relevantes del producto existente
        existingProduct.price = updatedProductData.price || existingProduct.price;
        existingProduct.ubicacion = updatedProductData.ubicacion || existingProduct.ubicacion;
        existingProduct.serials = updatedProductData.serials || existingProduct.serials;
        existingProduct.lote = updatedProductData.lote || existingProduct.lote;

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
