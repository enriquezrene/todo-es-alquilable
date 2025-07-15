import * as React from 'react'
import Layout from '../components/layout'
import { StaticImage } from 'gatsby-plugin-image'
import Seo from '../components/seo'

const IndexPage = () => {
  return (
    <Layout>
      <header class="bg-primary text-white py-5">
        <div class="container text-center">
          <h1 class="display-4 fw-bold">Alquila cualquier cosa, en cualquier lugar</h1>
          <p class="lead">Desde herramientas hasta vehículos, encuentra lo que necesitas al instante.</p>
          <a href="/alquiler" class="btn btn-light btn-lg mt-3">Explorar ahora</a>
        </div>
      </header>

      <section class="py-5">
        <div class="container">
          <div class="row g-4">
            <div class="col-md-4 text-center">
              <div class="p-4 border rounded-3 h-100">
                <h3 class="text-primary">🛠️ Fácil</h3>
                <p>Publica o alquila en menos de 2 minutos.</p>
              </div>
            </div>
            <div class="col-md-4 text-center">
              <div class="p-4 border rounded-3 h-100">
                <h3 class="text-primary">💰 Económico</h3>
                <p>Paga solo por el tiempo que usas.</p>
              </div>
            </div>
            <div class="col-md-4 text-center">
              <div class="p-4 border rounded-3 h-100">
                <h3 class="text-primary">🔒 Seguro</h3>
                <p>Transacciones protegidas y perfiles verificados.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="categorias" class="py-5 bg-light">
        <div class="container">
          <h2 class="text-center mb-5">¿Qué necesitas alquilar hoy?</h2>
          <div class="row g-4">
            <div class="col-sm-6 col-lg-3">
              <div class="card h-100">
                <StaticImage src="../images/herramientas.jpg" className="card-img-top" alt="Herramientas" placeholder="blurred"
      layout="constrained"/>
                <div class="card-body">
                  <h5 class="card-title">Herramientas</h5>
                  <p class="card-text">Taladros, soldadoras, generadores y más.</p>
                  <a href="/alquiler" class="btn btn-outline-primary">Ver opciones</a>
                </div>
              </div>
            </div>
            <div class="col-sm-6 col-lg-3">
              <div class="card h-100">
                <StaticImage src="../images/vehiculos.jpg" className="card-img-top" alt="Vehiculos" placeholder="blurred"
      layout="constrained"/>
                <div class="card-body">
                  <h5 class="card-title">Vehículos</h5>
                  <p class="card-text">Carros, motos, bicicletas y furgonetas.</p>
                  <a href="#" class="btn btn-outline-primary">Ver opciones</a>
                </div>
              </div>
            </div>
            <div class="col-sm-6 col-lg-3">
              <div class="card h-100">
                <StaticImage src="../images/events.jpg" className="card-img-top" alt="Eventos" placeholder="blurred"
      layout="constrained"/>
                <div class="card-body">
                  <h5 class="card-title">Eventos</h5>
                  <p class="card-text">Mobiliario, sonido, carpas y decoración.</p>
                  <a href="#" class="btn btn-outline-primary">Ver opciones</a>
                </div>
              </div>
            </div>
            <div class="col-sm-6 col-lg-3">
              <div class="card h-100">
                <StaticImage src="../images/electrodomesticos.jpg" className="card-img-top" alt="Electrodomesticos" placeholder="blurred"
      layout="constrained"/>
                <div class="card-body">
                  <h5 class="card-title">Electrodomésticos</h5>
                  <p class="card-text">Lavadoras, refrigeradoras y más.</p>
                  <a href="#" class="btn btn-outline-primary">Ver opciones</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section class="py-5 text-center">
        <div class="container">
          <h2 class="mb-4">¿Tienes algo para alquilar?</h2>
          <p class="lead mb-4">Gana dinero con lo que ya tienes.</p>
          <a href={`https://wa.me/0998960052?text=Hola,%20quiero%20alquilar%20mis%20artículos`}
                target="_blank" class="btn btn-primary btn-lg px-4">Publicar artículo</a>
        </div>
      </section>
    </Layout>
  )
}

export const Head = () => <Seo title="Home Page" description="Welcome to my Gatsby site!" />

export default IndexPage