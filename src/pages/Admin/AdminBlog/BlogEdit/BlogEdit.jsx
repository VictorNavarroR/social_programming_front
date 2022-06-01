import React, {useState, useEffect} from 'react'
import { Formik } from "formik";
import { config } from '../../../../config'
import Notification from '../../../../components/Notification/Notification'
import { TextEditor } from "../../../../components/TextEditor/TextEditor";
import axios from 'axios'
import { useNavigate, useParams } from 'react-router-dom'
import ConfirmDialog from '../../../../components/ConfirmDialog/ConfirmDialog'
import { useSelector } from 'react-redux'
import { getHomePosts } from '../../../../Store/Store'
import './BlogEdit.scss'
import Loader from '../../../../components/Loader/Loader';

export default function BlogEdit() {
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
    const userData = JSON.parse(localStorage.getItem('userData'))
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [ categories, setCategories ] = useState([])
    const [loader, setLoader] = useState(false)

    const posts = useSelector( state => state.posts)

    const navigate = useNavigate();

    const { id } = useParams();

    const filteredPost = posts.filter( post => post._id === id)
    const post = filteredPost[0]

    const getCategories = () => {
          const categoriesUrl = `${config.apiUrl}/categories`
            if(categories.length === 0) {
            axios.get(categoriesUrl)
              .then(
                (response) => {
                  setCategories(response.data)
                },
                (error) => {
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
    }

    useEffect(() => {

      if(posts.length === 0) {
        getHomePosts()
      }
      
        if(categories.length === 0) {
          getCategories()
        }
            
    }, [])

  return (
    <div style={{margin:'50px 0'}} className="admin-blog-form">
        <h2>Editar artículo</h2>
        <Formik
        enableReinitialize={true}
        initialValues = {{
            title:  post?.title,
            slug: post?.slug,
            excerpt: post?.excerpt ,
            content:post?.content,
            image:"",
            type:"post",
            category:post?.category
        }}

        onSubmit={(values) => {
          setLoader(true)
          const formData = new FormData()

          formData.append('title', values.title)
          formData.append('slug', values.slug)
          formData.append('excerpt', values.excerpt)
          formData.append('image', values.image)
          formData.append('content', values.content)
          formData.append('category', values.category)
          formData.append('created_by', userData.id)
          formData.append('type', 'post')
          
          const url = `${config.apiUrl}/pages/${post._id}`
          const headers = { 
            'Content-Type': 'form-data',
            'Authorization': `Bearer ${userData.token}`,
          };
          axios.put(url, formData, { headers })
              .then(response => {
                if(response.ok === false) {
                      setNotify({
                      isOpen: true,
                      title:'Ups!',
                      message: 'Ha habido un error inesperado.',
                      type: 'error'
                  })
                  setLoader(false)
                }
                setNotify({
                  isOpen: true,
                  title:'Exito!',
                  message: 'El artículo se ha editado correctamente.',
                  type: 'success'
              })
              setLoader(false)
              setTimeout(() => {
                    navigate('/admin/blog')
                  }, 800)
                  return
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

            if(!values.title) {
              errors.title = 'El campo título no puede estar vacío'
            } 
            if(!values.slug) {
              errors.slug = 'El campo slug no puede estar vacío'
            } 

            if(!values.excerpt) {
              errors.excerpt = 'El campo slug excerpt no puede estar vacío.'
            }

            return errors
        }}
      > 
      {( {values, errors, handleSubmit, handleChange, setFieldValue, handleBlur}) => (
          <form onSubmit={handleSubmit} className="rutaForm">
            <label htmlFor="title">Título(*):</label>
            <input
              id="title"
              name="title"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.title}
            />
            {errors.title && <div className="error">{errors.title}</div>}

            <label htmlFor="slug">Slug(*):</label>
            <input
              id="slug"
              name="slug"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={ values.slug}
            />
            {errors.slug && <div className="error">{errors.slug}</div>} 
            <small style={{color:'gray'}}>Este campo es usado para las url amigables</small><br/>

            <label htmlFor="excerpt">Excerpt(*):</label>
            <input
              id="excerpt"
              name="excerpt"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={ values.excerpt}
            />
            {errors.excerpt && <div className="error">{errors.excerpt}</div>} 
            <small style={{color:'gray'}}>Este campo es usado para mostrar extracto en la pagina de blog</small><br/>

            <label htmlFor="email" style={{ display: "block" }}>
            Categoría
            </label>
            <select
              name="category"
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ display: "block" }}
              value={ values.category}
            >
              <option value="" label="Selecciona una categoría">
                Selecciona una categoría{" "}
              </option>
              {
                categories.map( (cat, index) => (
                  <option value={cat.name} label={cat.name} key={index}>
                    {cat.name}
                  </option>
                ))
              }
            </select>
            {errors.color && <div className="input-feedback">{errors.color}</div>}
        
            <div className="post-img-select">
                <div className="post-img">
                    <img src={post?.image} alt={post?.title}/>
                </div>
                <div className="post-img-field">
                <label htmlFor="image">Imagen(*):</label>
                <input
                id="image"
                name="image"
                type="file"
                accept="image/png, image/gif, image/jpeg" 
                onChange={(event) => {
                    setFieldValue("image", event.currentTarget.files[0]);
                }} 
                onBlur={handleBlur}

                /> 
                </div> 
            </div>
            {errors.image && <div className="error">{errors.image}</div>}  

            <label htmlFor="content">Contenido:</label>
            <TextEditor
                setFieldValue={(val) => setFieldValue("content", val)}
                value={values.content}
                />        

            <button type="submit" className="primary-btn">Actualizar artículo</button>
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
