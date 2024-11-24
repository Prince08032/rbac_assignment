import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    // Find all users that have this role
    const usersWithRole = await User.find({
      roles: id
    }).select('name');

    const isLinked = usersWithRole.length > 0;
    const linkedUsers = usersWithRole.map(user => user.name);

    return NextResponse.json({
      isLinked,
      linkedUsers,
      count: usersWithRole.length
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 