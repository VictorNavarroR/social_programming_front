import React, {useEffect, useState, useCallback} from 'react'
import { config } from '../../../config'
import { useParams } from 'react-router-dom'
import YouTube from '@u-wave/react-youtube';
import ConfirmDialog from '../../../components/ConfirmDialog/ConfirmDialog'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import './Video.scss'

export default function Video() {
  const userData = JSON.parse(localStorage.getItem('userData'))
  const [video, setVideo] = useState({})
  const [videoId, setVideoId] = useState('')
  const [videoWatching, setVideoWatching] = useState([])
  const [paused, setPaused] = useState(false);
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
  const { id } = useParams();
  const navigate = useNavigate();

  const extractVideoID = (url) => {
    var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/;
    var match = url.match(regExp);
    if (match && match[7].length === 11) {
      return match[7];
    } else {
      alert('Could not extract video ID.');
    }
  }

  const handlePlaying = (event) => {

  const startTime = event.target.playerInfo.currentTime;

  console.log(startTime)

  const url = `${config.apiUrl}/users/watching/${userData.id}`

  const headers = { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userData.token}`,
  };

  axios.put(url, {watching: { video:videoId, startTime:startTime}}, { headers })
    .then(response => {
        return
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

        const userUrl = `${config.apiUrl}/users/${userData.id}`
   
        axios.get(userUrl)
            .then((response) => {
              if(response.error) {
                console.log('Ha habido un error')    
              } else {
                setVideoWatching(response.data.watching)
              }
                                       
              }
              
            )  
            .catch(error => console.log('Error getting routes: ', error))
   
   }, [id])

   const videoTime = videoWatching.filter( video => video.video === videoId)
  return (
    <div className="video-wrapper">
     <YouTube
      video={videoId}
      showRelatedVideos={false}
      onPlaying={handlePlaying}
      onPause={handlePlaying}
      startSeconds={Number(videoTime[0]?.startTime)}
      autoplay
    />
    <div className="video-info">
      <h3>{video.name}</h3>
      <div>{video.description}</div>
    </div>
    <ConfirmDialog
            confirmDialog={confirmDialog}
            setConfirmDialog={setConfirmDialog}
        />
    </div>
  )
}
