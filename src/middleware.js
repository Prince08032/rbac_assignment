import { NextResponse } from 'next/server'
import { corsHeaders } from './config/cors'

export function middleware(request) {
  // Check if the request is for an API route
  if (request.nextUrl.pathname.startsWith('/api')) {
    // Handle preflight requests
    if (request.method === 'OPTIONS') {
      return new NextResponse(null, {
        status: 200,
        headers: corsHeaders,
      })
    }

    // Handle actual requests
    const response = NextResponse.next()
    
    // Apply CORS headers from our config
    Object.entries(corsHeaders).forEach(([key, value]) => {
      response.headers.set(key, value)
    })

    return response
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/api/:path*',  // Only match API routes
  ],
} 