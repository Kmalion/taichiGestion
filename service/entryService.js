import axios from 'axios';

export const generateEntryNo = async () => {
  try {
    // Realiza una petición al backend para obtener el último número de entrada
    const response = await axios.get('/api/entries/getLastEntry');

    const lastEntryNo = response.data;

    // Verifica si el último número de entrada es válido
    if (!lastEntryNo) {
      throw new Error('El último número de entrada no es válido.');
    }

    // Calcula el nuevo número de entrada
    const currentYear = new Date().getFullYear();
    const initialConsecutive = 1;
    const newEntryNumber = parseInt(lastEntryNo.split('-')[1], 10) + 1;

    // Verifica si el cálculo del nuevo número es válido
    if (isNaN(newEntryNumber) || newEntryNumber < initialConsecutive) {
      throw new Error('Error en el cálculo del nuevo número de entrada.');
    }

    // Puedes ajustar el formato del ID según tus necesidades

    const newEntry = `${currentYear}-${newEntryNumber}`;
    console.log('Nuevo número de entrada:', newEntry);
    return newEntry;
  } catch (error) {
    // Maneja errores si la solicitud al backend falla o hay problemas en la lógica
    console.error('Error al generar el número de entrada:', error);
    throw error;
  }
};


export const EntryService = {
  getEntries: async () => {
    try {
      const response = await axios.get('/api/entries/getEntries');
      return response.data;
    } catch (error) {
      console.error('Error al obtener las entradas:', error);
      throw error;
    }
  },

  getLastEntry: async () => {
    try {
      const response = await axios.get('/api/entries/getLastEntry');
      return response.data;
    } catch (error) {
      console.error('Error al obtener la última entrada:', error);
      throw error;
    }
  },
  ///// Funcion de borrar 
  deleteEntry: async (entryNo) => {
    try {
      // Realiza una petición al backend para eliminar la entrada
      await axios.delete(`/api/entries/deleteEntry/${entryNo}`);
    } catch (error) {
      console.error('Error al eliminar la entrada:', error);
      throw error;
    }
  },
  // Nueva función para obtener el número de entrada antes de guardar
  generateAndRetrieveEntryNo: async () => {
    try {
      return await generateEntryNo();
    } catch (error) {
      throw error;
    }
  },
 
};
// Función para buscar productos por referencia
export const searchProducts = async (query) => {
  try {
    const url = new URL('/api/products/getProductsSearch', window.location.origin);
    url.searchParams.set('q', query);


    const response = await fetch(url.toString());

    if (response.ok) {
      const products = await response.json();
      return products;
    } else {
      console.error('Error al obtener productos:', response.statusText);
      throw new Error('Error al obtener productos');
    }
  } catch (error) {
    console.error('Error al buscar productos:', error);
    throw error;
  }
};