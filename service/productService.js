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
    console.log("Referencia a actualizar servicio: ", reference)
    console.log("Nueva cantidad servicio: ", newQuantity)
    await axios.put(`/api/products/updateProductQuantity/${reference}`, { quantity: newQuantity });
  } catch (error) {
    console.error('Error al actualizar la cantidad del producto:', error);
    throw error;
  }
};

export const deleteSerialFromProduct = async (reference, serialToDelete, loteToDelete, ubicacionToDelete) => {
  try {
    console.log("Referencia a eliminar SERVICIO", reference);
    console.log("Serial desde el servicio: ", serialToDelete);
    console.log("Lote desde el servicio: ", loteToDelete);
    console.log("Ubicación desde el servicio: ", ubicacionToDelete);

    // Configura axios para enviar datos como JSON
    axios.defaults.headers['Content-Type'] = 'application/json';

    // Envia la solicitud DELETE con los datos en el cuerpo
    const response = await axios.delete(`/api/products/deleteSerialFromProduct/${reference}`, {
      data: {
        serials: serialToDelete,
        lote: loteToDelete,
        ubicacion: ubicacionToDelete,
      },
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error('Error al eliminar el serial, lote y ubicación del producto:', error);
    throw error;
  }
};

