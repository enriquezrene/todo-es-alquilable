import * as React from 'react'
import { Link, graphql } from 'gatsby'
import Layout from '../../components/layout'
import Seo from '../../components/seo'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'

const BlogPage = ({ data }) => {
  return (
    <Layout pageTitle="Alquiler de herramientas">
      <div class="row">
        {
          data.allMdx.nodes.map((node) => {
            const image = getImage(node.frontmatter.hero_image)
            return (
              <div class="col-md-3" key={node.id} >
                <div class="card mb-3 shadow-sm">
                  <GatsbyImage class="bd-placeholder-img"
                    image={image}
                    alt={node.frontmatter.hero_image_alt}
                  />
                  <div class="card-body">
                    <p class="card-text">{node.excerpt}</p>
                    <p class="card-text">{node.frontmatter.precio} USD</p>
                    <div class="d-flex justify-content-between align-items-center">
                      <div class="btn-group">
                        <button type="button" class="btn btn-sm btn-outline-secondary">Alquilar</button>
                        <button type="button" class="btn btn-sm btn-outline-secondary">Edit</button>
                      </div>
                      <small>9 min</small>
                    </div>
                  </div>
                </div>
              </div>

            )
          })
        }
      </div>

    </Layout>
  )
}

export const Head = () => <Seo title="My Blog Posts" />

const querysss = graphql`
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

export const query = graphql`
  query {
    allMdx(sort: { frontmatter: { date: DESC }}) {
      nodes {
        frontmatter {
          date(formatString: "MMMM D, YYYY")
          title
          slug
          precio
          hero_image {
            childImageSharp {
              gatsbyImageData(height: 225, layout: CONSTRAINED, placeholder: BLURRED)
            }
          }
        }
        id
        excerpt
      }
    }
  }
`

export default BlogPage