import mongoose from 'mongoose';

let Product;

try {
  // Intenta cargar el modelo si ya existe
  Product = mongoose.model('Product');
} catch (e) {
  // Si el modelo no existe, crea uno nuevo
  const productSchema = new mongoose.Schema({
    idp: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    reference: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    serials: [
      {
        serial: {
          type: String,
        },
        status: {
          type: String,
          enum: ['disponible', 'noDisponible'],
          default: 'disponible',
          required: true,
        },
      },
    ],
    lotes: [
      {
        lote: {
          type: String,
        },
        status: {
          type: String,
          enum: ['disponible', 'noDisponible'],
          default: 'disponible',
          required: true,
        },
      },
    ],
    image: {
      type: String,
    },
    quantity: {
      type: Number,
      min: 0,
    },
    price: {
      type: Number,
      default: 0,
    },
    cost: {
      type: Number,
      default: 0,
    },
    rating: {
      type: Number,
      min: 1,
      max: 5,
    },
    inventoryStatus: {
      type: String,
      enum: ['activo', 'inactivo', 'agotado'],
      default: 'activo',
      required: true,
    },
    owner: {
      type: String,
      required: true,
    },
    ubicacion: {
      type: [String],
      default: '',
    },
    exp_date: {
      type: Date,
    },
    created: {
      type: Date,
    },
  });

  // Crea el modelo 'Product'
  Product = mongoose.model('Product', productSchema);
}

export default Product;
