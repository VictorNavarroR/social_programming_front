import React from 'react'
import './Tutorials.scss'
import Tutorials from '../../components/Tutorials/Tutorials'


export default function Tutoriales() {

  return (
    <div className="tutoriales">
      <h2>Tutoriales</h2>
      <Tutorials showTitle={false} />
    </div>
  )
}
