import Container from './Container'

export default function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="border-t border-gray-200 bg-gray-50 py-8">
      <Container>
        <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="text-sm text-gray-500">
            &copy; {currentYear} Todo es Alquilable. Todos los derechos reservados.
          </p>
          <div className="flex gap-6">
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
              Términos
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
              Privacidad
            </a>
            <a href="#" className="text-sm text-gray-500 hover:text-gray-700">
              Contacto
            </a>
          </div>
        </div>
      </Container>
    </footer>
  )
}
