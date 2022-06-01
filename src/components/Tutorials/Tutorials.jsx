import React, {useEffect, useState} from 'react'
import './Tutorials.scss'
import { config } from './../../config'
import Tutorial from './Tutorial/Tutorial'
import { useLocation } from "react-router-dom"
import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';
import { store, tutorialState } from '../../Store/Store'
import { useSelector } from 'react-redux'
import axios from 'axios'

export default function Tutorials({ showTitle, limit, byUser }) {

    const [error, setError] = useState(null)
    const [isLoaded, setIsLoaded] = useState(false)
    let [tutoriales, setTutoriales] = useState([])
    const stateTutoriales = useSelector( state => state.tutorial)

    const location = useLocation()

    const userData = JSON.parse(localStorage.getItem('userData'))

    useEffect(() => {

        let userEndPoint = '';

        if(userData && userData.rol === "Admin") {
          userEndPoint = `${config.apiUrl}/tutoriales`
        } else {
          userEndPoint = byUser ? `${config.apiUrl}/tutoriales/user/${userData.id}` : `${config.apiUrl}/tutoriales${ limit ? '/limit/'+limit : ''}`
        }
         
  
        axios.get(userEndPoint)
          .then(
            (response) => {
              setIsLoaded(true)
              setTutoriales(response.data)
              store.dispatch(tutorialState.actions.setTutorialState('false'))
            },
            (error) => {
              setIsLoaded(true)
              setError(error)
            }
          )
      }, [byUser, stateTutoriales])
      
      if(!location.pathname.includes('/admin')) {
        tutoriales = tutoriales.filter( tutorial => tutorial.isApproved)
      }
      
    return (
        <section className="tutoriales">
            { showTitle ? <h2>Tutoriales recientes</h2> : ''}
            <div className="tutoriales-wrap">
                {
                    isLoaded ?
                    tutoriales.map( tutorial => {
                    return   <Tutorial
                            key={tutorial._id}
                            id={tutorial._id}
                            tutorialTitle={tutorial.name}
                            tutorialBtnTxt='Ver Tutorial'
                            linkTo={tutorial.link}
                            image={tutorial.image}
                            approved={tutorial.isApproved}
                        />

                    })
                    :
                    <Box sx={{ display: 'flex', justifyContent:'center'}}>
                      <CircularProgress />
                    </Box>
                }  
            </div>  
        </section>
    )  
}
