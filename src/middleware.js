import { NextResponse } from 'next/server'

export function middleware(request) {
  const response = NextResponse.next()

  // Add CORS headers - allowing all origins
  response.headers.set('Access-Control-Allow-Origin', '*')
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  response.headers.set('Access-Control-Allow-Credentials', 'true')

  return response
}

// Updated matcher to include all routes
export const config = {
  matcher: [
    '/api/:path*',  // Match all API routes
    '/((?!_next/static|_next/image|favicon.ico).*)', // Match all routes except Next.js static files
  ],
} 