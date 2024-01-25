'use client'
import React from 'react';
import { Card } from 'primereact/card';

export default function BestProduct() {
  const header = (
    <img
      alt="Card"
      src="https://diagnosticomedico.pe/wp-content/uploads/2022/05/ecografo_chison_sonoeye_P2_01.jpg"
    />
  );

  return (
    <div className="flex flex-column flex-row">
      {/* El Card flexible que ocupará el espacio del otro Card */}
      <Card
        title="¡ Producto más vendido !"
        subTitle="Sonoeye P2"
        header={header}
        className="md:w-21rem mr-2"
        style={{ flex: 1 }}
      >
        <p className="m-2">Vendidos 45</p>
    
      </Card>

    </div>
  );
}
