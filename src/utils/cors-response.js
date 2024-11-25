import { NextResponse } from 'next/server';

export function corsResponse(response) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Credentials', 'true');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS, PATCH');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type, Authorization, Cookie, X-Requested-With');
  response.headers.set('Access-Control-Expose-Headers', 'Set-Cookie');
  return response;
}

export function handleOptions() {
  const response = new NextResponse(null, { status: 200 });
  return corsResponse(response);
} 