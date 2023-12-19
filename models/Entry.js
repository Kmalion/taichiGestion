import mongoose from 'mongoose';

let Entry;

try {
  // Intenta cargar el modelo si ya existe
  Entry = mongoose.model('Entry');
} catch (e) {
  // Si el modelo no existe, crea uno nuevo
  const entrySchema = new mongoose.Schema({
    title: {
      type: String,
      required: true,
    },
    date: {
      type: Date,
      default: Date.now,
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      }
    ],
    totalQuantity: {
      type: Number,
      default: 0,
    },
    totalPrice: {
      type: Number,
      default: 0,
    },
    supplier: {
      type: String,
      required: true,
    },
    document: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
    },
    client: {
      type: String,
    },
    type: {
      type: String,
      enum: ['compras', 'devoluciones', 'ajuste'],
      required: true,
    },
    asigned_to: {
      type: String,
    },
    
  });

  // Crea el modelo 'Entry'
  Entry = mongoose.model('Entry', entrySchema);
}

export default Entry;
