import React, { useState } from 'react'
import './Login.scss'
import { useForm } from "react-hook-form"
import { config } from '../../config'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import { userReducer } from '../../Store/Store'
import Notification from '../../components/Notification/Notification'
import ConfirmDialog from '../ConfirmDialog/ConfirmDialog'

export default function Login() {

  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
  const dispatchUser = useDispatch()
  const navigate = useNavigate();

  const handleLogOut =  () => {
      setConfirmDialog({
        isOpen: true,
        title: 'Seguro que desea cerrar sesión?',
        subTitle: "",
        onConfirm: () => { navigate('/logout') }
    })
      
  }

  
  const { register, handleSubmit } = useForm()
  const onSubmit = ( data ) => {

    const url = `${config.apiUrl}/users/login`
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    };

    fetch(url, requestOptions)
        .then(response => response.json())
        .then((responseData) => {
          if(responseData.error) {
            setNotify({
              isOpen: true,
              title:'Ups!',
              message: 'El usuario o contraseña introducidos no existen.',
              type: 'error'
          })
          } else {
            const { name, rol, token, image, id, user_paths, watching } = responseData
            dispatchUser(userReducer.actions.setLogguedUser({
              id, 
              name, 
              image,
              rol: rol[0].name,
              user_paths,
              token,
              watching
            }))
            const userData = {
              id,
              name,
              rol: rol[0].name,
              user_paths,
              token,
              image,
              watching
            }
            
              localStorage.setItem('userData', JSON.stringify(userData));            

            navigate('/admin');
          }
        }) 
        .catch(error => console.log('Form submit error', error))

  };
  const onError = (errors, e) => console.log(errors, e);
  const userData = JSON.parse(localStorage.getItem('userData'))
 
  if(userData) {
     return (
       <>
       <div className="login-area">
         <div className="loggued">
          <h3>Hola</h3>
          <h4 className="logged-title">{userData.name}</h4>
          <ul className="logged-ul">
           <li>
             <a onClick={() => navigate('/admin') }>Dashboard <i className="fa-solid fa-chevron-right"></i></a>
           </li>
           <li>
             <a onClick={() => navigate('/admin/perfil')}>Mi perfil <i className="fa-solid fa-chevron-right"></i></a>
           </li>
           <li>
             <a onClick={ handleLogOut }>Cerrar sesión <i className="fa-solid fa-right-from-bracket"></i></a>
           </li>
         </ul>
         </div>

        </div>
        <ConfirmDialog
            confirmDialog={confirmDialog}
            setConfirmDialog={setConfirmDialog}
        /> 
       </>
     )
  }
  return (
    <>
      <div className="login-area">
          <form action="" className="login-form" onSubmit={ handleSubmit(onSubmit, onError) }>
              <input type="text" placeholder="Email:" name="email" {...register("email")} required />
              <input type="password" placeholder="Contraseña:" name="password" {...register("password")} required />
              <button type="submit" className="primary-btn">Login <i className="fas fa-sign-in-alt"></i></button>
          </form>
          <div className="register-area">
            No tienes usuario? <a href="/registro" >registrate.</a>
          </div>
      </div>
      <Notification
                notify={notify}
                setNotify={setNotify}
            />
     
    </>
  )
}
