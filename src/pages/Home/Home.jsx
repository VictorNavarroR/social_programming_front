import React, { useState, useEffect } from 'react'
import Banner from './../../components/Banner/Banner'
import RutasGrid  from '../../components/RutasGrid/RutasGrid'
import BlogPosts from '../../components/BlogPosts/BlogPosts'
import Tutorials from '../../components/Tutorials/Tutorials'
import { getRutasHome, getRutas, getHomePosts } from '../../Store/Store'
import { useSelector } from 'react-redux'

export default function Home() { 

  const rutas = useSelector( state => state.rutasHome)
  const posts = useSelector( state => state.posts)
  
  useEffect( () => {
    if(rutas.length === 0) {
      getRutasHome()
      getRutas()
    }
    getHomePosts()
  }, [])

  return (
    <div>
      <Banner 
      title='Bienvenidos a <span>Social Programming</span>'
      subtitle='Desarrollo de software desbloqueado para todos!'
      content='<a href="http://google.com">Social Programming</a> es el mejor lugar para aprender desarrollo de software desde cero y con coste cero, hemos recolectado una gran cantidad de material de aprendizaje y lo hemos puesto en un
                    solo lugar para que tu camino hacia al desarrollo de software sea facil y a coste cero.'
      btnText='Más sobre nosotros'
      urlTo="/about"
       />   

       <RutasGrid rutas={rutas} showTitle={true} limit={3} />

       <BlogPosts posts={posts.slice(Math.max(posts.length - 2, 0))} />

       <Tutorials showTitle={true} limit={4} />
    </div>
  )
}
