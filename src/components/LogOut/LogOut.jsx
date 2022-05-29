import React, { useEffect } from 'react'
import { config } from '../../config'
import { useNavigate } from 'react-router-dom'

export default function LogOut() {

    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('userData'));
    const user = {
        user: userData.id
    }

    const url = `${config.apiUrl}/users/logout`
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user)
    };

    useEffect( () => {
        fetch(url, requestOptions)
        .then(response => response.json())
        .then((responseData) => {
          if(responseData.error) {
           
            console.log('No se ha realizado el logout')
    
          } else {
            localStorage.removeItem('userData');  
          }
                                   
            navigate('/');
          }
          
        ) 
        .catch(error => console.log('Form submit error', error))
    })


  return (
    <div>LogOut</div>
  )
}
