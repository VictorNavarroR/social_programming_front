import React, {useEffect, useState} from 'react'
import { useSelector } from 'react-redux'
import { getHomePosts } from '../../Store/Store'
import BlogList from './BlogList/BlogList'
import { useNavigate } from "react-router-dom";
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'
import { store, postsHomeReducer } from '../../Store/Store'
import axios from 'axios'
import { config } from '../../config'
import './Blog.scss'

export default function Blog() {
  
  const posts = useSelector( state => state.posts)
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
  const navigate = useNavigate();
  const [ categories, setCategories ] = useState([])

  const handleCategory = (category) => {
    if(category === 'sin_categoria') {
      store.dispatch(postsHomeReducer.actions.setPostsHome(posts.filter( posts => posts.category === '')))
    }
    store.dispatch(postsHomeReducer.actions.setPostsHome(posts.filter( posts => posts.category === category)))
    
  }

  useEffect( () => {
    if(posts.length === 0) {
      getHomePosts()
    }

  }, [])

  useEffect(() => {

        const categoriesUrl = `${config.apiUrl}/categories`

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

        
    }, [navigate])

  return (
    <div className="blog-wrapper">
      <div className="blog-wrapper__content">
      
      <ul>
        {
          posts 
          ?

          posts.map( post => {
            return <BlogList post={post} key={post._id} />
          })
        
        :
        'No se han encontrado artículos en nuestra base de datos'
        }
      </ul>

      </div>
      <div className="blog-wrapper__sidebar">
      <h3>Artículos publicados</h3>
          <ul>
            {
              
              posts.map( post => (
                <li key={post._id}>
                  <a onClick={() => navigate('/blog/post/'+post.slug, {state:{postId:post._id}})}>{post.title}</a>
                </li>
              ))
              
            }
            </ul>

      <h3 style={{marginTop:'50px'}}>Categorías</h3>
            <ul>
            <li><a onClick={() => handleCategory('sin_categoria')}>Sin categoría</a></li>
              {
                
                categories.map( cat => (
                  <li key={cat._id}>
                    <a onClick={() => handleCategory(cat.name)}>{cat.name}</a>
                  </li>
                ))
                
              }
              </ul>            

      </div>
      <ConfirmDialog
            confirmDialog={confirmDialog}
            setConfirmDialog={setConfirmDialog}
        />
    </div>
  )
}
