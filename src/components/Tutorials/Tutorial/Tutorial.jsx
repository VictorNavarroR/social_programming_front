import React, { useState }  from 'react'
import './Tutorial.scss'
import ModalVideo from 'react-modal-video'
import Notification from '../../Notification/Notification'
import ConfirmDialog from '../../ConfirmDialog/ConfirmDialog'
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { store, tutorialState } from '../../../Store/Store'
import { config } from '../../../config'
import { useNavigate } from "react-router-dom";
import axios from 'axios';

export default function Tutorial({ id, tutorialTitle, tutorialBtnTxt, linkTo, image, approved }) {
    const [isOpen, setOpen] = useState(false)
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
    const navigate = useNavigate();

    const userData = JSON.parse(localStorage.getItem('userData'))

    const youtubeId = (url) => {
        var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#&?]*).*/;
        var match = url.match(regExp);
        return (match&&match[7].length===11)? match[7] : false;
    }

    const approveTutorial = (tutorialId) => {


            const url = `${config.apiUrl}/tutoriales/approve/${tutorialId}`

            const headers = { 
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userData.token}`,
            };

            axios.put(url, {isApproved: true}, { headers })
              .then(response => {
  
                  setNotify({
                    isOpen: true,
                    title:'Exito!',
                    message: 'El tutorial ha sido aprobado correctamente.',
                    type: 'success'
                })
                store.dispatch(tutorialState.actions.setTutorialState('true'))
                })
                .catch(error => {
                  setNotify({
                      isOpen: true,
                      title:'Ups!',
                      message: 'Algo ha salido mal: ' + error,
                      type: 'error'
                   })
                })
    }

    const deleteTutorial = (tutorialId) => {
        const url = `${config.apiUrl}/tutoriales/${tutorialId}`

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
                    message: 'El tutorial ha sido eliminado correctamente.',
                    type: 'success'
                })
                store.dispatch(tutorialState.actions.setTutorialState('true'))
                })
                .catch(error => {
                  setNotify({
                      isOpen: true,
                      title:'Ups!',
                      message: 'Algo ha salido mal: ' + error,
                      type: 'error'
                   })
                })

    }

    const handleDeleteTutorial = (tutorialId) => {
        setConfirmDialog({
          isOpen: true,
          title: 'Seguro que desea eliminar este tutorial?',
          subTitle: "Este cambio es irreversible.",
          onConfirm: () => { deleteTutorial(tutorialId) } 
      })
        
    }

    return (
        <>
        <ModalVideo channel='youtube' autoplay isOpen={isOpen} videoId={youtubeId(linkTo)} onClose={() => setOpen(false)} />
        <div className="tutorial">
            <h3>{ tutorialTitle }</h3>
            <button className="ver-tutorial" onClick={()=> setOpen(true)}>
            <i className="fab fa-youtube"></i> 
                { tutorialBtnTxt } 
            </button>
            <img src={image} alt={tutorialTitle} />
            {
                userData && userData.rol === 'Admin' 
            ?
                <Stack spacing={2} direction="row" className="actions">
                    {approved 
                    ?
                    <Button variant="contained"  color='success'><i className="fa fa-solid fa-check"></i>Aprobado</Button>
                    :
                    <Button variant="contained" onClick={() => approveTutorial(id)} color='warning'><i className="fa fa-solid fa-check"></i>Aprobar</Button>
                    }
                    <Button variant="contained" onClick={()=> handleDeleteTutorial(id)} color="error"><i className="fa fa-solid fa-trash"></i> Eliminar</Button>
                    <Button variant="contained" onClick={() => navigate('/admin/tutoriales/edit')}><i className="fa fa-solid fa-pen-to-square"></i> Editar</Button>
                </Stack>
            :
            ''            
           }
           {
                userData && userData.rol === 'Collaborator' 
            ?
                <Stack spacing={2} direction="row" className="actions">
                    <Button variant="contained" onClick={() => navigate('/admin/tutoriales/edit')}><i className="fa fa-solid fa-pen-to-square"></i> Editar</Button>
                    <Button variant="contained" onClick={()=> handleDeleteTutorial(id)} color="error"><i className="fa fa-solid fa-trash"></i> Eliminar</Button>
                </Stack>
            :
            ''            
           }
        </div>
        <ConfirmDialog
            confirmDialog={confirmDialog}
            setConfirmDialog={setConfirmDialog}
        /> 
        <Notification
                notify={notify}
                setNotify={setNotify}
            />
    </>
  )
}
