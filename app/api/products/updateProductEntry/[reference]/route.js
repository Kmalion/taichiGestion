import Product from '../../../../../models/Product';
import connectDB from '../../../../../utils/db';
import { NextResponse } from 'next/server';

// Manejador para la ruta de actualización parcial del producto
export const PATCH = async (request, { params }) => {
    const { body } = request;
    const reference = params.reference; // Cambiar de idp a reference

    // Manejar el caso donde reference es undefined
    if (!reference) {
        return new NextResponse('Reference no proporcionado', { status: 400 });
    }

    let client;

    try {
        // Conectar a la base de datos
        client = await connectDB();

        // Buscar el producto por reference
        const existingProduct = await Product.findOne({ reference });

        // Si no se encuentra el producto, responder con un error 404
        if (!existingProduct) {
            return new NextResponse('Producto no encontrado', { status: 404 });
        }

        // Leer el cuerpo de la solicitud y convertirlo a JSON manualmente
        const chunks = [];
        for await (const chunk of body) {
            chunks.push(chunk);
        }
        const bodyText = Buffer.concat(chunks).toString('utf-8');

        // Intentar analizar el cuerpo de la solicitud como JSON
        let updatedProductData;
        try {
            updatedProductData = JSON.parse(bodyText);
        } catch (parseError) {
            console.error('Error al parsear JSON:', parseError);
            return new NextResponse('Cuerpo de solicitud no es un JSON válido', { status: 400 });
        }

        // Agregar las nuevas propiedades a actualizar
        if (updatedProductData.exp_date) {
            existingProduct.exp_date = updatedProductData.exp_date;
        }

        if (updatedProductData.cost) {
            existingProduct.cost = updatedProductData.cost;
        }

        if (updatedProductData.ubicacion) {
            existingProduct.ubicacion = updatedProductData.ubicacion;
        }

        // Mantener los datos existentes en serials y lote
        existingProduct.serials = existingProduct.serials.concat(updatedProductData.serials || []);
        existingProduct.lotes = existingProduct.lotes.concat(updatedProductData.lotes || []);

        // Eliminar duplicados en serials y lote
        existingProduct.serials = [...new Set(existingProduct.serials)];
        existingProduct.lotes = [...new Set(existingProduct.lotes)];

        await existingProduct.save();

        // Responder con éxito
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
        // Cerrar la conexión después de realizar la operación
        if (client) {
            await client.connection.close();
        }
    }
};
