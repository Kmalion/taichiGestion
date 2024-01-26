'use client'
import React from 'react';
import Image from 'next/image';
import { Card } from 'primereact/card';

export default function BestProduct() {
  const header = (
    <Image
      alt="Card"
      src="https://diagnosticomedico.pe/wp-content/uploads/2022/05/ecografo_chison_sonoeye_P2_01.jpg"
      width={500} // Ajusta el ancho según sea necesario
      height={300} // Ajusta la altura según sea necesario
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

