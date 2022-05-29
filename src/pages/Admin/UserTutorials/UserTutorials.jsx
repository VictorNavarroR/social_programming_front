import React, { useState } from 'react'
import './UserTutorials.scss'
import Tutorials from '../../../components/Tutorials/Tutorials'
import { Formik } from "formik";
import { config }  from "../../../config"
import Notification from '../../../components/Notification/Notification'
import { store, tutorialState } from '../../../Store/Store'
import axios from 'axios';

export default function UserTutorials() {

  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
  const userData = JSON.parse(localStorage.getItem('userData'))

  return (
    <div className="tutoriales">

      <h2>Agregar nuevo tutorial</h2>

      <Formik
        initialValues={{
            name: "",
            category: "",
            link: "",
            image: ""            
        }}
        onSubmit={(values, {resetForm}) => {
          
          const formData = new FormData();

          formData.append('name', values.name)
          formData.append('description', values.category)
          formData.append('link', values.link)
          formData.append('image', values.image)
          formData.append('uploaded_by', userData.id)

          const url = `${config.apiUrl}/tutoriales`

          const headers = { 
            'Content-Type': 'form-data',
            'Authorization': `Bearer ${userData.token}`,
          };
          axios.post(url, formData, { headers })
            .then(response => {

                setNotify({
                  isOpen: true,
                  title:'Exito!',
                  message: 'El tutorial ha sido agregado correctamente.',
                  type: 'success'
              })
              store.dispatch(tutorialState.actions.setTutorialState('true'))
              })
              .catch(error => {
                setNotify({
                    isOpen: true,
                    title:'Ups!',
                    message: 'Algo ha salido mal: ' + error,
                    type: 'error'
                 })
              })

          resetForm()
        }}
        validate={ (values) => {

          let errors = {}

            if(!values.name) {
              errors.nombre = 'El campo nombre no puede estar vacío'
            } 

            if(!values.image) {
              errors.image = 'Es obligatorio adjuntar un archivo en este campo.'
            }

            return errors
        }}
      > 
      {( {values, errors, handleSubmit, handleChange, setFieldValue, handleBlur}) => (
            <form onSubmit={handleSubmit} className="tutorialForm">

            <label htmlFor="name">Nombre:</label>
            <input
              id="name"
              name="name"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
            />
            {errors.nombre && <div className="error">{errors.nombre}</div>}

            <label htmlFor="category">Categoría:</label>
            <input
              id="category"
              name="category"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.category}
            />

            <label htmlFor="link">Link a vídeo:</label>
            <input
              id="link"
              name="link"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.link}
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

            <button type="submit" className="primary-btn">Guardar Tutorial</button>
          </form>
            )}
      </Formik>

      <h2>Tutoriales agregados por <span>{userData.name}</span></h2>
      <Tutorials showTitle={false} byUser={true} />
      <Notification
                notify={notify}
                setNotify={setNotify}
            />
    </div>
  )
}
