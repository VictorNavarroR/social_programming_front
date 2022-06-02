import React, { useState }  from 'react'
import './LogguedUserNav.scss'
import { NavLink } from 'react-router-dom'
import Login from '../Login/Login'

export default function LogguedUserNav() {
const [ShowLogin, setShowLogin] = useState(false)
const userData = JSON.parse(localStorage.getItem('userData'))
  if(!userData) return
  return (
    <nav>
    <NavLink to={"/"}> <i className="fa-solid fa-house"></i> </NavLink>
    <NavLink to={"/admin"} end> Dashboard </NavLink>
    {
      userData && userData.rol === 'Student' ? <NavLink to={"/admin/rutas-seguidas"} end> Rutas </NavLink> : ''
    }
    {
      userData && userData.rol === 'Admin' ? <NavLink to={"/admin/rutas"}> Rutas </NavLink> : ''
    }
    {
      userData && (userData.rol === 'Admin' || userData.rol === 'Collaborator') ? <NavLink to={"/admin/tutoriales"}> Tutoriales </NavLink> : ''
    }
    {
      userData && userData.rol === 'Admin' ? <NavLink to={"/admin/usuarios"}> Usuarios </NavLink> : ''
    }
    {
      userData && (userData.rol === 'Admin' || userData.rol === 'Collaborator') ? <NavLink to={"/admin/blog"}> Blog </NavLink> : ''
    }
    

    <img className="user-img" onClick={() => setShowLogin(!ShowLogin)} src={userData.image} alt={userData.name}/>
    {
      ShowLogin ? <Login /> : null
      }
</nav>  
  )
}
