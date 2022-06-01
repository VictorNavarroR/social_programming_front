import React from 'react'
import { useNavigate } from "react-router-dom";
import './BlogPosts.scss'

export default function BlogPosts({posts}) {
  const navigate = useNavigate()
  return (
    <section className="posts">
                <h2>Artículos recientes</h2>
                <div className="posts-wrap">

                {
                    posts && posts.length > 0 
                    ?
                    posts.map( post => (
                        <article key={post._id}>
                        <div className="post-image">
                            <img src={post.image} alt={post.title} />
                        </div>
                        <h3 className="post-title">{post.title}</h3>
                        <p className="post-content">
                            {post.excerpt}
                        </p>
                        <button className="primary-btn" onClick={() => navigate('/blog/post/' + post.slug, {state:{postId:post._id}})}>Ver más...  <i className="fas fa-angle-right"></i></button>
                    </article>
                    )
                    )
                    :
                    'Actualmente no existes artículos en nuestra base de datos.'
                }
                    
                </div>
            </section>
  )
}
