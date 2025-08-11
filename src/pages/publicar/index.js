import * as React from 'react'
import Seo from '../../components/seo'
import Layout from '../../components/layout'

const AboutPage = () => {
  return (
    <Layout>
      <div className="container py-5">
        {/* Hero Section */}
        <section className="text-center bg-light p-5 rounded-3 mb-5">
          <h1 className="display-4 fw-bold text-primary">Guía para Publicar tus Artículos</h1>
          <p className="lead">Protegemos cada transacción con nuestro sistema de seguridad verificado</p>
        </section>

        {/* Proceso Seguro */}
        <div className="row g-4 mb-5">
          <div className="col-lg-6">
            <div className="p-4 border rounded-3 h-100">
              <h2 className="text-primary mb-4">🛡️ Seguridad Primero</h2>
              <p className="fs-5">
                Nuestros <strong>asesores especializados</strong> te guiarán paso a paso para:
              </p>
              <ul className="fs-5">
                <li>Verificar la autenticidad de los artículos</li>
                <li>Establecer términos de alquiler seguros</li>
                <li>Configurar métodos de pago protegidos</li>
                <li>Crear acuerdos legales básicos</li>
              </ul>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="p-4 border rounded-3 h-100">
              <h2 className="text-primary mb-4">📱 Inicia el Proceso</h2>
              <div className="d-flex flex-column align-items-center">

                <p className="fs-5 text-center mb-4">
                  <strong>Haz clic en el botón verde</strong> para contactar a nuestro equipo via WhatsApp.
                  Te asignaremos un asesor personalizado en menos de 15 minutos.
                </p>
                <a
                  href={`https://wa.me/+593998960052?text=Hola,%20quiero%20publicar%20mis%20artículos%20para%20alquiler`}
                  target="_blank"
                  className="btn btn-success btn-lg px-5 fw-bold"
                  style={{ backgroundColor: '#25D366', borderColor: '#25D366' }}
                >
                  <i className="bi bi-whatsapp me-2"></i> Contactar por WhatsApp
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Pasos Detallados */}
        <section className="mb-5">
          <h2 className="text-center text-primary mb-4">📝 Proceso de Publicación</h2>
          <div className="bg-light p-4 p-md-5 rounded-3">
            <div className="row g-4">
              <div className="col-md-4">
                <div className="text-center p-3">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                    <span className="fs-3">1</span>
                  </div>
                  <h4 className="text-primary">Contacto Inicial</h4>
                  <p>Nuestro asesor validará tus datos básicos y necesidades</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-center p-3">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                    <span className="fs-3">2</span>
                  </div>
                  <h4 className="text-primary">Verificación</h4>
                  <p>Documentación del artículo y acuerdo de términos</p>
                </div>
              </div>
              <div className="col-md-4">
                <div className="text-center p-3">
                  <div className="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-3" style={{ width: '60px', height: '60px' }}>
                    <span className="fs-3">3</span>
                  </div>
                  <h4 className="text-primary">Publicación</h4>
                  <p>Configuración de precios, disponibilidad y fotos profesionales</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Garantías */}
        <section className="mb-5">
          <h2 className="text-center text-primary mb-4">✅ Nuestras Garantías</h2>
          <div className="row g-4">
            <div className="col-md-4">
              <div className="p-4 border rounded-3 h-100 text-center">
                <i className="bi bi-shield-check text-primary fs-1 mb-3"></i>
                <h4>Protección de Datos</h4>
                <p>Tus datos personales están cifrados y protegidos</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 border rounded-3 h-100 text-center">
                <i className="bi bi-cash-coin text-primary fs-1 mb-3"></i>
                <h4>Pagos Seguros</h4>
                <p>Sistema de depósitos en garantía verificados</p>
              </div>
            </div>
            <div className="col-md-4">
              <div className="p-4 border rounded-3 h-100 text-center">
                <i className="bi bi-people text-primary fs-1 mb-3"></i>
                <h4>Asesoría 24/7</h4>
                <p>Soporte humano disponible en cualquier momento</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Final */}
        <section className="text-center bg-primary text-white p-5 rounded-3">
          <h2 className="mb-4">¿Listo para empezar a generar ingresos?</h2>
          <p className="lead mb-4">Nuestro equipo te espera para guiarte personalmente</p>
          <a
            href={`https://wa.me/+593998960052?text=Hola,%20quiero%20asesoría%20para%20publicar%20mis%20artículos`}
            target="_blank"
            className="btn btn-light btn-lg px-4 fw-bold"
          >
            <i className="bi bi-whatsapp text-success me-2"></i> Comenzar ahora
          </a>
        </section>
      </div>
    </Layout>
  )
}

export const Head = () => <Seo title="Todo es Alquilable" description="Quienes somos!!!" />

export default AboutPage