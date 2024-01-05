import mongoose from 'mongoose';

let Entry;

try {
  // Intenta cargar el modelo si ya existe
  Entry = mongoose.model('Entry');
} catch (e) {
  // Si el modelo no existe, crea uno nuevo
  const entrySchema = new mongoose.Schema({
    entradaNo: {
      type: String,
      required: true,
    },
    fechaEntrada: {
      type: Date,
      required: true,
    },
    proveedor: {
      type: String,
      required: true,
    },
    tipo: {
      type: String,
      required: true,
    },
    asigned_to: {
      type: Object,
      required: true,
    },
    products: [
      {
        _id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Product',
        },
        reference: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        cost: {
          type: Number,
          required: true,
        },
        serials: {
          type: String,
        },
        lote: {
          type: String,
        },
        ubicacion: {
          type: String,
        },
        exp_date: {
          type: Date,
        },
      },
    ],
    totalCost: {
      type: Number,
      default: 0,
    },
    totalQuantity: {
      type: Number,
      default: 0,
    },
    created_by: {
      type: String,
    },
    document: {
      type: String,
    },
    cliente: {
      type: String,
    },
    comment: {
      type: String,
    },
    // Otros campos relacionados con la entrada
  });

  // Crea el modelo 'Entry'
  Entry = mongoose.model('Entry', entrySchema);
}

export default Entry;
