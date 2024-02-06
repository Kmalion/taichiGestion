import mongoose from 'mongoose';
import OutflowSchema from '@/models/Outflow';

class OutflowServiceManager {
  constructor(path) {
    this.path = path;
  }

  async addOutflow(newOutflow, products) {
    try {
      // Verifica si la lista de productos está vacía
      if (!products || products.length === 0) {
        throw new Error('La lista de productos no puede estar vacía.');
      }

      // Asigna los productos a la nueva Outflow
      newOutflow.products = products;

      // Crea una nueva instancia de Outflow
      const outflow = new OutflowSchema(newOutflow);

      // Guarda la nueva Outflow en la base de datos
      await outflow.save();

      console.log('Salida de inventario agregada exitosamente!');
    } catch (error) {
      console.error('Error al agregar la salida de inventario:', error);
      throw error;
    }
  }
}

export default OutflowServiceManager;
