import { NextRequest, NextResponse } from 'next/server'
import { construirUrlGoogleMaps } from './construir-url-google-maps'

// Google Maps API proxy to avoid CORS issues
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const endpoint = searchParams.get('endpoint')
  const query = searchParams.get('query')
  const lat = searchParams.get('lat')
  const lng = searchParams.get('lng')
  const address = searchParams.get('address')

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY

  if (!apiKey) {
    return NextResponse.json(
      { error: 'Google Maps API key is not configured' },
      { status: 500 }
    )
  }

  try {
    if (endpoint !== 'place/autocomplete/json' && endpoint !== 'geocode/json') {
      return NextResponse.json(
        { error: 'Invalid endpoint' },
        { status: 400 }
      )
    }

    const url = construirUrlGoogleMaps({
      endpoint,
      apiKey,
      query,
      lat,
      lng,
      address,
    })

    // Make request to Google Maps API
    const response = await fetch(url)
    
    if (!response.ok) {
      throw new Error(`Google Maps API error: ${response.status} ${response.statusText}`)
    }

    const data = await response.json()
    
    // Return the response with proper CORS headers
    return NextResponse.json(data, {
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    })
  } catch (error) {
    console.error('Google Maps proxy error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch from Google Maps API' },
      { 
        status: 500,
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      }
    )
  }
}

// Handle OPTIONS requests for CORS preflight
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  })
}
