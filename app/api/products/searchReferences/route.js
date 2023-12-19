import connectDB from '../../../../utils/db';
import Product from '../../../../models/Product';
import { NextResponse } from 'next/server';

export const GET = async (request, { params }) => {
  let client;

  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('query');

    // Conecta a la base de datos
    client = await connectDB();


    const agg =[{
      $search:{
        autocomplete:{
          query: query,
          path: 'reference',
          fuzzy: {
            masEdits: 2
          }
        }
      }
    }, {
      $limit: 5
    },{
      $project:{
        _id: 0,
        reference: 1,
        image: 1,
        category:0,
        description:0,
        brand: 0,
        serials: 0,
        lote: 0,
        quantity: 0,
        price: 0,
        cost: 0,
        rating: 0,
        inventoryStatus:0,
        owner: 0,
        ubicacion:0,
        exp_date: 0,
        created: 0,
      }
    }
  ]

  const result = await Product.aggregate(agg);
  console.log('Respuesta de la base de datos:', result);

    // Extrae solo el campo "reference" de cada producto
    const references = result.map((product) => product.reference);

    // Responde con las referencias en formato JSON
    return new NextResponse(JSON.stringify(references), {
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