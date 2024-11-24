import { NextResponse } from 'next/server';

export function corsResponse(response) {
  const allowedOrigin = process.env.NEXT_PUBLIC_FRONTEND_URL || '*';
  
  response.headers.set('Access-Control-Allow-Origin', allowedOrigin);
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie');
  return response;
}

export function handleOptions() {
  return corsResponse(new NextResponse(null, { status: 200 }));
} 