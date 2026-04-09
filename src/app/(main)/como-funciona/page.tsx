import Link from 'next/link'
import OrdenDeTrabajoButton from '@/features/listings/components/OrdenDeTrabajoButton'

export default function ComoFuncionaPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-50 via-white to-blue-50 px-4 py-12">
      <div className="mx-auto max-w-6xl">
        <div className="mb-12 rounded-[2rem] bg-slate-900 px-8 py-14 text-center text-white shadow-xl">
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-blue-200">
            Alquila con confianza
          </p>
          <h1 className="mx-auto mb-4 max-w-4xl text-4xl font-bold leading-tight md:text-5xl">
            ¿Cómo funciona Todo es Alquilable?
          </h1>
          <p className="mx-auto max-w-3xl text-lg text-slate-200 md:text-xl">
            Conectamos a personas que quieren alquilar y ofrecer artículos en Ecuador con un proceso claro,
            directo y respaldado por una orden de trabajo en PDF que ambas partes pueden firmar.
          </p>
        </div>

        <div className="mb-12 grid gap-8 md:grid-cols-2">
          <div className="rounded-2xl border border-blue-100 bg-white p-8 shadow-lg shadow-blue-100/50">
            <div className="mb-4 text-blue-600">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h3 className="mb-3 text-xl font-semibold text-gray-900">
              Seguridad para arrendador y arrendatario
            </h3>
            <p className="mb-4 text-gray-600">
              Cada alquiler puede formalizarse con una orden de trabajo descargable. Ese PDF permite dejar
              por escrito quién entrega, quién recibe, por cuánto tiempo se alquila el artículo y en qué
              condiciones debe devolverse.
            </p>
            <p className="text-sm font-medium text-blue-600">
              Todo queda claro desde el inicio y eso hace la experiencia más segura para ambas partes.
            </p>
          </div>

          <div className="rounded-2xl border border-emerald-100 bg-white p-8 shadow-lg shadow-emerald-100/50">
            <div className="mb-4 text-emerald-600">
              <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="mb-3 text-xl font-semibold text-gray-900">
              Un proceso simple, humano y directo
            </h3>
            <p className="mb-4 text-gray-600">
              Encuentras el artículo, hablas por WhatsApp con la otra persona, acuerdan valor, tiempo y
              condiciones, y luego descargan el PDF para firmarlo. Sin pagos dentro de la plataforma y sin
              pasos innecesarios.
            </p>
            <p className="text-sm font-medium text-emerald-600">
              Menos fricción, más confianza y acuerdos mejor respaldados.
            </p>
          </div>
        </div>

        <div className="mb-12 rounded-2xl bg-white p-8 shadow-lg">
          <h2 className="mb-6 text-center text-2xl font-bold text-gray-900">
            Así se protege cada alquiler
          </h2>
          
          <div className="mb-8 grid gap-6 md:grid-cols-3">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">1</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Encuentra</h4>
              <p className="text-gray-600 text-sm">
                Explora anuncios, revisa ubicación aproximada y elige el artículo ideal.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">2</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Acuerda</h4>
              <p className="text-gray-600 text-sm">
                Habla por WhatsApp y define precio, tiempo de alquiler, depósito y condiciones.
              </p>
            </div>
            
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-blue-600">3</span>
              </div>
              <h4 className="font-semibold text-gray-900 mb-2">Formaliza</h4>
              <p className="text-gray-600 text-sm">
                Descarguen el PDF, fírmelo ambos y conserven una copia del acuerdo.
              </p>
            </div>
          </div>

          <div className="rounded-xl bg-gradient-to-r from-blue-50 to-cyan-50 p-6">
            <h3 className="mb-3 text-lg font-semibold text-gray-900">
              ¿Por qué esto hace que la experiencia sea más segura?
            </h3>
            <div className="grid gap-4 md:grid-cols-2">
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-700">
                  <strong>Deja evidencia escrita</strong> del acuerdo entre ambas partes.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-700">
                  <strong>Reduce malentendidos</strong> sobre tiempos, estado y devolución.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-700">
                  <strong>Refuerza la seriedad</strong> del alquiler antes de entregar el artículo.
                </p>
              </div>
              <div className="flex items-start gap-3">
                <svg className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
                <p className="text-gray-700">
                  <strong>Protege la operación</strong> sin volver complicado el proceso.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="rounded-2xl bg-white p-8 text-center shadow-lg">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">
            Descarga la orden de trabajo y firma con tranquilidad
          </h2>
          <p className="mb-6 text-gray-600">
            Nuestra recomendación es simple: antes de entregar o recibir un artículo, completen y firmen el
            PDF de orden de trabajo. Así cada transacción queda mejor cubierta y ambas partes saben exactamente
            qué se acordó.
          </p>
          
          <div className="flex flex-col justify-center gap-4 sm:flex-row">
            <OrdenDeTrabajoButton 
              className="justify-center"
              variant="primary"
              size="lg"
            />
            <Link href="/buscar" className="inline-flex items-center px-4 py-2 border border-gray-300 text-base font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
              Explorar Artículos
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
