import React, { useEffect } from 'react'
import { useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import VideosRutas from '../../../components/VideosRuta/VideosRuta'
import { getRutas } from '../../../Store/Store'
import './PathDetail.scss'

export default function PathDetail() {

  useEffect( () => {
    console.log('entra')
      getRutas()
  }, [])

  const rutas = useSelector( state => state.rutas)

  const { id } = useParams();
  if(rutas.length !== 0) {
    const rutaDetail = rutas.filter( ruta => ruta._id === id)
    const { _id, name, image, description } = rutaDetail[0]
  
  
    return (
      <div className="pathDetail">
        <div className="routeBanner">
          <h1>{name}</h1>
          <img src={image} alt={name}/>
        </div>

        <div className="routeContent">
          <p>{description}</p>
        </div>
        <div className="ruta-videos">
        <VideosRutas rutaId={_id} name={name} />
      </div>
      </div>
    )
  }
}
