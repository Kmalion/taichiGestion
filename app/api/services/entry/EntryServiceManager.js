import mongoose from 'mongoose';
import EntrySchema from '../../../../models/Entry';

class EntryServiceManager {
  constructor(path) {
    this.path = path;
  }

  async addEntry(newEntry, products) {
    try {
      // Verifica si la lista de productos está vacía
      if (!products || products.length === 0) {
        throw new Error('La lista de productos no puede estar vacía.');
      }

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
