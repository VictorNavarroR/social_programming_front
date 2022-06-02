import React, {useState} from 'react'
import PropTypes from 'prop-types'
import Tabs from '@mui/material/Tabs'
import Tab from '@mui/material/Tab'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd'
import CastForEducationIcon from '@mui/icons-material/CastForEducation'
import Notification from '../../components/Notification/Notification'
import Banner from './../../components/Banner/Banner'
import { useNavigate } from "react-router-dom";
import axios from 'axios'
import { Formik } from "formik"
import { config } from '../../config'
import './Register.scss'

function TabPanel(props) {
    const { children, value, index, ...other } = props;
  
    return (     
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`simple-tabpanel-${index}`}
        aria-labelledby={`simple-tab-${index}`}
        {...other}
      >
        {value === index && (
          <Box sx={{ p: 3 }}>
            <Typography>{children}</Typography>
          </Box>
        )}
      </div>
  
    );
  }
  
  TabPanel.propTypes = {
    children: PropTypes.node,
    index: PropTypes.number.isRequired,
    value: PropTypes.number.isRequired,
  };
  
  function a11yProps(index) {
    return {
      id: `simple-tab-${index}`,
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }

export default function Register() {
    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem('userData'))
    const [notify, setNotify] = useState({ isOpen: false, message: '', type: '' })
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

  return (
    <>
    <Banner 
      title='Bienvenidos a <span>Social Programming</span>'
      subtitle='Desarrollo de software desbloqueado para todos!'
      content='Puedes registrarte como colaborador y aportar contenido a nuestra comunidad, teniendo en cuenta que siempre debe ser libre de coste, ya que nuestra intención es divulgar conocimiento o si lo prefieres registrate
      como estudiante y aprende sobre el apacionante mundo de la programación de forma 100% gratuita!'
      btnText='Más sobre nosotros'
      urlTo="/about"
       />
    <div className="register-tabs">
    <Box sx={{ width: '100%' }}>
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
          <Tab label="Registrarse como colaborador" icon={<AssignmentIndIcon />} iconPosition="start" />
          <Tab label="Registrarse como estudiante" icon={<CastForEducationIcon />} iconPosition="start" />
        </Tabs>
      </Box>
      <TabPanel value={value} index={0}>
      <Formik
        initialValues={{
            name: "",
            lastName: "",
            email: "",
            password: "",
            userName:"",
            user_rol:"625afee77d7fd9f8faf5c8e5"
        }}
        onSubmit={(values, {resetForm}) => {
          
          const url = `${config.apiUrl}/users/register`

          axios.post(url, values)
              .then(response => {
                console.log(response)
                if(response.ok === false) {
                      setNotify({
                      isOpen: true,
                      title:'Ups!',
                      message: 'Ha habido un error inesperado.',
                      type: 'error'
                  })
                  return
                }
                setNotify({
                  isOpen: true,
                  title:'Exito!',
                  message: 'Usuario registrado correctamente, estas siendo redireccionado al home desde donde podrás acceder con tus datos.',
                  type: 'success'
              })
              setTimeout(() => {
                navigate('/?newuser=true')
              }, 3000)
              })
              .catch(error => console.log('Form submit error', error))
          resetForm()
        }}
        validate={ (values) => {

          let errors = {}

            if(!values.name) {
              errors.nombre = 'El campo nombre no puede estar vacío'
            } 
            if(!values.lastName) {
              errors.lastName = 'El campo apellitos Video no puede estar vacío'
            } 

            if(!values.email) {
              errors.email = 'El campo email es obligatorio.'
            }

            if(!values.password) {
              errors.password = 'El campo contraseña es obligatorio.'
            }

            return errors
        }}
      > 
      {( {values, errors, handleSubmit, handleChange, handleBlur}) => (
            <form onSubmit={handleSubmit} className="rutaForm">
            <label htmlFor="name">Nombre(*):</label>
            <input
              id="name"
              name="name"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
            />
            {errors.nombre && <div className="error">{errors.nombre}</div>}

            <label htmlFor="lastName">Apellidos:</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.lastName}
            />
            {errors.lastName && <div className="error">{errors.lastName}</div>}

            <label htmlFor="email">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
            />
            {errors.email && <div className="error">{errors.email}</div>}

            <label htmlFor="password">Contraseña:</label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
            />
            {errors.password && <div className="error">{errors.password}</div>}             
                     

            <button type="submit" className="primary-btn">Registrarse</button>
          </form>
            )}
      </Formik>
      </TabPanel>
      <TabPanel value={value} index={1}>
      <Formik
        initialValues={{
            name: "",
            lastName: "",
            email: "",
            password: "",
            userName:"",
            user_rol:"625afeee7d7fd9f8faf5c8e7"
        }}
        onSubmit={(values, {resetForm}) => {
          
          const url = `${config.apiUrl}/users/register`

          axios.post(url, values)
              .then(response => {
                console.log(response)
                if(response.ok === false) {
                      setNotify({
                      isOpen: true,
                      title:'Ups!',
                      message: 'Ha habido un error inesperado.',
                      type: 'error'
                  })
                  return
                }
                setNotify({
                  isOpen: true,
                  title:'Exito!',
                  message: 'Usuario registrado correctamente, estas siendo redireccionado al home desde donde podrás acceder con tus datos.',
                  type: 'success'
              })
              setTimeout(() => {
                navigate('/?newuser=true')
              }, 3000)
              })
              .catch(error => console.log('Form submit error', error))
          resetForm()
        }}
        validate={ (values) => {

          let errors = {}

            if(!values.name) {
              errors.nombre = 'El campo nombre no puede estar vacío'
            } 
            if(!values.lastName) {
              errors.lastName = 'El campo Url Video no puede estar vacío'
            } 

            if(!values.email) {
              errors.email = 'El campo email es obligatorio.'
            }

            if(!values.password) {
              errors.password = 'El campo contraseña es obligatorio.'
            }

            return errors
        }}
      > 
      {( {values, errors, handleSubmit, handleChange, handleBlur}) => (
            <form onSubmit={handleSubmit} className="rutaForm">
            <label htmlFor="name">Nombre(*):</label>
            <input
              id="name"
              name="name"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.name}
            />
            {errors.nombre && <div className="error">{errors.nombre}</div>}

            <label htmlFor="lastName">Apellidos:</label>
            <input
              id="lastName"
              name="lastName"
              type="text"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.lastName}
            />
            {errors.lastName && <div className="error">{errors.lastName}</div>}

            <label htmlFor="email">Email:</label>
            <input
              id="email"
              name="email"
              type="email"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.email}
            />
            {errors.email && <div className="error">{errors.email}</div>}

            <label htmlFor="password">Contraseña:</label>
            <input
              id="password"
              name="password"
              type="password"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.password}
            />
            {errors.password && <div className="error">{errors.password}</div>}             
                     

            <button type="submit" className="primary-btn">Registrarse</button>
          </form>
            )}
      </Formik>
      </TabPanel>
    </Box>
    <Notification
            notify={notify}
            setNotify={setNotify}
            />
    </div>
    </>
  )
  }
