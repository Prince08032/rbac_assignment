import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';
import { corsResponse, handleOptions } from '@/utils/cors-response';

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(request) {
  try {
    await connectDB();
    const { email, password } = await request.json();

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return corsResponse(NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      ));
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return corsResponse(NextResponse.json(
        { message: 'Invalid credentials' },
        { status: 401 }
      ));
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    const response = NextResponse.json(
      { message: 'Login successful', user: { id: user._id, email: user.email } },
      { status: 200 }
    );

    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return corsResponse(response);
  } catch (error) {
    console.error('Login error:', error);
    return corsResponse(NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    ));
  }
} 