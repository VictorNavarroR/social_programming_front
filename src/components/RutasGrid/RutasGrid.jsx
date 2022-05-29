import React from 'react'
import Ruta from './Ruta/Ruta'

import './RutasGrid.scss'


export default function RutasGrid({ showTitle, limit, byUser, rutas, isAdmin }) {


  return (
    <section className="rutas">
            <h2 className={`${showTitle ? "show" : ""}`}>Rutas más seguidas</h2>
            <div className="rutas-wrap">
              {
                rutas.map( ruta => {
                    return <Ruta key={ruta._id} rutaId={ruta._id} title={ruta.name} imgSrc={ruta.image} linkTo={`/ruta/${ruta._id}`} isAdmin={isAdmin} />
                  })
               
              }
          </div>
    </section>
  )
}