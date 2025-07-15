import * as React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import {
  container,
  siteTitle,
} from './layout.module.css'


const Layout = ({ pageTitle, children, description }) => {
  const data = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          title
        }
      }
    }
  `)

  return (
    <>
      <nav className="navbar navbar-expand-lg navbar-dark bg-dark">
        <div className="container">
          <a className="navbar-brand" href="/">TODO ES ALQUILABLE</a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav me-auto">
              <li className="nav-item">
                <a className="nav-link" href="/">Inicio</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/alquiler">Alquiler</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/about">Quienes somos</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <main role="main">

        <section className="jumbotron text-center">
          <div className="container">
            <header className={siteTitle}>{pageTitle}</header>
            <p className="lead text-muted">{description}</p>
          </div>
        </section>
      </main>
      <div className={container}>
        <main>
          {children}
        </main>
      </div>
    </>
  )
}

export default Layout