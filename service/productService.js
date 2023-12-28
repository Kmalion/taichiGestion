
import axios from 'axios';

export const getProductByReference = async (reference) => {
  try {
    const response = await axios.get(`/api/products/getProductByRef/${reference}`);
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
