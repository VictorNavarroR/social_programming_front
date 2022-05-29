import React, {useEffect} from 'react'
import { useLocation } from "react-router-dom";
import { getHomePosts } from '../../../Store/Store'
import { useSelector } from 'react-redux'
import { useNavigate } from "react-router-dom";

import './PostDetail.scss'

export default function PostDetail() {
    const { state } = useLocation();
    const navigate = useNavigate();
    useEffect(() => {
      getHomePosts()
    }, [])

   const posts = useSelector( state => state.posts) 

    const actualPost = posts.filter( post => post._id === state.postId )

  return (
    <>
    { actualPost && actualPost.length > 0 
      ?
      <div className="post-detail">
          <div className="post-detail__content-wrap">
          <div className="post-detail__image">
              <img src={actualPost[0].image} alt={actualPost[0].title}/>
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
          </div>
      </div>
      :
      ''
    }
    </>
  )
}
