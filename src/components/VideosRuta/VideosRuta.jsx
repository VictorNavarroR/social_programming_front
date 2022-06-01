import React, {useEffect, useState} from 'react'
import Alert from '@mui/material/Alert';
import Stack from '@mui/material/Stack';
import { useNavigate } from 'react-router-dom'
import { config } from '../../config'
import axios from 'axios'

import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Notification from '../../components/Notification/Notification'
import ConfirmDialog from '../../components/ConfirmDialog/ConfirmDialog'

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

import './VideosRuta.scss'


export default function VideosRuta({ rutaId, name }) {
 const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
 const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
 const userData = JSON.parse(localStorage.getItem('userData'))
 const [videos, setVideos] = useState([])
 const [like, setLike] = useState(false)
 
 const navigate = useNavigate();
 
 const handleLike = (videoId) => {

  if(!userData) {
    setNotify({
      isOpen: true,
      title:'Ups!',
      message: 'Es necesario estar logueado para dar likes.',
      type: 'warning'
   })
   return
  }

  const url = `${config.apiUrl}/ruta-videos/like/${videoId}`

  const headers = { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userData.token}`,
  };

  axios.put(url, {likes: userData.id}, { headers })
    .then(response => {
      setLike(true)
      })
      .catch(error => {
        setNotify({
            isOpen: true,
            title:'Ups!',
            message: 'Algo ha salido mal: ' + error,
            type: 'error'
         })
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

 const handleFollowRoute = (rutaId) => {
  const url = `${config.apiUrl}/users/ruta/${rutaId}`

  const headers = { 
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${userData.token}`,
  };

  axios.put(url, {userId: userData.id}, { headers })
    .then(response => {

        setNotify({
          isOpen: true,
          title:'Exito!',
          message: 'Ha comenzado a seguir la ruta ' + name,
          type: 'success'
      })
      })
      .catch(error => {
        setNotify({
            isOpen: true,
            title:'Ups!',
            message: 'Algo ha salido mal: ' + error,
            type: 'error'
         })
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

 const url = `${config.apiUrl}/ruta-videos/ruta/${rutaId}`

 axios.get(url)
     .then((response) => {
       if(response.error) {
         console.log('Ha habido un error')    
       } else {
          setVideos(response.data)
       }
                                
       }
       
     ) 
     .catch(error => {
       if(error.response.data.message === 'TokenExpiredError') {
      setConfirmDialog({
        isOpen: true,
        noCancel:true,
        title: 'Su sesión ha caducado?',
        subTitle: "Será redireccionado a la pagina de login para que  inserte sus credenciales.",
        onConfirm: () => { navigate('/logout') }
      })
    }})

}, [like])

  return (
    <div>
    <div className="video-rutas-header">
        <h2>Vídeos de la ruta</h2>
        {
          userData && userData.rol === 'Student' 
          ? 
          <div className="video-actions">
          {userData.user_paths.length > 0 && userData.user_paths.includes(rutaId) ?
            <button className="success-btn"><i class="fa-solid fa-check"></i> Siguiendo </button>
           :
           <button className="secondary-btn" onClick={() => {
            handleFollowRoute(rutaId)
           }}><i className="fa-solid fa-lightbulb"></i> Seguir ruta </button> 
            
          }
          </div>
          : 
          <div className="video-actions"> 
          { userData && userData.rol === 'Admin' ?
          <button className="primary-btn" onClick={() => { navigate('/admin/add-video/'+rutaId+'?ruta-name='+name) }}><i className="fa-solid fa-video"></i> Agregar vídeos </button>
          :
          ''
          } 
          </div>
          }
    </div>
    <Box sx={{ width: '100%' }}>
    <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 4 }}>
    {
      videos && videos.length !== 0
      ?
      videos.map( video => (

        <Grid item xs={3} key={video._id}>
        <Card sx={{ maxWidth: 345, marginBottom:'15px'}} style={{border: "1px solid #ccc"}}>
          <CardMedia
            component="img"
            height="140"
            image={video.image}
            alt={video.name}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {video.name}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {video.description}
            </Typography>
          </CardContent>
          <CardActions style={{justifyContent: "space-between"}}>
            <Button size="small" onClick={() => {
              userData && userData.name !== '' 
              ?
              navigate('/admin/video/'+video._id)
              :
              setNotify({
                isOpen: true,
                title:'Ups!',
                message: 'Es necesario estar logueado para ver los vídeos.',
                type: 'warning'
            })
              }}>Ver</Button>
            <Button size="small" onClick={() => handleLike(video._id)}><i style={{ color: video.likes.includes(userData ? userData.id : 0) ? 'red': '#69dadb'}} className="fa-solid fa-heart"></i> <span className="likes">{video.likes.length > 0 ? video.likes.length : 0}</span></Button>
          </CardActions>
        </Card>
        </Grid>
      ))
      :
      <Stack sx={{ width: '100%' }} spacing={2}>
        <Alert severity="info">Todavía no se han agregado vídeos a esta ruta, mantente pendiente, pueden ser agregados en cualquier momento.</Alert>
      </Stack>
      

    }
    </Grid>
    </Box>
    <ConfirmDialog
            confirmDialog={confirmDialog}
            setConfirmDialog={setConfirmDialog}
        />
    <Notification
                notify={notify}
                setNotify={setNotify}
            />
    </div>
  )
}
