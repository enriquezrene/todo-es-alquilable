import React, { useState, useRef, useEffect } from 'react'
import { GatsbyImage, getImage } from 'gatsby-plugin-image'

const Item = ({ node }) => {
  const [showModal, setShowModal] = useState(false)
  const modalRef = useRef(null)
  const image = getImage(node.imagen)

  useEffect(() => {
    function handleClickOutside(event) {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        setShowModal(false)
      }
    }
    if (showModal) {
      document.addEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [showModal])

  return (
    <>
      <div className="col-md-4">
        <div className="card mb-4 shadow-sm">
          <GatsbyImage className="bd-placeholder-img"
            image={image}
            alt={node.nombre}
            style={{ maxHeight: 350, margin: '0 auto' }}
          />
          <div className="card-body">
            <p className="card-text">{node.descripcion}{console.log(node.descripcion)}</p>
            <p className="card-text">{node.precio} USD</p>
            <div className="d-flex justify-content-between align-items-center">
              <div className="btn-group">
                <a
                  href={`https://wa.me/${node.telefono}?text=Hola,%20quiero%20alquilar:%20${encodeURIComponent(node.nombre)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-primary"
                >
                  Alquilar
                </a>
                <button
                  className="btn btn-sm btn-info ms-2"
                  onClick={() => setShowModal(true)}
                >
                  Leer Más
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div
          className="modal fade show"
          style={{
            display: 'block',
            background: 'rgba(0,0,0,0.5)',
            position: 'fixed',
            top: 0, left: 0, width: '100vw', height: '100vh',
            zIndex: 50
          }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered" style={{ pointerEvents: 'none' }}>
            <div className="modal-content" ref={modalRef} style={{ pointerEvents: 'auto' }}>
              <div className="modal-header">
                <h5 className="modal-title">{node.nombre}</h5>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}></button>
              </div>
              <div className="modal-body text-center">
                <GatsbyImage image={image} alt={node.nombre} style={{ maxHeight: 350, margin: '0 auto' }} />
                <p className="mt-3"><strong>Descripción:</strong> {node.descripcion_larga || node.descripcion}</p>
                <p><strong>Precio:</strong> {node.precio} USD</p>
                <p><strong>Teléfono:</strong> {node.telefono}</p>
              </div>
              <div className="modal-footer">
                <a
                  href={`https://wa.me/${node.telefono}?text=Hola,%20quiero%20alquilar:%20${encodeURIComponent(node.nombre)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-sm btn-primary"
                >
                  Alquilar
                </a>
                <button className="btn btn-sm btn-secondary" onClick={() => setShowModal(false)}>
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default Item