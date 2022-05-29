import React from 'react'
import './Post.scss'

export default function Post({ postImage, postTitle, postContent, postBtnTxt }) {
  return (
    <article>
        <div className="post-image">
            <img src={ postImage } alt="Logo de css" />
        </div>
        <h3 className="post-title">{ postTitle }</h3>
        <p className="post-content">
           { postContent }
        </p>
        <button className="primary-btn"> { postBtnTxt } <i className="fas fa-angle-right"></i></button>
    </article>
  )
}
