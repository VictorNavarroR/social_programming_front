import React, { useState, useEffect } from 'react'
import './UserRutas.scss'
import RutasGrid from '../../../components/RutasGrid/RutasGrid'
import { Formik } from "formik";
import { config }  from "../../../config"
import Notification from '../../../components/Notification/Notification'
import { useDispatch } from 'react-redux'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ConfirmDialog from '../../../components/ConfirmDialog/ConfirmDialog'
import { rutasReducer } from '../../../Store/Store'
import axios from 'axios'

export default function UserRutas() {
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
  const  [rutas, setRutas] = useState([])
  const stateRutas = useSelector( state => state.rutas)
  const navigate = useNavigate();

  const dispatchRutas = useDispatch()
  const userData = JSON.parse(localStorage.getItem('userData'))

  useEffect( () => {
    if(stateRutas && stateRutas.length > 0) {
      setRutas(stateRutas)
    } else {
   const url = `${config.apiUrl}/rutas`

   axios.get(url)
       .then((response) => {
         console.log(response)
         if(response.error) {
           console.log('Ha habido un error')    
         } else {
           setRutas(response.data)
           dispatchRutas(rutasReducer.actions.setRutasObj(response.data))
         }
                                  
         }
         
       ) 
       .catch(error => {
        console.log(error)
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
     }

 }, [dispatchRutas, navigate, stateRutas, rutas])
  
   return (
    <div className="rutasPage">
      <h2>Agregar nueva ruta</h2>
      <Formik
        initialValues={{
            name: "",
            image: "",
            description: ""
        }}
        onSubmit={(values, {resetForm}) => {
          
          const formData = new FormData();

          formData.append('name', values.name)
          formData.append('description', values.description)
          formData.append('image', values.image)

          const url = `${config.apiUrl}/rutas`
          const headers = {
                "Content-Type": "form-data",
                'Authorization': `Bearer ${userData.token}`,
              }

          axios.post(url, formData, {headers})
          .then(response => {
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
                  message: 'La ruta ha sido creada correctamente.',
                  type: 'success'
              })

              dispatchRutas(rutasReducer.actions.setRutasObj(response.data))
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
            } else if(!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(values.name)) {
              errors.nombre = 'Este campo solo puede contener letras y espacios.'
            }

            if(!values.image) {
              errors.image = 'Es obligatorio adjuntar un archivo en este campo.'
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

            <label htmlFor="description">Descripción:</label>
            <input
              id="description"
              name="description"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.description}
            />

            <label htmlFor="image">Imagen(*):</label>
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
            {errors.image && <div className="error">{errors.image}</div>}          

            <button type="submit" className="primary-btn">Guardar Ruta</button>
          </form>
            )}
      </Formik>
      <h2>Rutas agregados por <span>{userData.name}</span></h2>
      <RutasGrid rutas={rutas} showTitle={false} isAdmin={true} />
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
