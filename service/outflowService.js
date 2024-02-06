import axios from 'axios';

export const generateOutflowNo = async () => {
    try {
      // Realiza una petición al backend para obtener el último número de salida
      const respuesta = await axios.get('/api/outflows/getLastOutflow');
  
      const ultimoNumeroSalida = respuesta.data;
  
      // Verifica si el último número de salida es válido
      if (!ultimoNumeroSalida) {
        throw new Error('El último número de salida no es válido.');
      }
  
      // Calcula el nuevo número de salida
      const añoActual = new Date().getFullYear();
      const consecutivoInicial = 1;
      const nuevoNumeroSalida = parseInt(ultimoNumeroSalida.split('-')[1], 10) + 1;
  
      // Verifica si el cálculo del nuevo número es válido
      if (isNaN(nuevoNumeroSalida) || nuevoNumeroSalida < consecutivoInicial) {
        throw new Error('Error en el cálculo del nuevo número de salida.');
      }
  
      // Puedes ajustar el formato del ID según tus necesidades
      const nuevaSalida = `${añoActual}-${nuevoNumeroSalida}`;
      return nuevaSalida;
    } catch (error) {
      // Maneja errores si la solicitud al backend falla o hay problemas en la lógica
      console.error('Error al generar el número de salida:', error);
      throw error;
    }
  };
  
  export const OutflowService = {
    getOutflows: async () => {
      try {
        const respuesta = await axios.get('/api/outflows/getOutflows');
        return respuesta.data;
      } catch (error) {
        console.error('Error al obtener las salidas:', error);
        throw error;
      }
    },
  
    getLastOutflow: async () => {
      try {
        const respuesta = await fetch('/api/outflows/getLastOutflow');
        
        if (!respuesta.ok) {
          throw new Error(`Error al obtener la última salida: ${respuesta.statusText}`);
        }
  
        const datos = await respuesta.json();
        return datos;
      } catch (error) {
        console.error('Error al obtener la última salida:', error);
        throw error;
      }
    },
  
    deleteOutflow: async (outflowNo) => {
      try {
        // Realiza una petición al backend para eliminar la salida
        await axios.delete(`/api/salidas/deleteOutflow/${outflowNo}`);
      } catch (error) {
        console.error('Error al eliminar la salida:', error);
        throw error;
      }
    },
  
    generateAndRetrieveOutflowNo: async () => {
      try {
        return await generateOutflowNo();
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

    // Realiza la búsqueda solo en el lado del cliente
    if (typeof window !== 'undefined') {
      const response = await axios.get(url.toString(), {
        headers: {
          'Cache-Control': 'no-cache', // Para evitar el almacenamiento en caché del navegador
        },
      });

      if (response.status === 200) {
        const products = response.data;
        return products;
      } else {
        console.error('Error al obtener productos:', response.statusText);
        throw new Error('Error al obtener productos');
      }
    } else {
      // Si se está generando estáticamente, devuelve una respuesta vacía o maneja de otra manera
      return [];
    }
  } catch (error) {
    console.error('Error al buscar productos:', error);
    throw error;
  }
}



export const getAllSerials = async () => {
  try {
    // Realiza una solicitud a la API para obtener todos los seriales
    const response = await axios.get('/api/products/getAllSerials');

    if (response.status === 200) {
      // Obtiene la lista de seriales
      const allSerials = response.data;

      return allSerials;
    } else {
      console.error('Error al obtener seriales:', response.statusText);
      throw new Error('Error al obtener seriales');
    }
  } catch (error) {
    console.error('Error al buscar seriales de productos:', error);
    throw error;
  }
};
export const getAllLotes = async () => {
  try {
    // Realiza una solicitud a la API para obtener todos los lotes
    const response = await axios.get('/api/products/getAllLotes');

    if (response.status === 200) {
      // Loguea la respuesta completa para entender su estructura


      // Combina todos los arrays de lotes en uno solo
      const allLotes = response.data.reduce((combined, lotesArray) => {
        return combined.concat(lotesArray);
      }, []);

      // Filtra los lotes que tienen algún valor (ignora los lotes vacíos o nulos)
      const lotes = allLotes.filter(lote => {
        // Verifica si lote es una cadena antes de intentar llamar a trim()
        if (typeof lote === 'string' || lote instanceof String) {
          // Si lote es una cadena, elimina los espacios y verifica si sigue teniendo contenido
          return lote.trim() !== '';
        }

        // Si lote no es una cadena, no lo incluimos en el resultado
        return false;
      });



      return lotes;
    } else {
      console.error('Error al obtener lotes:', response.statusText);
      throw new Error('Error al obtener lotes');
    }
  } catch (error) {
    console.error('Error al buscar lotes:', error);
    throw error;
  }
};


