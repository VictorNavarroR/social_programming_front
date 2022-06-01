import React, {useEffect, useState} from 'react'
import { useLocation } from "react-router-dom";
import { getHomePosts } from '../../../Store/Store'
import { useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom";
import {config} from '../../../config'
import { Facebook, Twitter } from 'react-sharingbuttons'
import 'react-sharingbuttons/dist/main.css'
import axios from 'axios'
import './PostDetail.scss'

export default function PostDetail() {
    const { state } = useLocation();
    const navigate = useNavigate();
    const [ userName, setUserName] = useState('')

    const convertDate = date => {
      const  dateToConvert = new Date(date)
      return dateToConvert.getDate() + '-' + (dateToConvert.getMonth()+1) + '-'+  dateToConvert.getFullYear()
   }

    useEffect(() => {
      getHomePosts()
    }, [])

    
   const posts = useSelector( state => state.posts) 

   const actualPost = posts.filter( post => post._id === state.postId )
    
    useEffect( () => {
        const url = `${config.apiUrl}/users/${actualPost[0]?.created_by[0]}`
        axios.get(url)
         .then((response) => {
           if(response.error) {
             console.log('Ha habido un error')    
           } else {
              setUserName(response.data.name + response.data.lastName)
           }
                                    
           }
           
         ) 
         .catch(error => console.log('Error getting routes: ', error))
    }, [])


  return (
    <>
    { actualPost && actualPost.length > 0 
      ?
      <div className="post-detail">
          <div className="post-detail__content-wrap">
          <div className="post-detail__image">
              <img src={actualPost[0].image} alt={actualPost[0].title}/>
              <div className="post__meta">
          <div className="post__info">
          <strong>Categoría:</strong> {actualPost[0].category} | <i className="fa-solid fa-user"></i> <strong>Creado por:</strong> {userName} | <i className="fa-solid fa-calendar-days"></i> <strong>En fecha</strong>: {convertDate(actualPost[0].createdAt)}
          </div>
          <div className="post__social">
            <Facebook url={'blog/post/' + actualPost[0].slug} shareText={'Compartir'} />
            <Twitter url={'blog/post/' + actualPost[0].slug} shareText={'Compartir'} />
          </div>
        </div>
          </div>
          <h2>{actualPost[0].title}</h2>
          <div className="post-detail__content" dangerouslySetInnerHTML={{__html: actualPost[0].content}}></div>
          
          </div>
          <div className="post-detail__sidebar">
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
            <button className="primary-btn post-detail__back" onClick={() => navigate(-1)}><i className="fa-solid fa-angle-left"></i> Volver</button>
          </div>
      </div>
      :
      ''
    }
    </>
  )
}
