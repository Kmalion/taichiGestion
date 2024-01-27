
import axios from "axios";
import { resolve } from 'url';

const providerService = {
  createProvider: async (providerData) => {
    try {
      const response = await axios.post(`/api/providers/createProvider`, providerData);

      if (response.status === 201) {
        return response.data;
      } else {
        throw new Error('Error al crear el proveedor');
      }
    } catch (error) {
      console.error('Error en la solicitud HTTP:', error.message);
      throw error;
    }
  },

  getProviders: async () => {
    try {
      const response = await axios.get(`/api/providers/getProviders`);

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Error al obtener la lista de proveedores');
      }
    } catch (error) {
      console.error('Error en la solicitud HTTP:', error.message);
      throw error;
    }
  },

  updateProvider: async (_id, providerData) => {
    try {
      console.log(`/api/providers/updateProvider/${_id}`);
      const response = await axios.put(`/api/providers/updateProvider/${_id}`, providerData);
  
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Error al actualizar el proveedor');
      }
    } catch (error) {
      console.error('Error en la solicitud HTTP:', error.message);
      throw error;
    }
  },
  
  deleteProvider: async (_id) => {
    try {
      const response = await axios.delete(`/api/providers/deleteProvider/${_id}`);
  
      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Error al eliminar el proveedor');
      }
    } catch (error) {
      console.error('Error en la solicitud HTTP:', error.message);
      throw error;
    }
  },
  
  searchProviders : async (query, serverURL) => {
    try {
      let apiUrl;
      
      // Verifica si estamos en el servidor o en el cliente
      if (typeof window !== 'undefined') {
        apiUrl = resolve(window.location.origin, '/api/providers/searchProviders');
      } else {
        // `serverURL` debe proporcionarse al llamar desde el lado del servidor
        apiUrl = resolve(serverURL, '/api/providers/searchProviders');
      }
  
      const url = new URL(apiUrl);
      url.searchParams.set('q', query);
  
      const response = await axios.get(url.toString(), {
        headers: {
          'Cache-Control': 'no-cache',
        },
      });
  
      if (response.status === 200) {
        const providers = response.data;
        console.log("Proveedores servicio: ", providers);
        return providers;
      } else {
        console.error('Error al obtener proveedores:', response.statusText);
        throw new Error('Error al obtener proveedores');
      }
    } catch (error) {
      console.error('Error al buscar proveedores:', error);
      throw error;
    }
  }

};

export default providerService;
