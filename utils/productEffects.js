

export const fetchDataEffect = async (first, rows, fetchProducts, setProducts, setTotalRecords) => {
    try {
        // Obtener datos del servicio de productos
        const data = await fetchProducts(first, rows);

        if (data && data.products) {
            setProducts(data.products);
            setTotalRecords(data.totalRecords);
        } else {
            console.error('La respuesta del servicio de productos no tiene la estructura esperada:', data);
        }
    } catch (error) {
        console.error('Error al obtener productos:', error);
    }
};
