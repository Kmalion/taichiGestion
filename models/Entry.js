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
      type: String, // Ajusta el tipo según tus necesidades
    },
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product', // Nombre del modelo de la colección de productos
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
    // Otros campos relacionados con la entrada
  });

  // Crea el modelo 'Entry'
  Entry = mongoose.model('Entry', entrySchema);
}

export default Entry;
