import React, {useEffect, useState} from 'react'
import { useNavigate } from "react-router-dom";
import {config} from '../../../config'
import axios from 'axios'
import { Facebook, Twitter } from 'react-sharingbuttons'
import 'react-sharingbuttons/dist/main.css'
import './BlogList.scss'

export default function BlogList({post}) {
    const [ userName, setUserName] = useState('')
    const navigate = useNavigate()
    useEffect( () => {
        const url = `${config.apiUrl}/users/${post.created_by[0]}`
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

    const convertDate = date => {
       const  dateToConvert = new Date(date)
       return dateToConvert.getDate() + '-' + (dateToConvert.getMonth()+1) + '-'+  dateToConvert.getFullYear()
    }

  return (
    <div className="post">
        <div className="post__image">
            <img src={ post.image } alt={ post.title } />
        </div>
        <div className="post__meta">
          <div className="post__info">
          <strong>Categoría:</strong> {post.category} | <i className="fa-solid fa-user"></i> <strong>Creado por:</strong> {userName} | <i className="fa-solid fa-calendar-days"></i> <strong>En fecha</strong>: {convertDate(post.createdAt)}
          </div>
          <div className="post__social">
            <Facebook url={'blog/post/' + post.slug} shareText={'Compartir'} />
            <Twitter url={'blog/post/' + post.slug} shareText={'Compartir'} />
          </div>
        </div>
        <h2>{ post.title }</h2>
        <div className="post__excerpt">
        { post.excerpt }
        </div>
        <div className="post__actions">
            <button className="primary-btn" onClick={() => navigate('/blog/post/' + post.slug, {state:{postId:post._id}})}>Ver mas...</button>
        </div>
    </div>
  )
}
