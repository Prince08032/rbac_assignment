import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';
import { corsResponse, handleOptions } from '@/utils/cors-response';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const usersWithRole = await User.find({
      roles: id
    }).select('name');

    const isLinked = usersWithRole.length > 0;
    const linkedUsers = usersWithRole.map(user => user.name);

    return corsResponse(NextResponse.json({
      isLinked,
      linkedUsers,
      count: usersWithRole.length
    }));
  } catch (error) {
    console.error('API Error:', error);
    return corsResponse(NextResponse.json({ error: error.message }, { status: 500 }));
  }
} 