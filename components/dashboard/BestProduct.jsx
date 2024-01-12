'use client'
import React from 'react'; 
import { Card } from 'primereact/card';

export default function BestProduct() {
    const header = (
        <img alt="Card" src="https://primefaces.org/cdn/primereact/images/usercard.png" />
    );
  

    return (

            <Card title="¡ Producto más vendido !" subTitle="Sonoeye P2"  header={header} className="md:w-21rem">
                <p className="m-2">
                    Vendidos 45
                </p>
                <p className="m-2">
                    Lorem ipsum dolor sit amet consectetur adipisicing elit. Quod quasi commodi deleniti 
                </p>
            </Card>

    )
}
        