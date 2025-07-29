import * as React from 'react'
import Layout from '../components/layout'
import { graphql } from 'gatsby'
import Seo from '../components/seo'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'

const IndexPage = ({ data }) => {
  return (
    <Layout>
      <header className="bg-primary text-white py-5">
        <div className="container text-center">
          <h1 className="display-4 fw-bold">Alquila cualquier cosa, en cualquier lugar</h1>
          <p className="lead">Desde herramientas hasta vehículos, encuentra lo que necesitas al instante.</p>
          <a href="/alquiler" className="btn btn-light btn-lg mt-3">Explorar ahora</a>
        </div>
      </header>

      <section className="py-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-md-4 text-center">
              <div className="p-4 border rounded-3 h-100">
                <h3 className="text-primary">🛠️ Fácil</h3>
                <p>Publica o alquila en menos de 2 minutos.</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="p-4 border rounded-3 h-100">
                <h3 className="text-primary">💰 Económico</h3>
                <p>Paga solo por el tiempo que usas.</p>
              </div>
            </div>
            <div className="col-md-4 text-center">
              <div className="p-4 border rounded-3 h-100">
                <h3 className="text-primary">🔒 Seguro</h3>
                <p>Transacciones protegidas y perfiles verificados.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="categorias" className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">¿Qué necesitas alquilar hoy?</h2>
          <div className="row g-4">


            {data.allMdx.nodes.map(item => {
              const image = getImage(item.frontmatter.imagen)
              return (
                <div className="col-sm-6 col-lg-3" key={item.id}>
                  <div className="card h-100">
                    <GatsbyImage className="card-img-top" alt={item.frontmatter.titulo} placeholder="blurred"
                      layout="constrained"
                      image={image}
                    />                    
                    <div className="card-body">
                      <h5 className="card-title">{item.frontmatter.titulo}</h5>
                      <p className="card-text">{item.frontmatter.descripcion}</p>
                      <a href={`/alquiler/${item.frontmatter.slug}`} className="btn btn-outline-primary">Ver opciones</a>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="py-5 text-center">
        <div className="container">
          <h2 className="mb-4">¿Tienes algo para alquilar?</h2>
          <p className="lead mb-4">Gana dinero con lo que ya tienes.</p>
          <a href={`https://wa.me/+593998960052?text=Hola,%20quiero%20alquilar%20mis%20artículos`}
            target="_blank" className="btn btn-primary btn-lg px-4">Publicar artículo</a>
        </div>
      </section>
    </Layout>
  )
}



export const query = graphql`
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
  `

export const Head = () => <Seo title="Todo es Alquilable" description="Home Page" />

export default IndexPage