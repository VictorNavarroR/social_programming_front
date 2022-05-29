import React from 'react'
import './PageContent.scss'

export default function PageContent({ title, content }) {
  return (
    <section className="content-text">
        <h2>{ title }</h2>
        <article dangerouslySetInnerHTML={{ __html: content}}>
        </article>
    </section>
  )
}
