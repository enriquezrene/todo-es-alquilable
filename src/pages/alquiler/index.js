import * as React from 'react'

import { graphql } from 'gatsby'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'
import Layout from '../../components/layout'
import Seo from '../../components/seo'

const IndexPage = ({ data }) => {
  return (
    <Layout>
      <section id="categorias" className="py-5 bg-light">
        <div className="container">
          <h2 className="text-center mb-5">¿Qué necesitas alquilar hoy...?</h2>
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

export const Head = () => <Seo title="Home Page" description="Welcome to my Gatsby site!" />

export default IndexPage