import React from 'react'
import { useNavigate } from "react-router-dom";
import './Banner.scss'

export default function Banner({ title, subtitle, content, btnText, urlTo }) {
  const navigate = useNavigate();
  return (
    <section className="intro">
                <h1 dangerouslySetInnerHTML={{ __html: title}}></h1>
                <small>{ subtitle }</small>
                <p dangerouslySetInnerHTML={{ __html: content}}></p>
                <a className="intro-btn">
                <button className="primary-btn" onClick={() => navigate(urlTo)}>
                    { btnText }
                    <i className="fas fa-chevron-right"></i>
                </button>
                </a>
                <img src="../assets/intro.jpg" alt="fondo intro" /> 
    </section>
  )
}
