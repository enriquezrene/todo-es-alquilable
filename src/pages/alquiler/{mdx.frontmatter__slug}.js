import * as React from 'react'
import Layout from '../../components/layout'
import Item from '../../components/alquiler/item'
import Seo from '../../components/seo'
import { graphql } from 'gatsby'

const BlogPost = ({ data }) => {
    const titulo = data.mdx.frontmatter.titulo;
    const description = data.mdx.frontmatter.descripcion;
    return (
        <Layout pageTitle={titulo} description={description}>
            <div className="row">
                {
                    data.mdx.frontmatter.items.map((item) => {                        
                        return <Item key={item.nombre} node={item} />
                    })
                }
            </div>

        </Layout>
    )
}

export const Head = ({ data }) => <Seo title={data.mdx.frontmatter.titulo} />

export const query = graphql`
    query ($id: String) {
        mdx(id: {eq: $id}) {
            frontmatter {
                titulo
                descripcion
                items {
                    precio
                    descripcion
                    nombre
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

export default BlogPost