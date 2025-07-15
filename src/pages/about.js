import * as React from 'react'
import Layout from '../components/layout'
import Seo from '../components/seo'
import { StaticImage } from 'gatsby-plugin-image'

const AboutPage = () => {
  return (
    <Layout>
      <div className="container py-5">
  {/* Hero Section */}
  <section className="text-center bg-light p-5 rounded-3 mb-5">
    <h1 className="display-4 fw-bold text-primary">Conoce nuestra historia</h1>
    <p className="lead">La plataforma que está revolucionando el alquiler entre particulares</p>
  </section>

  {/* Misión y Visión */}
  <div className="row g-4 mb-5">
    <div className="col-lg-6">
      <div className="p-4 border rounded-3 h-100">
        <h2 className="text-primary mb-4">🏆 Nuestra Misión</h2>
        <p className="fs-5">
          En <strong>Todo es AlquILABLE</strong>, queremos democratizar el acceso a bienes y servicios, 
          permitiendo que cualquier persona pueda <span className="text-warning">alquilar lo que necesite</span> o 
          <span className="text-warning"> monetizar lo que ya tiene</span>, de forma segura y sencilla.
        </p>
      </div>
    </div>
    <div className="col-lg-6">
      <div className="p-4 border rounded-3 h-100">
        <h2 className="text-primary mb-4">🚀 Nuestra Visión</h2>
        <p className="fs-5">
          Ser la plataforma líder en economía colaborativa en Latinoamérica, 
          <strong> reduciendo el consumo innecesario</strong> y promoviendo un modelo 
          más sostenible y comunitario.
        </p>
      </div>
    </div>
  </div>

  {/* Historia */}
  <section className="mb-5">
    <h2 className="text-center text-primary mb-4">📜 Nuestra Historia</h2>
    <div className="bg-light p-4 p-md-5 rounded-3">
      <p className="fs-5">
        Todo comenzó en 2023, cuando nuestro fundador <strong>Juan Pérez</strong> intentó alquilar 
        una herramienta para reparar su casa y descubrió lo complicado que era. 
        Así nació <span className="text-primary fw-bold">Todo es AlquILABLE</span>: una solución tecnológica 
        que conecta a personas reales para <span className="text-warning">compartir recursos</span> y 
        <span className="text-warning"> generar oportunidades</span>.
      </p>
    </div>
  </section>

  {/* Equipo */}
  <section className="mb-5">
    <h2 className="text-center text-primary mb-4">👥 Conoce al Equipo</h2>
    <div className="row g-4">
      <div className="col-md-4">
        <div className="card h-100 border-0 shadow-sm">
          <StaticImage src="../images/fundador.jpg" className="card-img-top rounded-circle p-4" 
            alt="Fundador"/>
          <div className="card-body text-center">
            <h5 className="text-primary">Juan Pérez</h5>
            <p className="text-muted">Fundador & CEO</p>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card h-100 border-0 shadow-sm">
          <StaticImage src="../images/cto.jpg" className="card-img-top rounded-circle p-4" 
            alt="Fundador"/>
          <div className="card-body text-center">
            <h5 className="text-primary">María Gómez</h5>
            <p className="text-muted">CTO</p>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card h-100 border-0 shadow-sm">
          <StaticImage src="../images/fundador.jpg" className="card-img-top rounded-circle p-4" 
            alt="CMO"/>
          <div className="card-body text-center">
            <h5 className="text-primary">Carlos Rojas</h5>
            <p className="text-muted">CMO</p>
          </div>
        </div>
      </div>
    </div>
  </section>

  {/* CTA Final */}
  <section className="text-center bg-primary text-white p-5 rounded-3">
    <h2 className="mb-4">¿Listo para unirte a la comunidad?</h2>
    <a href={`https://wa.me/0998960052?text=Hola,%20quiero%20alquilar%20mis%20artículos`}
                target="_blank" className="btn btn-warning btn-lg px-4 fw-bold">
      Regístrate gratis
    </a>
  </section>
</div>
    </Layout>
  )
}

export const Head = () => <Seo title="About me" description="Welcome to my Gatsby site!" />

export default AboutPage