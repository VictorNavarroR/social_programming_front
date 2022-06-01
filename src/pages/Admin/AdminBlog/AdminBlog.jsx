import React, {useState, useEffect} from 'react'
import axios from 'axios'
import { Formik } from "formik";
import { config } from '../../../config'
import Notification from '../../../components/Notification/Notification'
import { TextEditor } from "../../../components/TextEditor/TextEditor";
import ConfirmDialog from '../../../components/ConfirmDialog/ConfirmDialog'
import BlogList from './BlogList/BlogList'
import { useNavigate } from 'react-router-dom'
import { store, postsHomeReducer, blogState } from '../../../Store/Store'
import { useSelector } from 'react-redux'
import Loader from '../../../components/Loader/Loader';
import './AdminBlog.scss'

export default function AdminBlog() {
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
    const [ showForm, setShowForm ] = useState(false)
    const [ showCatForm, setShowCatForm ] = useState(false)
    const [ categories, setCategories ] = useState([])
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [posts, setPosts] = useState([])
    const navigate = useNavigate();
    const stateBlog = useSelector( state => state.blog )
    const [loader, setLoader] = useState(false)
    const userData = JSON.parse(localStorage.getItem('userData'))

    const convertToSlug = (text) => {
    return text
        .toLowerCase()
        .replace(/ /g,'-')
        .replace(/[^\w-]+/g,'')  
    }

    useEffect(() => {

      const url = `${config.apiUrl}/pages`
      setLoader(true)
        axios.get(url)
          .then(
            (response) => {
              setPosts(response.data)
              store.dispatch(postsHomeReducer.actions.setPostsHome(response.data))
              store.dispatch(blogState.actions.setBlogState('false'))
              setLoader(false)
            },
            (error) => {
              setLoader(false)
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

          const categoriesUrl = `${config.apiUrl}/categories`

          axios.get(categoriesUrl)
            .then(
              (response) => {
                setCategories(response.data)
                setShowCatForm(false)
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

          
      }, [showForm, stateBlog, navigate])
    
  return (
    <>
    <div className="admin-blog-header">
        <h2>Artículos publicados</h2>
        <div>
        <button style={{marginRight:'15px'}} className="primary-btn" onClick={() => {setShowForm(!showForm); setShowCatForm(false)}}>{ showForm ? <i className="fa-solid fa-minus"></i> : <i className="fa-solid fa-plus"></i>} {showForm ? 'Ocultar formulario' : 'Agregar nuevo artículo'}</button>
        <button className="primary-btn" onClick={() => {setShowCatForm(!showCatForm);  setShowForm(false)}}>{ showCatForm ? <i className="fa-solid fa-minus"></i> : <i className="fa-solid fa-plus"></i>} {showCatForm ? 'Ocultar formulario' : 'Agregar categoría'}</button>
        </div>
    </div>
    {
        showForm 
        ?
        <div className="admin-blog-form">
        <Formik
        initialValues={{
            title: "",
            slug: "",
            excerpt: "",
            content:"",
            image:"",
            type:"post",
            categories:""
        }}
        onSubmit={(values, {resetForm}) => {
          setLoader(true)
          const formData = new FormData();

          formData.append('title', values.title)
          formData.append('slug', values.slug)
          formData.append('excerpt', values.excerpt)
          formData.append('image', values.image)
          formData.append('content', values.content)
          formData.append('created_by', userData.id)
          formData.append('type', 'post')
          
          const url = `${config.apiUrl}/pages`
          const headers = { 
            "Content-Type": "form-data",
            'Authorization': `Bearer ${userData.token}`,
          };
          axios.post(url, formData, { headers })
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
                setShowForm(false)
                setNotify({
                  isOpen: true,
                  title:'Exito!',
                  message: 'El artículo se ha agregado correctamente.',
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

            if(!values.title) {
              errors.title = 'El campo título no puede estar vacío'
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
              onBlur={handleBlur}
              value={values.title}
              onChange={() => {
                setFieldValue("slug", convertToSlug(values.title));
              }}
            />
            {errors.title && <div className="error">{errors.title}</div>}

            <label htmlFor="slug">Slug(*):</label>
            <input
              id="slug"
              name="slug"
              type="text"
              readonly
              onChange={handleChange}
              value={values.slug}
            />
            <small style={{color:'gray'}}>Este campo es usado para las url amigables</small><br/>

            <label htmlFor="excerpt">Excerpt(*):</label>
            <input
              id="excerpt"
              name="excerpt"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.excerpt && <div className="error">{errors.excerpt}</div>} 
            <small style={{color:'gray'}}>Este campo es usado para mostrar extracto en la pagina de blog</small><br/>

            <label htmlFor="email" style={{ display: "block" }}>
            Categories
            </label>
            <select
              name="categorias"
              value={values.color}
              onChange={handleChange}
              onBlur={handleBlur}
              style={{ display: "block" }}
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
            {errors.image && <div className="error">{errors.image}</div>}  

            <label htmlFor="content">Contenido:</label>
            <TextEditor
                setFieldValue={(val) => setFieldValue("content", val)}
                value={values.content}
                />        

            <button type="submit" className="primary-btn">Agregar artículo</button>
          </form>
            )}
      </Formik>
        </div>
        :
        ''
    }

    {
        showCatForm 
        ?
        <div className="admin-blog-form">
        <Formik
        initialValues={{
            name: "",
            description: "",
        }}
        onSubmit={(values, {resetForm}) => {
          console.log(values)          
          const url = `${config.apiUrl}/categories`
          const headers = { 
            'Authorization': `Bearer ${userData.token}`,
          };
          axios.post(url, values, { headers })
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
                setShowForm(false)
                setNotify({
                  isOpen: true,
                  title:'Exito!',
                  message: 'La categoría se ha agregado correctamente.',
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
              errors.title = 'El campo name no puede estar vacío'
            } 
            if(!values.description) {
              errors.description = 'El campo descripción no puede estar vacío'
            } 

            return errors
        }}
      > 
      {( {values, errors, handleSubmit, handleChange, handleBlur}) => (
          <form onSubmit={handleSubmit} className="catForm">
            <label htmlFor="title">Name(*):</label>
            <input
              id="name"
              name="name"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
            />
            {errors.name && <div className="error">{errors.name}</div>}

            <label htmlFor="description">description(*):</label>
            <input
              id="description"
              name="description"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
            />
            {errors.description && <div className="error">{errors.description}</div>} 
            <small style={{color:'gray'}}>Agrega une breve descripción de la categoría.</small><br/>

            <button type="submit" className="primary-btn">Agregar categoría</button>
          </form>
            )}
      </Formik>
        </div>
        :
        ''
    }

    <div className="blog-list">
      { posts.map( post => {

       return <BlogList title={post.title} excerpt={post.excerpt} slug={post.slug} image={post.image} postId={post._id} key={post._id} />

      } ) }
    </div>

    <Notification
            notify={notify}
            setNotify={setNotify}
            />
    <ConfirmDialog
            confirmDialog={confirmDialog}
            setConfirmDialog={setConfirmDialog}
        />
      {
        
        loader ? <Loader /> : ''
        
      } 
    </>
  )
}
