export type Provincia = {
  nombre: string
  ciudades: string[]
}

export const provinciasEcuador: Provincia[] = [
  { nombre: 'Azuay', ciudades: ['Cuenca', 'Gualaceo', 'Paute', 'Sigsig', 'Santa Isabel'] },
  { nombre: 'Bolívar', ciudades: ['Guaranda', 'San Miguel', 'Chillanes', 'Chimbo', 'Echeandía'] },
  { nombre: 'Cañar', ciudades: ['Azogues', 'Cañar', 'La Troncal', 'Biblián', 'El Tambo'] },
  { nombre: 'Carchi', ciudades: ['Tulcán', 'San Gabriel', 'El Ángel', 'Mira', 'Bolívar'] },
  { nombre: 'Chimborazo', ciudades: ['Riobamba', 'Alausí', 'Guano', 'Colta', 'Chambo'] },
  { nombre: 'Cotopaxi', ciudades: ['Latacunga', 'La Maná', 'Salcedo', 'Saquisilí', 'Pujilí'] },
  { nombre: 'El Oro', ciudades: ['Machala', 'Santa Rosa', 'Pasaje', 'Huaquillas', 'El Guabo'] },
  { nombre: 'Esmeraldas', ciudades: ['Esmeraldas', 'Atacames', 'Quinindé', 'San Lorenzo', 'Muisne'] },
  { nombre: 'Galápagos', ciudades: ['Puerto Baquerizo Moreno', 'Puerto Ayora', 'Puerto Villamil'] },
  { nombre: 'Guayas', ciudades: ['Guayaquil', 'Durán', 'Milagro', 'Daule', 'Samborondón', 'Playas'] },
  { nombre: 'Imbabura', ciudades: ['Ibarra', 'Otavalo', 'Cotacachi', 'Antonio Ante', 'Pimampiro'] },
  { nombre: 'Loja', ciudades: ['Loja', 'Catamayo', 'Cariamanga', 'Macará', 'Vilcabamba'] },
  { nombre: 'Los Ríos', ciudades: ['Babahoyo', 'Quevedo', 'Vinces', 'Ventanas', 'Buena Fe'] },
  { nombre: 'Manabí', ciudades: ['Portoviejo', 'Manta', 'Chone', 'Jipijapa', 'Montecristi', 'Bahía de Caráquez'] },
  { nombre: 'Morona Santiago', ciudades: ['Macas', 'Gualaquiza', 'Sucúa', 'Palora', 'Limón Indanza'] },
  { nombre: 'Napo', ciudades: ['Tena', 'Archidona', 'El Chaco', 'Quijos', 'Carlos Julio Arosemena Tola'] },
  { nombre: 'Orellana', ciudades: ['Francisco de Orellana', 'La Joya de los Sachas', 'Loreto', 'Aguarico'] },
  { nombre: 'Pastaza', ciudades: ['Puyo', 'Mera', 'Santa Clara', 'Arajuno'] },
  { nombre: 'Pichincha', ciudades: ['Quito', 'Sangolquí', 'Cayambe', 'Machachi', 'San Miguel de los Bancos'] },
  { nombre: 'Santa Elena', ciudades: ['Santa Elena', 'La Libertad', 'Salinas'] },
  { nombre: 'Santo Domingo de los Tsáchilas', ciudades: ['Santo Domingo', 'La Concordia'] },
  { nombre: 'Sucumbíos', ciudades: ['Nueva Loja', 'Shushufindi', 'Gonzalo Pizarro', 'Cascales'] },
  { nombre: 'Tungurahua', ciudades: ['Ambato', 'Baños de Agua Santa', 'Pelileo', 'Píllaro', 'Cevallos'] },
  { nombre: 'Zamora-Chinchipe', ciudades: ['Zamora', 'Yantzaza', 'Zumba', 'El Pangui', 'Centinela del Cóndor'] },
]

export function obtenerCiudadesPorProvincia(nombreProvincia: string): string[] {
  const provincia = provinciasEcuador.find((p) => p.nombre === nombreProvincia)
  return provincia?.ciudades ?? []
}

export function obtenerNombresProvincias(): string[] {
  return provinciasEcuador.map((p) => p.nombre)
}
