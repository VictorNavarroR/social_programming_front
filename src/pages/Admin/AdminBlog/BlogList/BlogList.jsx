import React, {useState} from 'react'
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardContent from '@mui/material/CardContent'
import CardMedia from '@mui/material/CardMedia'
import Typography from '@mui/material/Typography'
import {config} from '../../../../config'
import { useNavigate } from 'react-router-dom'
import ConfirmDialog from '../../../../components/ConfirmDialog/ConfirmDialog'
import Notification from '../../../../components/Notification/Notification'
import axios from 'axios'
import { store, blogState } from '../../../../Store/Store'
import './BlogList.scss'

export default function BlogList({ title, excerpt, image, postId }) {
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
  const userData = JSON.parse(localStorage.getItem('userData'))
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
  const navigate = useNavigate();
  const deleteTutorial = (postId) => {
    const url = `${config.apiUrl}/pages/${postId}`

    const headers = { 
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${userData.token}`,
    };

    axios.delete(url, { headers })
          .then(response => {
            setConfirmDialog(false)
              setNotify({
                isOpen: true,
                title:'Exito!',
                message: 'El artículo ha sido eliminado correctamente.',
                type: 'success'
            })
            store.dispatch(blogState.actions.setBlogState('true'))
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
              return
              }
              setNotify({
                  isOpen: true,
                  title:'Ups!',
                  message: 'Algo ha salido mal: ' + error,
                  type: 'error'
               })
            })

}

  const handleDelete = (postId) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Seguro que desea eliminar este artículo?',
      subTitle: "Este cambio es irreversible.",
      onConfirm: () => { deleteTutorial(postId) } 
  })
    
  }

  return (
    <div className="blog-post">

  <Card sx={{ display: 'flex', width: '100%', border: '1px solid #ccc'}}>
      <CardMedia
        component="img"
        sx={{ width: 151 }}
        image={image}
        alt={title}
      />
      <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
        <CardContent sx={{ flex: '1 0 auto' }}>
          <Typography component="div" variant="h5">
            {title}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary" component="div">
             {excerpt}
          </Typography>
          {userData.rol === 'Admin' || userData.rol === 'Collaborator'?
          <div className="blog-btns">
            <button className="primary-btn"><i className="fa-solid fa-eye"></i> Ver mas...</button>
            <button className="primary-btn" onClick={() => navigate('/admin/post/edit/'+postId)}><i className="fa-solid fa-pen-to-square"></i> Editar</button>
            <button className="delete-btn" onClick={() => handleDelete(postId)}><i className="fa-solid fa-trash-can"></i> Eliminar</button>
          </div>
          :
          <div className="blog-btns">
            <button className="primary-btn"><i className="fa-solid fa-eye"></i> Ver mas...</button>
          </div>
          }
          
        </CardContent>
      </Box>
      
    </Card>
    <Notification
          notify={notify}
          setNotify={setNotify}
        />
        <ConfirmDialog
          confirmDialog={confirmDialog}
          setConfirmDialog={setConfirmDialog}
        />
    </div>
  )
}
