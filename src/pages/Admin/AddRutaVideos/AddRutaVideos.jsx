import React, {useState} from 'react'
import { Formik } from "formik";
import { config } from '../../../config'
import { useParams, useSearchParams } from 'react-router-dom'
import Notification from '../../../components/Notification/Notification'
import axios from 'axios'
import './AddRutaVideos.scss'

export default function AddRutaVideos() {
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
  const { id } = useParams();
  const userData = JSON.parse(localStorage.getItem('userData'))
  const [searchParams, setSearchParams] = useSearchParams()

  return (
    <div className="rutasPage">
    <h2>Agregar Vídeos a la ruta {searchParams.get("ruta-name")}</h2>
    <Formik
        initialValues={{
            name: "",
            image: "",
            description: "",
            video_url:"",
            ruta:""
        }}
        onSubmit={(values, {resetForm}) => {
          
          const formData = new FormData();

          formData.append('name', values.name)
          formData.append('description', values.description)
          formData.append('image', values.image)
          formData.append('video_url', values.video_url)
          formData.append('ruta', id)

          const url = `${config.apiUrl}/ruta-videos`
          const headers = { 
            'Content-Type': 'form-data',
            'Authorization': `Bearer ${userData.token}`,
          };
          axios.post(url, formData, { headers })
              .then(response => {
                console.log(response)
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
                  message: 'El vídeo se ha agregado correctamente.',
                  type: 'success'
              })
              })
              .catch(error => console.log('Form submit error', error))
          resetForm()
        }}
        validate={ (values) => {

          let errors = {}

            if(!values.name) {
              errors.nombre = 'El campo nombre no puede estar vacío'
            } else if(!/^[a-zA-ZÀ-ÿ\s]{1,40}$/.test(values.name)) {
              errors.nombre = 'Este campo solo puede contener letras y espacios.'
            }
            if(!values.video_url) {
              errors.video_url = 'El campo Url Video no puede estar vacío'
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

            <label htmlFor="video_url">Url Vídeo:</label>
            <input
              id="video_url"
              name="video_url"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.video_url}
            />
            {errors.video_url && <div className="error">{errors.video_url}</div>}             
                     

            <button type="submit" className="primary-btn">Agregar vídeo a ruta</button>
          </form>
            )}
      </Formik>
      <Notification
                notify={notify}
                setNotify={setNotify}
            />
      </div>
  )
}
