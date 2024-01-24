import mongoose from 'mongoose';

let Proveedor;

try {
  // Intenta cargar el modelo si ya existe
  Proveedor = mongoose.model('Proveedor');
} catch (e) {
  // Si el modelo no existe, crea uno nuevo
  const proveedorSchema = new mongoose.Schema({
    idp: {
      type: String,
      required: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    contacto: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    telefono: {
      type: String,
      required: true,
    },
    direccion: {
      type: String,
      default: '',
    },
    ubicacion: {
      type: String,
      default: '',
    },
    especialidad: {
      type: String,
      default: '',
    },
    created: {
      type: Date,
      required: true,
    },
  });

  // Crea el modelo 'Proveedor'
  Proveedor = mongoose.model('Proveedor', proveedorSchema);
}

export default Proveedor;
