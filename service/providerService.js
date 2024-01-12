import axios from "axios";

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

  updateProvider: async (idp, providerData) => {
    try {
      const response = await axios.put(`/api/providers/updateProvider/${idp}`, providerData);

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

  deleteProvider: async (idp) => {
    try {
      const response = await axios.delete(`/api/providers/deleteProvider/${idp}`);

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
};

export default providerService;
