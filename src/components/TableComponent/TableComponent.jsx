import React from 'react'
import {MaterialTable} from 'material-table'




export const TableComponent = () => {
  
    const data=[
        {
            nombre: 'Camilo', edad: 38
        },
        {
            nombre: 'Fabio', edad: 50
        }
    ]
    return (
    <div>
    <MaterialTable title='Inventario'
    data={data}
    />
   
    </div>
  )
}
