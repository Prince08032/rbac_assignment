import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { corsResponse, handleOptions } from '@/utils/cors-response';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET() {
  try {
    await connectDB();
    const users = await User.find({})
      .populate('roles')
      .populate('permissions')
      .lean();
    return corsResponse(NextResponse.json(users || []));
  } catch (error) {
    return corsResponse(NextResponse.json({ error: error.message }, { status: 500 }));
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const userData = await request.json();

    // Always hash password for new users
    if (userData.password) {
      const salt = await bcrypt.genSalt(10);
      userData.password = await bcrypt.hash(userData.password.trim(), salt);
    }

    const user = await User.create(userData);
    const userResponse = { ...user.toObject() };
    delete userResponse.password;
    
    return corsResponse(NextResponse.json(userResponse));
  } catch (error) {
    return corsResponse(NextResponse.json({ error: error.message }, { status: 500 }));
  }
}

export async function PUT(request) {
  try {
    await connectDB();
    const userData = await request.json();
    const { _id, ...updateData } = userData;

    // Find existing user first
    const existingUser = await User.findById(_id);
    if (!existingUser) {
      return corsResponse(NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      ));
    }

    // Create update object with basic fields
    const updateFields = {
      name: updateData.name,
      email: updateData.email,
      roles: updateData.roles,
      status: updateData.status
    };

    // Only update password if it's explicitly provided and not empty
    if (updateData.password && updateData.password.trim().length > 0) {
      const salt = await bcrypt.genSalt(10);
      updateFields.password = await bcrypt.hash(updateData.password.trim(), salt);
    }

    // Update user with new data, but don't modify password if not provided
    const updatedUser = await User.findByIdAndUpdate(
      _id,
      { $set: updateFields }, // Use $set to only update specified fields
      {
        new: true,
        runValidators: true,
        select: '-password'
      }
    ).populate('roles');

    return corsResponse(NextResponse.json(updatedUser));
  } catch (error) {
    console.error('Update error:', error);
    return corsResponse(NextResponse.json(
      { error: error.message },
      { status: 500 }
    ));
  }
} 