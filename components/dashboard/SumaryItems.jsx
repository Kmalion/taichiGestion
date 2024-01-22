'use client'
import React, { useState, useEffect } from "react";
import { Skeleton } from "primereact/skeleton";
import { getAllProducts } from "../../service/productService";
import { EntryService } from "../../service/entryService";

const SummaryItems = () => {
  const [inventoryCost, setInventoryCost] = useState(0);
  const [totalQuantity, setTotalQuantity] = useState(0);
  const [totalEntries, setTotalEntries] = useState(0);
  const [loading, setLoading] = useState(true);

  const calculateInventoryCost = async () => {
    try {
      const allProducts = await getAllProducts();
      const entries = await EntryService.getEntries();

      let totalCost = null;
      let quantitySum = null;

      for (const product of allProducts) {
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
    } finally {
      setLoading(false); // Marca que la carga ha finalizado, ya sea con éxito o error
    }
  };

  useEffect(() => {
    calculateInventoryCost();
  }, []);
  const renderSkeleton = () => (
    <div className="grid">
      {[1, 2, 3, 4].map((key) => (
        <div key={key} className="col-12 md:col-6 lg:col-3">
          <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
            <Skeleton className="mb-2"></Skeleton>
            <Skeleton width="10rem" className="mb-2"></Skeleton>
            <Skeleton height="3rem" className="mb-2"></Skeleton>
            <Skeleton width="80%" height="2rem" className="mb-2"></Skeleton>
            <Skeleton width="10rem" height="4rem"></Skeleton>
          </div>
        </div>
      ))}
    </div>
  );

  const renderSummaryItems = () => (
    <div className="grid">
      <div className="col-12 md:col-6 lg:col-3">
        <div className="surface-0 shadow-2 p-3 border-1 border-50 border-round">
          <div className="flex justify-content-between mb-3">
            <div>
              <span className="block text-500 font-medium mb-3">
                Costo Inventario
              </span>
              {inventoryCost !== null && inventoryCost !== undefined && inventoryCost !== 0 ? (
                <div className="text-900 font-medium text-xl">
                  {inventoryCost.toLocaleString("en-US", {
                    style: "currency",
                    currency: "USD",
                  })}
                </div>
              ) : (
                <Skeleton width="100px" />
              )}
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
              {totalQuantity !== null && totalQuantity !== undefined && totalQuantity !== 0 ? (
                <div className="text-900 font-medium text-xl">
                  {totalQuantity}
                </div>
              ) : (
                <Skeleton width="80%" height="1.5rem" />
              )}
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
              {totalEntries !== null && totalEntries !== undefined && totalEntries !== 0 ? (
                <div className="text-900 font-medium text-xl">
                  {totalEntries}
                </div>
              ) : (
                <Skeleton width="80%" height="1.5rem" />
              )}
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
              {/* {totalExits !== null && totalExits !== undefined && totalExits !== 0 ? (
                <div className="text-900 font-medium text-xl">
                  {totalExits}
                </div>
              ) : (
                <Skeleton width="80%" height="1.5rem" />
              )} */}
              <div className="text-900 font-medium text-xl">
                  0
                </div>
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
  
  return (
    <div className="p-d-flex p-jc-center p-ai-center" style={{ minHeight: '100vh' }}>
    <div className="p-grid">
      <div>
        {loading ? renderSkeleton() : renderSummaryItems()}
      </div>
    </div>
  </div>
  
  
  );
};

export default SummaryItems;
