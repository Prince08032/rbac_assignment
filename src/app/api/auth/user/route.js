import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { cookies } from 'next/headers';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';
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
    await connectDB();
    
    const user = await User.findById(decoded.userId)
      .select('-password')
      .populate('roles');

    if (!user) {
      return corsResponse(NextResponse.json(
        { message: 'User not found' },
        { status: 404 }
      ));
    }

    return corsResponse(NextResponse.json(user));
  } catch (error) {
    return corsResponse(NextResponse.json(
      { message: 'Not authenticated' },
      { status: 401 }
    ));
  }
} 