import axios from "axios";

const userService = {
  createUser: async (userData) => {
    try {
      const response = await axios.post(`/api/users/createUser`, userData);

      if (response.status === 201) {
        return response.data;
      } else {
        throw new Error('Error al crear el usuario');
      }
    } catch (error) {
      console.error('Error en la solicitud HTTP:', error.message);
      throw error;
    }
  },

  getUsers: async () => {
    try {
      const response = await axios.get(`/api/users/getUsers`);

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Error al obtener la lista de usuarios');
      }
    } catch (error) {
      console.error('Error en la solicitud HTTP:', error.message);
      throw error;
    }
  },

  updateUser: async (userId, userData) => {
    try {
      const response = await axios.put(`/api/users/updateUser/${userId}`, userData);

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Error al actualizar el usuario');
      }
    } catch (error) {
      console.error('Error en la solicitud HTTP:', error.message);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await axios.delete(`/api/users/deleteUser/${userId}`);

      if (response.status === 200) {
        return response.data;
      } else {
        throw new Error('Error al eliminar el usuario');
      }
    } catch (error) {
      console.error('Error en la solicitud HTTP:', error.message);
      throw error;
    }
  },

  searchUsers: async (query) => {
    try {
      const url = new URL('/api/users/searchUsers', window.location.origin);
      url.searchParams.set('q', query);
  
      const response = await axios.get(url.toString(), {
        headers: {
          'Cache-Control': 'no-cache', // Para evitar el almacenamiento en caché del navegador
        },
      });
  
      if (response.status === 200) {
        const users = response.data;
        return users;
      } else {
        console.error('Error al obtener usuarios:', response.statusText);
        throw new Error('Error al obtener usuarios');
      }
    } catch (error) {
      console.error('Error al buscar usuarios:', error);
      throw error;
    }
  }
};

export default userService;
