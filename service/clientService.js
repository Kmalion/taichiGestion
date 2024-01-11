import axios from "axios";

const clientService = {
  createClient: async (clientData) => {
    try {
      // Realiza la solicitud HTTP utilizando axios
      const response = await axios.post(`/api/clients/createClient`, clientData);

      // Verifica el estado de la respuesta
      if (response.status === 201) {
        // Devuelve los datos del cliente creado
        return response.data;
      } else {
        // Lanza un error en caso de que el estado no sea 201
        throw new Error('Error al crear el cliente');
      }
    } catch (error) {
      // Maneja cualquier error durante la solicitud
      console.error('Error en la solicitud HTTP:', error.message);

      // Relanza el error para que pueda ser manejado en el código que llama a esta función
      throw error;
    }
  },

  getClients: async () => {
    try {
      // Realiza la solicitud HTTP para obtener la lista de clientes
      const response = await axios.get(`/api/clients/getClients`);

      // Verifica el estado de la respuesta
      if (response.status === 200) {
        // Devuelve los datos de los clientes
        return response.data;
      } else {
        // Lanza un error en caso de que el estado no sea 200
        throw new Error('Error al obtener la lista de clientes');
      }
    } catch (error) {
      // Maneja cualquier error durante la solicitud
      console.error('Error en la solicitud HTTP:', error.message);

      // Relanza el error para que pueda ser manejado en el código que llama a esta función
      throw error;
    }
  },

  updateClient: async (idc, clientData) => {
    try {
      // Realiza la solicitud HTTP utilizando axios
      const response = await axios.put(`/api/clients/updateClient/${idc}`, clientData);

      // Verifica el estado de la respuesta
      if (response.status === 200) {
        // Devuelve los datos del cliente actualizado
        return response.data;
      } else {
        // Lanza un error en caso de que el estado no sea 200
        throw new Error('Error al actualizar el cliente');
      }
    } catch (error) {
      // Maneja cualquier error durante la solicitud
      console.error('Error en la solicitud HTTP:', error.message);

      // Relanza el error para que pueda ser manejado en el código que llama a esta función
      throw error;
    }
  },
  deleteClient: async (idc) => {
    try {
      // Realiza la solicitud HTTP utilizando axios
      const response = await axios.delete(`/api/clients/deleteClient/${idc}`);

      // Verifica el estado de la respuesta
      if (response.status === 200) {
        // Devuelve un mensaje de éxito u otros datos que desees enviar
        return response.data;
      } else {
        // Lanza un error en caso de que el estado no sea 200
        throw new Error('Error al eliminar el cliente');
      }
    } catch (error) {
      // Maneja cualquier error durante la solicitud
      console.error('Error en la solicitud HTTP:', error.message);

      // Relanza el error para que pueda ser manejado en el código que llama a esta función
      throw error;
    }
  },

};

export default clientService;
