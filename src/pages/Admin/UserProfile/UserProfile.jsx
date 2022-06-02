import React, {useState, useEffect} from 'react'
import { Formik } from "formik"
import { config }  from "../../../config"
import axios from 'axios'
import { useNavigate } from 'react-router-dom'
import { useDispatch } from 'react-redux'
import Notification from '../../../components/Notification/Notification'
import ConfirmDialog from '../../../components/ConfirmDialog/ConfirmDialog'
import { userReducer } from '../../../Store/Store'
import './UserProfile.scss'

export default function UserProfile() {
  const userData = JSON.parse(localStorage.getItem('userData'))
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
  const [user, setUser] = useState({})
  const dispatchUser = useDispatch()
  const navigate = useNavigate()

  useEffect( () => {

    const url = `${config.apiUrl}/users/${userData.id}`

   axios.get(url)
       .then((response) => {
         if(response.error) {
           console.log('Ha habido un error')    
         } else {
          setUser(response.data)
         }
                                  
         }
         
       ) 
       .catch(error => {
        if(error.response.data.message === 'TokenExpiredError') {
          setConfirmDialog({
            isOpen: true,
            noCancel:true,
            title: 'Su sesión ha caducado?',
            subTitle: "Será redireccionado a la pagina de login para que  inserte sus credenciales.",
            onConfirm: () => { navigate('/logout') }
        })
        }
       }
        )

  }, [notify])

  return (
    <div>
      <h2>Perfil de <span style={{color:'black'}}>{userData.name}</span></h2>
      <div className="perfil">
        <div className="perfil__sidebar">
            <div className="perfil__userimg">
              <img src={userData.image} alt={userData.name} />
            </div>
        </div>
        <div className="perfil__form">
          <Formik
          enableReinitialize={true}
          initialValues={{
              name: user?.name,
              lastname: user?.lastName,
              email: user?.email,
          }}
          onSubmit={(values, {resetForm}) => {
            
            const formData = new FormData();

            formData.append('name', values.name)
            formData.append('lastName', values.lastname)
            formData.append('email', values.email)
            formData.append('password', values.password)
            formData.append('image', values.image)

            const url = `${config.apiUrl}/users/${userData.id}`
            const headers = {
                  'Content-Type': 'form-data',
                  'Authorization': `Bearer ${userData.token}`,
                }

            axios.put(url, formData, {headers})
            .then(response => {
                  console.log(response.data)
                  const userData = {
                    id: response.data._id, 
                    name: response.data.name, 
                    image: response.data.image,
                    rol: response.data.user_rol.map( rol => rol.name).join(''),
                    user_paths: response.data._user_paths,
                    token: response.data.token,
                    watching: response.data.watching
                  }
            
                 localStorage.setItem('userData', JSON.stringify(userData)) 

                  dispatchUser(userReducer.actions.setLogguedUser({
                    id: response.data._id, 
                    name: response.data.name, 
                    image: response.data.image,
                    rol: response.data.user_rol.map( rol => rol.name).join(''),
                    user_paths: response.data._user_paths,
                    token: response.data.token,
                    watching: response.data.watching
                  }))

                  if(response.ok === false) {
                        setNotify({
                        isOpen: true,
                        title:'Ups!',
                        message: 'Ha habido un error inesperado.',
                        type: 'error'
                    })
                    return
                  }

                  setNotify({
                    isOpen: true,
                    title:'Exito!',
                    message: 'Usuario editado correctamente.',
                    type: 'success'
                  })
                })
                .catch(error => {
                  if(error.response.data.message === 'TokenExpiredError') {
                    setConfirmDialog({
                      isOpen: true,
                      noCancel:true,
                      title: 'Su sesión ha caducado?',
                      subTitle: "Será redireccionado a la pagina de login para que  inserte sus credenciales.",
                      onConfirm: () => { navigate('/logout') }
                  })
                  }
                })
            resetForm()
          }}
          validate={ (values) => {

            let errors = {}

              if(!values.name) {
                errors.nombre = 'El campo nombre no puede estar vacío'
              } 

              if(!values.email) {
                errors.email = 'El campo nombre no puede estar vacío'
              } 
            
              if(values.passwordRepeat !== values.password) {
                errors.passwordRepeat = 'Las contraseñas no coinciden'
              } 

              const passwordRegex = /(?=.*[0-9])/
              if(values.password && values.password.length < 8) {
                errors.password = 'La contraseña debe tener al menos 8 caracteres'
              } 
              if(values.password && !passwordRegex.test(values.password)) {
                errors.password = "*Contraseña no segura, debe contener al menos un número.";
              }

              return errors
          }}
        > 
        {( {values, errors, handleSubmit, handleChange, setFieldValue, handleBlur}) => (
              <form onSubmit={handleSubmit} className="rutaForm">
              <label htmlFor="name">Nombre(*):</label>
              <input
                id="name"
                name="name"
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.name}
              />
              {errors.nombre && <div className="error">{errors.nombre}</div>}

              <label htmlFor="lastname">Apellidos:</label>
              <input
                id="lastname"
                name="lastname"
                type="text"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.lastname}
              />

              <label htmlFor="email">Email:</label>
              <input
                id="email"
                name="email"
                type="email"
                disabled
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.email}
              />
              {errors.email && <div className="error">{errors.email}</div>}

              <label htmlFor="image">Foto de perfil(*):</label>
              <input
                id="image"
                name="image"
                type="file"
                accept='image/*'
                onChange={(event) => {
                  setFieldValue("image", event.currentTarget.files[0]);
                }} 
                onBlur={handleBlur}

              />     

              <label htmlFor="password">Cambiar Contraseña:</label>
              <input
                id="password"
                name="password"
                type="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.password}
              />   
              {errors.password && <div className="error">{errors.password}</div>}  

              <label htmlFor="passwordRepeat">Repetir Contraseña:</label>
              <input
                id="passwordRepeat"
                name="passwordRepeat"
                type="password"
                onChange={handleChange}
                onBlur={handleBlur}
                value={values.passwordRepeat}
                
              />   
              {errors.passwordRepeat && <div className="error">{errors.passwordRepeat}</div>}   

              <button type="submit" className="primary-btn">Guardar cambios</button>
            </form>
              )}
        </Formik>
        </div>
      </div>
      <ConfirmDialog
            confirmDialog={confirmDialog}
            setConfirmDialog={setConfirmDialog}
        /> 
      <Notification
                notify={notify}
                setNotify={setNotify}
            />
    </div>
  )
}
