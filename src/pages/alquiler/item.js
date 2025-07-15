import React from 'react'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'

const Item = ({ node }) => {
  const image = getImage(node.frontmatter.hero_image)
  return (
    <div className="col-md-4" key={node.id} >
      <div className="card mb-4 shadow-sm">
        <GatsbyImage className="bd-placeholder-img"
          image={image}
          alt={node.nombre}
        />
        <div className="card-body">
          <p className="card-text">{node.descripcion}</p>
          <p className="card-text">{node.precio} USD</p>
          <div className="d-flex justify-content-between align-items-center">
            <div className="btn-group">
              <a
                href={`https://wa.me/0998960052?text=Hola,%20quiero%20alquilar%20${encodeURIComponent(node.descripcion)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-sm btn-outline-primary"
              >
                Alquilar
              </a>
            </div>
            <small>9 min</small>
          </div>
        </div>
      </div>
    </div>
  )
}


export default Item;