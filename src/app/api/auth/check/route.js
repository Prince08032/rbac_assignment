import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = cookieStore.get('token');

    if (!token) {
      return NextResponse.json(
        { message: 'Not authenticated' },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token.value, process.env.JWT_SECRET);
    
    return NextResponse.json(
      { message: 'Authenticated' },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: 'Not authenticated' },
      { status: 401 }
    );
  }
} 