export type FormularioRegistro = {
  email: string
  password: string
  confirmPassword: string
  displayName: string
  phone: string
  province: string
  city: string
  address: string
}

export type FormularioLogin = {
  email: string
  password: string
}

export type FormularioRecuperarContrasena = {
  email: string
}

export type ErroresFormulario = Record<string, string>
