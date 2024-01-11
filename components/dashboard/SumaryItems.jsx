import React, { useState, useEffect } from "react";
import { getAllProducts } from "../../service/productService"; // Asegúrate de tener la ruta correcta
import { EntryService } from "../../service/entryService"; // Asegúrate de tener la ruta correcta

const SummaryItems = () => {
  const [inventoryCost, setInventoryCost] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);

  const calculateInventoryCost = async () => {
    try {
      const allProducts = await getAllProducts();
      const entries = await EntryService.getEntries(); // Llama a la función getEntries

      let totalCost = 0;
      let quantitySum = 0;

      // Iterar sobre cada producto y sumar su costo y cantidad
      for (const product of allProducts) {
        // Asegúrate de que el producto tenga cantidad y costo definidos antes de calcular su costo total
        if (product && product.quantity && product.cost) {
          const productCost = product.quantity * product.cost;
          totalCost += productCost;
          quantitySum += product.quantity;
        }
      }

      setInventoryCost(totalCost);
      setTotalQuantity(quantitySum);
      setTotalEntries(entries.length);
    } catch (error) {
      console.error("Error al calcular el resumen:", error);
    }
  };

  useEffect(() => {
    calculateInventoryCost();
  }, []);

  return (
    <div className="grid">
      <div className="col-12 md:col-6 lg:col-3">
        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">
                Costo Inventario
              </span>
              <div className="text-900 font-medium text-xl">
                {inventoryCost.toLocaleString("en-US", {
                  style: "currency",
                  currency: "USD",
                })}
              </div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-blue-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-money-bill text-blue-500 text-xl"></i>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 md:col-6 lg:col-3">
        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">
                Cantidad de Unidades
              </span>
              <div className="text-900 font-medium text-xl">
                {totalQuantity}
              </div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-orange-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-shopping-cart text-orange-500 text-xl"></i>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 md:col-6 lg:col-3">
        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Entradas</span>
              <div className="text-900 font-medium text-xl">{totalEntries}</div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-cyan-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-arrow-right text-cyan-500 text-xl"></i>
            </div>
          </div>
        </div>
      </div>
      <div className="col-12 md:col-6 lg:col-3">
        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">Salidas</span>
              <div className="text-900 font-medium text-xl">152</div>
            </div>
            <div
              className="flex align-items-center justify-content-center bg-purple-100 border-round"
              style={{ width: "2.5rem", height: "2.5rem" }}
            >
              <i className="pi pi-arrow-left text-purple-500 text-xl"></i>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SummaryItems;
