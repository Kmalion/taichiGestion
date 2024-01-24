import mongoose from 'mongoose';

let Cliente;

try {
  // Intenta cargar el modelo si ya existe
  Cliente = mongoose.model('Cliente');
} catch (e) {
  // Si el modelo no existe, crea uno nuevo
  const clienteSchema = new mongoose.Schema({
    idc: {
      type: String,
      required: true,
      unique: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    contacto: {
      type: String,
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

    created: {
      type: Date,
      required: true,
    },
    linea: {
      type: String,
      enum: ['medica', 'veterinaria', 'simulacion', 'servicio', 'odontologia', 'laboratorio', 'externo'],
      default: 'medica',
    },
    asesor: {
      type: String,
        // Referencia al modelo User
    },
    especialidad: {
      type: String,
    },
    ubicación: {
      type: String,
    },
    tipoCliente: {
      type: String,
      enum: ['Cliente potencial', 'Distribuidor', 'Speaker', 'Otro'],
      default: 'Cliente potencial',
    },
  });

  // Crea el modelo 'Cliente'
  Cliente = mongoose.model('Cliente', clienteSchema);
}

export default Cliente;
