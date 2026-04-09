/**
 * Google Maps Configuration
 * Uses the latest Dynamic Library Import API
 */

type WindowWithGoogleMaps = Window & {
  google?: {
    maps?: {
      importLibrary: (library: string) => Promise<unknown>
    }
  }
}

// Global configuration for Google Maps
export const GOOGLE_MAPS_CONFIG = {
  defaultCenter: {
    lat: -0.1807, // Quito, Ecuador
    lng: -78.4678
  },
  defaultZoom: 12,
  ecuadorBounds: {
    north: 2.0,
    south: -5.0,
    east: -75.0,
    west: -81.0
  },
  // Note: mapId removed to allow inline styling
  language: 'es',
  region: 'EC'
} as const

// Check if Google Maps API key is configured
export const isGoogleMapsConfigured = (): boolean => {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY
  return Boolean(apiKey && apiKey.length > 0)
}

// Get API key
export const getGoogleMapsApiKey = (): string => {
  return process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ''
}

// Initialize Google Maps with bootstrap loader
export const initializeGoogleMaps = (): void => {
  if (!isGoogleMapsConfigured()) {
    console.warn('Google Maps API key is not configured. Location features will be disabled.')
    return
  }

  // Add bootstrap loader to global scope
  const bootstrapScript = `(g=>{var h,a,k,p="The Google Maps JavaScript API",c="google",l="importLibrary",q="__ib__",m=document,b=window;b=b[c]||(b[c]={});var d=b.maps||(b.maps={}),r=new Set,e=new URLSearchParams,u=()=>h||(h=new Promise(async(f,n)=>{await (a=m.createElement("script"));e.set("libraries",[...r]+"");for(k in g)e.set(k.replace(/[A-Z]/g,t=>"_"+t[0].toLowerCase()),g[k]);e.set("callback",c+".maps."+q);a.src=\`https://maps.\${c}apis.com/maps/api/js?\`+e;d[q]=f;a.onerror=()=>h=n(Error(p+" could not load."));a.nonce=m.querySelector("script[nonce]")?.nonce||"";m.head.append(a)}));d[l]?console.warn(p+" only loads once. Ignoring:",g):d[l]=(f,...n)=>r.add(f)&&u().then(()=>d[l](f,...n))})({
    key: "${getGoogleMapsApiKey()}",
    v: "weekly",
    language: "${GOOGLE_MAPS_CONFIG.language}",
    region: "${GOOGLE_MAPS_CONFIG.region}"
  });`

  // Execute bootstrap script
  try {
    eval(bootstrapScript)
  } catch (error) {
    console.error('Failed to initialize Google Maps:', error)
  }
}

// Type definitions for Google Maps
export interface GoogleMapsInstance {
  Map: typeof google.maps.Map
  Marker: typeof google.maps.Marker
  InfoWindow: typeof google.maps.InfoWindow
  Animation: typeof google.maps.Animation
  Size: typeof google.maps.Size
  Point: typeof google.maps.Point
}

type GoogleMapsLibraryName = 'maps' | 'marker'

type GoogleMapsLibraryMap = {
  maps: Pick<GoogleMapsInstance, 'Map'>
  marker: Pick<GoogleMapsInstance, 'Marker'>
}

// Load Google Maps library dynamically
export const loadGoogleMapsLibrary = async <T extends GoogleMapsLibraryName>(
  library: T,
): Promise<GoogleMapsLibraryMap[T]> => {
  if (!isGoogleMapsConfigured()) {
    throw new Error('Google Maps API key is not configured')
  }

  try {
    const windowWithGoogleMaps = window as WindowWithGoogleMaps
    const importLibrary = windowWithGoogleMaps.google?.maps?.importLibrary

    if (!importLibrary) {
      throw new Error('Google Maps importLibrary is not available')
    }

    return await importLibrary(library) as GoogleMapsLibraryMap[T]
  } catch (error) {
    console.error(`Failed to load Google Maps library: ${library}`, error)
    throw error
  }
}

// Initialize Google Maps if not already done
if (typeof window !== 'undefined' && !(window as WindowWithGoogleMaps).google?.maps) {
  initializeGoogleMaps()
}
