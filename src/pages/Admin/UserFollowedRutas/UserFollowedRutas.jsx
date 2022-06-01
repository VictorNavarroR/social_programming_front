import React, {useState, useEffect} from 'react'
import RutasGrid from '../../../components/RutasGrid/RutasGrid'
import { config }  from "../../../config"
import axios from 'axios'
import './UserFollowedRutas.scss'

export default function UserFollowedRutas() {
  const  [rutas, setRutas] = useState([])
  const userData = JSON.parse(localStorage.getItem('userData'))
  
  useEffect( () => {

   const url = `${config.apiUrl}/rutas`

   axios.get(url)
       .then((response) => {
         if(response.error) {
           console.log('Ha habido un error')    
         } else {
           setRutas(response.data)
         }
                                  
         }
         
       ) 


 }, [])


  return (
    <div>
        <h2>Mis rutas seguidas</h2>
        <RutasGrid rutas={rutas} />
    </div>
  )
}
