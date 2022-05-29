import React, { useEffect } from 'react'
import PageContent from '../../components/PageContent/PageContent'
import RutasGrid from '../../components/RutasGrid/RutasGrid'
import { getRutas } from '../../Store/Store'
import { useSelector } from 'react-redux'

export default function Paths() {

  const rutas = useSelector( state => state.rutas)


  useEffect( () => {

    if(rutas.length === 0) {
      getRutas()
    }

 }, [])


  return (
    <>
      <PageContent title="Rutas" content="
      <p>
            Lorem Ipsum is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry's standard 
            dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. 
        </p>
        <p>
            It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. 
        </p>" />

      <RutasGrid rutas={rutas} />       
    </>
  )
}
