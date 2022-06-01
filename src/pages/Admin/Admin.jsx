import React, {useState, useEffect} from 'react'
import './Admin.scss'
import Banner from '../../components/Banner/Banner'
import { traductor } from '../../traductor'
import { config } from '../../config'

export default function Admin() {

    const  [tutorialCount, setTutorialCount] = useState(0)
    const  [rutasCount, setRutasCount] = useState(0)
    const userData = JSON.parse(localStorage.getItem('userData'))

    useEffect( () => {
      const urlTutos = `${config.apiUrl}/tutoriales/user/count/${userData.id}`
      const urlRutas= `${config.apiUrl}/rutas/user/count/${userData.id}`
  
          fetch(urlTutos)
          .then(response => response.json())
          .then((responseData) => {
            if(responseData.error) {
              console.log('Ha habido un error')
      
            } else {
                setTutorialCount(responseData)
            }
                                     
            }
            
          ) 
          .catch(error => console.log('Error getting data: ', error))

          fetch(urlRutas)
          .then(response => response.json())
          .then((responseData) => {
            if(responseData.error) {
              console.log('Ha habido un error')
      
            } else {
                setRutasCount(responseData)
            }
                                     
            }
            
          ) 
          .catch(error => console.log('Error getting data: ', error))
    }, [])

  return (
    <div className="admin">

        <Banner 
            title={ userData.name } 
            subtitle={`Haz accedido como ${traductor[userData.rol]}` }
            content="Desde aquí podrás manejar los contenidos según tu perfil. eres parte de la mejor comunidad para el aprendizage gratuito y sin limites!"
            btnText="Publicar un post"
            showBtn={userData.rol !== 'Student' ? true : false}
            urlTo="/admin/blog"
            />
        
        <div className="admin__dashboard">
            <div className="admin__box-wrapper">
                <div className="admin__box admin__box--rutas">
                    <h3>Rutas Creadas</h3>
                    <div>{rutasCount}</div>
                </div>  
                <div className="admin__box admin__box--tutoriales">
                    <h3>Tutoriales Creados</h3>
                    <div>{tutorialCount}</div>
                </div> 
                <div className="admin__box admin__box--tips">
                    <h3>Posts Creados</h3>
                    <div>10</div>
                </div>
            </div>      
        </div>
    </div>
  )
}
