import React, {useState, useEffect} from 'react'
import {  useSearchParams } from 'react-router-dom'
import { Formik } from "formik"
import { config }  from "../../../../config"
import ConfirmDialog from '../../../../components/ConfirmDialog/ConfirmDialog'
import Notification from '../../../../components/Notification/Notification'
import { useNavigate, useParams } from 'react-router-dom'
import Loader from '../../../../components/Loader/Loader';
import axios from 'axios'
import './EditUserRutas.scss'

export default function EditUserRutas() {
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [searchParams, setSearchParams] = useSearchParams()
    const navigate = useNavigate()
    const userData = JSON.parse(localStorage.getItem('userData'))
    const [ruta, setRuta] = useState({})
    const { id } = useParams();
    const [loader, setLoader] = useState(false)

    useEffect( () => {
        const url = `${config.apiUrl}/rutas/${id}`

        axios.get(url)
            .then((response) => {
              if(response.error) {
                console.log('Ha habido un error')    
              } else {
                setRuta(response.data)
              }
                                       
              }
              
            ) 
    }, [])

  return (
    <div>
        <h2>Editar ruta {searchParams.get("ruta-name")}</h2>
        <Formik enableReinitialize={true}
        initialValues={{
            name: ruta?.name,
            image: ruta?.image,
            description: ruta?.description
        }}
        onSubmit={(values) => {
          setLoader(true)
          const formData = new FormData()

          formData.append('name', values.name)
          formData.append('description', values.description)
          formData.append('image', values.image)

          const url = `${config.apiUrl}/rutas/${ruta._id}`
          const headers = {
                'Content-Type': 'form-data',
                'Authorization': `Bearer ${userData.token}`,
              }

          axios.put(url, formData, { headers })
          .then(response => {
                if(response.ok === false) {
                      setNotify({
                      isOpen: true,
                      title:'Ups!',
                      message: 'Ha habido un error inesperado.',
                      type: 'error'
                  })
                  setLoader(true)
                  return
                }
                setNotify({
                  isOpen: true,
                  title:'Exito!',
                  message: 'La ruta ha sido actualizada correctamente.',
                  type: 'success'
              })
              setTimeout(() => {
                 navigate('/admin/rutas')
              }, 2000)

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
            <div className="ruta-img-wrap">
                <div className="ruta-img">
                    <img src={ruta?.image} alt={ruta?.name}/>
                </div>
                <div className="ruta-input">
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
            </div>        
            </div>
            <button type="submit" className="primary-btn">Guardar cambios</button>
          </form>
            )}
      </Formik>

      <ConfirmDialog
          confirmDialog={confirmDialog}
          setConfirmDialog={setConfirmDialog}
        />
      <Notification
                notify={notify}
                setNotify={setNotify}
            />
      {
        
        loader ? <Loader /> : ''
        
      } 
    </div>
  )
}
