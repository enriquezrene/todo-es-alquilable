import * as React from 'react'
import { Link, useStaticQuery, graphql } from 'gatsby'
import {
  container,
  heading,
  navLinks,
  navLinkItem,
  navLinkText,
  siteTitle,
} from './layout.module.css'


const Layout = ({ pageTitle, children }) => {
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
          <a className="navbar-brand" href="/">TechnicalXpress</a>
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
                <a className="nav-link" href="/alquiler">Alquiler de herramientas</a>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="/about">Venta de andamios</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>

      <div className={container}>
        <header className={siteTitle}></header>
        <p>
          Te ofrecemos una amplia variedad de herramientas para todo tipo de tareas. Sin salir de tu hogar o proyecto, podrás recibir las herramientas que necesitas en solo 24 horas. ¡El transporte es completamente GRATIS, excepto para el alquiler de andamios! Llámanos al 0998960052 / 0984480673 y obtén lo que necesitas ya!
        </p>
        <main>
          <h1 className={heading}>{pageTitle}</h1>
          {children}
        </main>
      </div>
    </>
  )
}

export default Layout