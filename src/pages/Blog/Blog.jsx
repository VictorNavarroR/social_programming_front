import React, {useEffect} from 'react'
import { useSelector } from 'react-redux'
import { getHomePosts } from '../../Store/Store'
import BlogList from './BlogList/BlogList'
import './Blog.scss'

export default function Blog() {
  
  const posts = useSelector( state => state.posts)

  useEffect( () => {
    if(posts.length === 0) {
      getHomePosts()
    }

  }, [])

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
      <div className="blog-wrapper__sidebar">sidebar</div>
    </div>
  )
}
