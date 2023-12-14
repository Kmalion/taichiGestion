
import Product from '@/models/Product';
import connectDB from '@/utils/db';
import { NextResponse } from 'next/server';

// Handler para la ruta de actualización del producto
export const PUT = async (request, { params }) => {
    const { body } = request;
    const idp = params.idp;

    // Maneja el caso donde idp es undefined
   if (!idp) {
        return new NextResponse('IDP no proporcionado', { status: 400 });
    }

    let client;

    try {
        // Conecta a la base de datos
        client = await connectDB();

        // Busca el producto por idp
        const existingProduct = await Product.findOne({ idp });

        // Si no se encuentra el producto, responde con un error 404
        if (!existingProduct) {
            return new NextResponse('Producto no encontrado', { status: 404 });
        }

        // Lee el cuerpo de la solicitud y conviértelo a JSON manualmente
        const chunks = [];
        for await (const chunk of body) {
            chunks.push(chunk);
        }
        const bodyText = Buffer.concat(chunks).toString('utf-8');

        // Intenta parsear el cuerpo de la solicitud como JSON
        let updatedProductData;
        try {
 
            updatedProductData = JSON.parse(bodyText);
        } catch (parseError) {
            console.error('Error al parsear JSON:', parseError);
            return new NextResponse('Cuerpo de solicitud no es un JSON válido', { status: 400 });
        }

        // Actualiza el producto con los datos del cuerpo de la solicitud
        existingProduct.set(updatedProductData);
        await existingProduct.save();

        // Responde con éxito
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
        // Cierra la conexión después de realizar la operación
        if (client) {
            await client.connection.close();
        }
    }
};

