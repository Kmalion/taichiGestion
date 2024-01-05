import axios from 'axios';

export const getAllProducts = async () => {
  try {
    const response = await axios.get('/api/products/getProducts');
    return response.data;
  } catch (error) {
    console.error('Error al obtener todos los productos:', error);
    throw error;
  }
};

export const getProductByReference = async (reference) => {
  console.log('getProductByReference function called'); // Agregar este log

  try {
    const response = await axios.get(`/api/products/getProductByRef/${reference}`);
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error al obtener el producto por referencia:', error);
    throw error;
  }
};


export const updateProductQuantity = async (reference, newQuantity) => {
  try {
    await axios.put(`/api/products/updateProductQuantity/${reference}`, { quantity: newQuantity });
  } catch (error) {
    console.error('Error al actualizar la cantidad del producto:', error);
    throw error;
  }
};
