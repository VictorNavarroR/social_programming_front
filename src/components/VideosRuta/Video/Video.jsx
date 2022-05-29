import React, {useEffect, useState} from 'react'
import { config } from '../../../config'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import './Video.scss'

export default function Video() {
  const [video, setVideo] = useState({})
  const [videoId, setVideoId] = useState('')
  const { id } = useParams();

  const extractVideoID = (url) => {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[7].length === 11) {
      return match[7];
    } else {
      alert('Could not extract video ID.');
    }
  }

  useEffect( () => {

    const url = `${config.apiUrl}/ruta-videos/video/${id}`
   
    axios.get(url)
        .then((response) => {
          if(response.error) {
            console.log('Ha habido un error')    
          } else {
             setVideo(response.data[0])
             setVideoId(extractVideoID(response.data[0].video_url))
          }
                                   
          }
          
        ) 
        .catch(error => console.log('Error getting routes: ', error))
   
   }, [id])
  return (
    <div className="video-wrapper">
     <iframe
      src={`https://www.youtube.com/embed/${videoId}`}
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
      encrypted-media
      frameBorder="0"
      title="Embedded youtube"
    />
    <div className="video-info">
      <h3>{video.name}</h3>
      <div>{video.description}</div>
    </div>
    </div>
  )
}
