import * as React from 'react'
import { useStaticQuery, graphql } from 'gatsby'
import {
  container,
  siteTitle,
} from './layout.module.css'


const Layout = ({ pageTitle, children, description }) => {
  const categorias = useStaticQuery(graphql`
    query {
            allMdx {
              nodes {              
                id
                excerpt
                frontmatter {
                  slug
                  titulo
                  descripcion
                  imagen {
                    childImageSharp {
                      gatsbyImageData(height: 225, layout: CONSTRAINED)
                    }
                  }
                }
              }
            }
          }
  `)

  return (
    <>

      <nav className="navbar navbar-expand-lg navbar-dark bg-primary py-3">
        <div className="container">
          <a className="navbar-brand fs-3 fw-bold" href="/">
            <span className="text-white">TODO</span>
            <span className="text-warning">ES</span>
            <span className="text-white">ALQUILABLE</span>
          </a>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarNav">
            <ul className="navbar-nav ms-auto">
              <li className="nav-item mx-2">
                <a className="nav-link text-white fs-5" href="/">
                  Inicio
                </a>
              </li>
              <li className="nav-item dropdown mx-2">
                <a
                  className="nav-link dropdown-toggle text-white fs-5"
                  href="#"
                  id="navbarDropdown"
                  role="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Alquilar
                </a>
                <ul className="dropdown-menu dropdown-menu-dark bg-primary border-0 shadow-lg" aria-labelledby="navbarDropdown">
                  {categorias.allMdx.nodes.map(item => {
                    return (
                      <>
                        <li key={item.id}>
                          <a className="dropdown-item py-2 px-3 text-white hover-custom" href={`/alquiler/${item.frontmatter.slug}`}>
                            <div className="fw-bold">{item.frontmatter.titulo}</div>
                            <small className="text-white-50">{item.frontmatter.descripcion}</small>
                          </a>
                        </li>
                        <li><hr className="dropdown-divider mx-3 my-1 bg-white-25" /></li>
                      </>
                    )
                  })}
                </ul>
              </li>
              <li className="nav-item mx-2">
                <a className="nav-link text-white fs-5" href="/about">
                  Quiénes somos
                </a>
              </li>
            </ul>
            <div className="ms-lg-4 mt-3 mt-lg-0">
              <a
                href={`https://wa.me/+593998960052?text=Hola,%20quiero%20alquilar%20mis%20artículos`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-warning text-primary fw-bold px-4"
              >
                Publicar artículo
              </a>
            </div>
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