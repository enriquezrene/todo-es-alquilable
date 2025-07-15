import * as React from 'react'
import { graphql } from 'gatsby'
import Layout from '../../components/layout'
import Seo from '../../components/seo'
import Item from '../../components/alquiler/item'
import items from "../../../alquiler/herramientas-construccion/catalogo.json"



const BlogPage = ({ data }) => {
  const titulo = items.titulo;
  const description = items.descripcion;
  return (
    <Layout pageTitle={titulo} description={description}>
      
      <div className="row">
        {
          data.allFile.edges.map((item) => {
            const articulo = buscarArticuloPorNombre(item.node.name);
            const node = {
              frontmatter: {
                hero_image: {
                  childImageSharp: item.node.childImageSharp
                }
              },
              nombre: item.node.name,
              precio: articulo.precio,
              descripcion: articulo.descripcion,
              id: item.node.id
            };
            return <Item key={node.id} node={node} />
          })
        }
      </div>

    </Layout>
  )
}

export const Head = () => <Seo title="My Blog Posts" />

const buscarArticuloPorNombre = (nombre) => {
  const articuloEncontrado = items.articulos.find(item => item.nombre === nombre);
  if (!articuloEncontrado) {
    return { precio: 'N/A', descripcion: 'Descripcion no disponible' };
  }
  return items.articulos.find(item => item.nombre === nombre);
}

export const query = graphql`
  query {
          allFile(
            filter: {extension: {regex: "/(avif)/"}, 
              relativeDirectory: {eq: "herramientas-construccion"}}
          ) {
            edges {
              node {
                id
                name
                childImageSharp{
                  gatsbyImageData(height:225, layout: CONSTRAINED)
                }
              }
            }
          }
        } 
`

export default BlogPage