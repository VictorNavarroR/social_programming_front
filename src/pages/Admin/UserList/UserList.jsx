import React, {useEffect, useState} from 'react'
import {config} from '../../../config'
import axios from 'axios'
import ConfirmDialog from '../../../components/ConfirmDialog/ConfirmDialog'

import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import { useNavigate } from 'react-router-dom'

export default function UserList() {
  const [confirmDialog, setConfirmDialog] = useState({ isOpen: false, title: '', subTitle: '' })
  const userData = JSON.parse(localStorage.getItem('userData'))
  const [users, setUsers] = useState([])
  const navigate = useNavigate();

  useEffect( () => {

    const url = `${config.apiUrl}/users/`
 
    const configuration = {
      headers:{
        'Authorization': `Bearer ${userData.token}`,
      }
    };
   
    axios.get(url, configuration)
        .then((response) => {
            setUsers(response.data)
                                             
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
          }
        })
   
   }, [])
   
  return (
    <>
    <h2>Usuarios registrados</h2>
    <List sx={{ width: '100%', bgcolor: 'background.paper' }}>
      {
        users.map( user => (
          <>
            <ListItem alignItems="flex-start" key={user._id}>
            <ListItemAvatar>
              <Avatar alt="Remy Sharp" src={user.image} />
            </ListItemAvatar>
            <ListItemText
              primary={user.name + ' ' + user.lastName} 
              secondary={
                <React.Fragment>
                  <Typography
                    sx={{ display: 'inline' }}
                    component="span"
                    variant="body2"
                    color="text.primary"
                  >
                    {user.user_rol.map(rol => rol.name).join('-')}
                  </Typography>
                  <span style={{position: 'absolute', right: 0}}>{user.email}</span>
                </React.Fragment>
              }
            />
          </ListItem>
          <Divider variant="inset" component="li" />
          </>
          )
        )
      }        
      </List>
      <ConfirmDialog
            confirmDialog={confirmDialog}
            setConfirmDialog={setConfirmDialog}
        /> 
    </>
  )
}
