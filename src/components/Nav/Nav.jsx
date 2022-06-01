import React, { useState }  from 'react'
import { NavLink } from 'react-router-dom'
import './Nav.scss'
import Login from '../Login/Login'

export default function Nav() {

  const [ShowLogin, setShowLogin] = useState(false)
  const userData = JSON.parse(localStorage.getItem('userData'))
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
    </>
  )
}
