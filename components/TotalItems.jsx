import React from 'react'; 
import { Card } from 'primereact/card';


export default function TotalItems() {


    return (
        <div className="card flex justify-content-center">
            <Card title="Total productos" subTitle="Resumen"  >
                <h1 className="m-5">
                    58236
                </h1>
            </Card>
        </div>
    )
}