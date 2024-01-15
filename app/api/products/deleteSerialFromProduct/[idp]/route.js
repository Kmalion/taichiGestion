import Product from '@/models/Product';
import connectDB from '@/utils/db';
import { NextResponse } from 'next/server';

export const DELETE = async (request, { params }) => {
    const idp = params.idp;

    if (!idp) {
        // Manejar el caso donde idp es undefined
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

        // Asegúrate de que existingProduct es un documento de Mongoose
        if (existingProduct instanceof Product) {
            // Elimina el producto
            await existingProduct.deleteOne();
        } else {
            console.error('existingProduct no es un documento de Mongoose:', existingProduct);
        }

        // Responde con éxito
        return new NextResponse('Producto eliminado con éxito', {
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
