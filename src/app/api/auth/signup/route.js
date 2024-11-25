import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import User from '@/models/User';
import connectDB from '@/lib/mongodb';
import { corsResponse, handleOptions } from '@/utils/cors-response';

export async function OPTIONS() {
  return handleOptions();
}

export async function POST(request) {
  try {
    await connectDB();
    const { name, email, password } = await request.json();

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return corsResponse(NextResponse.json(
        { message: 'User already exists' },
        { status: 400 }
      ));
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = new User({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    return corsResponse(NextResponse.json(
      { message: 'User created successfully' },
      { status: 201 }
    ));
  } catch (error) {
    console.error('Signup error:', error);
    return corsResponse(NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    ));
  }
} 