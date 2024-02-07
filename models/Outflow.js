import mongoose from 'mongoose';

let Outflow;

try {
  // Intenta cargar el modelo si ya existe
  Outflow = mongoose.model('Outflow');
} catch (e) {
  // Si el modelo no existe, crea uno nuevo
  const outflowSchema = new mongoose.Schema({
    salidaNo: {
      type: String,
      required: true,
    },
    fechaSalida: {
      type: Date,
      required: true,
    },
    cliente: {
      type: mongoose.Schema.Types.Mixed,
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
    totalPrice: {
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
    comment: {
      type: String,
    },
    // Otros campos relacionados con la salida
  });

  // Crea el modelo 'Outflow'
  Outflow = mongoose.model('Outflow', outflowSchema);
}

export default Outflow;
