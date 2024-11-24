import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { corsResponse, handleOptions } from '@/utils/cors-response';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return corsResponse(NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      ));
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    
    return corsResponse(NextResponse.json(
      { message: 'Authenticated' },
      { status: 200 }
    ));
  } catch (error) {
    return corsResponse(NextResponse.json(
      { message: 'Not authenticated' },
      { status: 401 }
    ));
  }
} 