import React, {useState, useEffect} from 'react'
import { Formik } from "formik";
import { config }  from "../../../../config"
import axios from 'axios'
import { useParams } from 'react-router-dom'
import { store, tutorialState } from '../../../../Store/Store'
import Notification from '../../../../components/Notification/Notification'
import { useNavigate } from "react-router-dom";
import './EditUserTutorials.scss'

export default function EditUserTutorials() {

  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
  const userData = JSON.parse(localStorage.getItem('userData'))
  const [tutorial, setTutorial] = useState({})
  const [update, setUpdate] = useState(false)
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect( () => {
    const url = `${config.apiUrl}/tutoriales/${id}`
   
    axios.get(url)
        .then((response) => {
          if(response.error) {
            console.log('Ha habido un error')    
          } else {
            setTutorial(response.data)
          }
                                   
          }
          
        )  
        .catch(error => console.log('Error getting routes: ', error))
  }, [id, update])

  return (
    <div className="tutoriales">

    <h2>Editar tutorial</h2>

    <Formik
     enableReinitialize={true}
      initialValues={{
          name: tutorial?.name,
          category: tutorial.category && tutorial?.category[0] ? tutorial?.category[0] : '',
          link: tutorial?.link,
          image: ""            
      }}
      onSubmit={(values, {resetForm}) => {
        
        const formData = new FormData();

        formData.append('name', values.name)
        formData.append('category', values.category)
        formData.append('link', values.link)
        formData.append('image', values.image)
        formData.append('uploaded_by', userData.id)
        formData.append('isApproved', false)

        const url = `${config.apiUrl}/tutoriales/${tutorial?._id}`

        const headers = { 
          'Content-Type': 'form-data',
          'Authorization': `Bearer ${userData.token}`,
        };
        axios.put(url, formData, { headers })
          .then(response => {

              setNotify({
                isOpen: true,
                title:'Exito!',
                message: 'El tutorial ha sido editado correctamente.',
                type: 'success'
            })
            store.dispatch(tutorialState.actions.setTutorialState('true'))
            setUpdate(true)
            setTimeout(() => {
              navigate('/admin/tutoriales')
            }, 1000)
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

        <div className="tutorial-img-wrapper">
          <div className="tutorial-img">
            <img src={tutorial?.image} alt={tutorial?.name} />
          </div>
          <div className="tutorial-input">
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
 
            </div>
          </div>
          <button type="submit" className="primary-btn">Guardar cambios</button>
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
