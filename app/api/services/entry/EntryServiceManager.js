import mongoose from 'mongoose';
import EntrySchema from '../../../../models/Entry'; // Ajusta la importación del esquema de Entry

class EntryServiceManager {
  constructor(path) {
    this.path = path;
  }

  async addEntry(newEntry, products) {
    try {
      // Asigna los productos al nuevo Entry
      newEntry.products = products;

      // Crea una nueva instancia de Entry
      const entry = new EntrySchema(newEntry);

      // Guarda el nuevo Entry en la base de datos
      await entry.save();

      console.log('Entrada agregada exitosamente!');
    } catch (error) {
      console.error('Error al agregar la entrada:', error);
      throw error;
    }
  }
}

export default EntryServiceManager;
