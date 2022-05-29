import React, { useState } from 'react'
import './Ruta.scss'
import { useNavigate } from 'react-router-dom'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import ConfirmDialog from '../../ConfirmDialog/ConfirmDialog'
import Notification from '../../Notification/Notification'
import { config } from '../../../config'
import { store, rutasReducer } from '../../../Store/Store'
import axios from 'axios'

export default function Ruta({ title, imgSrc, linkTo, rutaId }) {
  const navigate = useNavigate();

  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
  const userData = JSON.parse(localStorage.getItem('userData'))
  const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })

  const deleteRuta = (tutorialId) => {
    const url = `${config.apiUrl}/rutas/${tutorialId}`

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
                message: 'La ruta ha sido eliminada correctamente.',
                type: 'success'
            })
            store.dispatch(rutasReducer.actions.setRutasObj(response.data))
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

  const handleDeleteRuta = (tutorialId) => {
    setConfirmDialog({
      isOpen: true,
      title: 'Seguro que desea eliminar esta ruta?',
      subTitle: "Este cambio es irreversible.",
      onConfirm: () => { deleteRuta(tutorialId) } 
  })

    
}

  return (
    <>
    <div className="ruta-wrapper">
      <div className="ruta" onClick={ () => { navigate(linkTo) } }>
          <h3>{ title }</h3>
          <img src={imgSrc} alt="Imagen { title }" />
          
                
      </div>
      { userData && userData.rol === 'Admin'
          ?
          <Stack spacing={2} direction="row" className="actions">
              <Button variant="contained" onClick={()=> handleDeleteRuta(rutaId)} color="error"><i className="fa fa-solid fa-trash"></i> Eliminar</Button>
              <Button variant="contained"><i className="fa fa-solid fa-pen-to-square"></i> Editar</Button>
          </Stack>
          :
          ''
      }
    </div>         
        <Notification
          notify={notify}
          setNotify={setNotify}
        />
        <ConfirmDialog
          confirmDialog={confirmDialog}
          setConfirmDialog={setConfirmDialog}
        />
        </>
  )
}
