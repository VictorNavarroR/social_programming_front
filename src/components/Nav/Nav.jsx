import React, { useState, useEffect }  from 'react'
import { useSearchParams } from 'react-router-dom'
import { NavLink } from 'react-router-dom'
import Notification from '../../components/Notification/Notification'
import './Nav.scss'
import Login from '../Login/Login'

export default function Nav() {
  const [searchParams, setSearchParams] = useSearchParams()
  const [ShowLogin, setShowLogin] = useState(false)
  const userData = JSON.parse(localStorage.getItem('userData'))
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

  useEffect( () => {
    if(searchParams.get("newuser") === 'true') {
      setShowLogin(true)
      setNotify({
        isOpen: true,
        title:'Exito!',
        message: 'Has sido registrado correctamente, ya puedes acceder con tus datos desde nuestro formulario de login.',
        type: 'success'
    })
    return
  }
  },[])

  return (
    <>
      <nav>
          <NavLink to={"/"}> Home </NavLink>
          <NavLink to={"/about"}> Quienes Somos </NavLink>
          <NavLink to={"/rutas"}> Rutas </NavLink>
          <NavLink to={"/tutoriales"}> Tutoriales </NavLink>
          <NavLink to={"/blog"}> Blog </NavLink>
          {
            userData 
            ?
            <img className="user-img" onClick={() => setShowLogin(!ShowLogin)} src={userData.image} alt={userData.name}/>
          :
            <button onClick={() => setShowLogin(!ShowLogin)} className="login"><i className="fas fa-user"></i></button>
          }
        {
        ShowLogin ? <Login /> : null
        }
      </nav> 
      <Notification
                notify={notify}
                setNotify={setNotify}
            />
    </>
  )
}
