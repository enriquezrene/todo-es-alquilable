export const construirUrlGoogleMaps = ({
  endpoint,
  apiKey,
  query,
  lat,
  lng,
  address,
}: {
  endpoint: string
  apiKey: string
  query: string | null
  lat: string | null
  lng: string | null
  address: string | null
}) => {
  let url = `https://maps.googleapis.com/maps/api/${endpoint}?key=${apiKey}&language=es&region=EC`

  if (endpoint === 'place/autocomplete/json') {
    if (query) {
      // No limitamos a `types=address` para permitir sectores, parroquias y localidades
      // que Google Maps sí sugiere para búsquedas como "Llano Chico".
      url += `&input=${encodeURIComponent(query)}&components=country:EC`
    }
  } else if (endpoint === 'geocode/json') {
    if (address) {
      url += `&address=${encodeURIComponent(address)}&components=country:EC`
    } else if (lat && lng) {
      url += `&latlng=${lat},${lng}`
    }
  }

  return url
}
