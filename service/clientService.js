import axios from "axios";

const clientService = {
  createClient: async (clientData) => {
    try {
      const response = await axios.post(`/api/clients/createClient`, clientData);

      if (response.status === 201) {
        return response.data;
      } else {
        throw new Error('Error al crear el cliente');
      }
    } catch (error) {
      console.error('Error en la solicitud HTTP:', error.message);
      throw error;
    }
  },

  getClients: async () => {
    try {
      const response = await axios.get(`/api/clients/getClients`);

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Error al obtener la lista de clientes');
      }
    } catch (error) {
      console.error('Error en la solicitud HTTP:', error.message);
      throw error;
    }
  },

  updateClient: async (_id, clientData) => {
    try {
      const response = await axios.put(`/api/clients/updateClient/${_id}`, clientData);

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Error al actualizar el cliente');
      }
    } catch (error) {
      console.error('Error en la solicitud HTTP:', error.message);
      throw error;
    }
  },

  deleteClient: async (_id) => {
    try {
      const response = await axios.delete(`/api/clients/deleteClient/${_id}`);

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Error al eliminar el cliente');
      }
    } catch (error) {
      console.error('Error en la solicitud HTTP:', error.message);
      throw error;
    }
  },

  searchClients: async (query) => {
    try {
      const url = new URL('/api/clients/searchClients', window.location.origin);
      
      // Asegúrate de que coincida con el nombre del parámetro que espera tu API del servidor
      url.searchParams.set('valor', query);
  
      const response = await fetch(url.toString());
  
      if (response.ok) {
        const clients = await response.json();
        return clients;
      } else {
        console.error('Error al obtener clientes:', response.statusText);
        throw new Error('Error al obtener clientes');
      }
    } catch (error) {
      console.error('Error al buscar clientes:', error);
      throw error;
    }
  }
  
};

export default clientService;
