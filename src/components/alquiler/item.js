import React from 'react'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'

const Item = ({ node }) => {

  console.log(node, 'node in item.js');
  const image = getImage(node.imagen)
  return (
    <div className="col-md-4">
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
                href={`https://wa.me/${node.telefono}?text=Hola,%20quiero%20alquilar:%20${encodeURIComponent(node.nombre)}-${encodeURIComponent(node.descripcion)}`}
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