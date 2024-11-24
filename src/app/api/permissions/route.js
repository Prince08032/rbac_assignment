import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Permission from '@/models/Permission';

export async function GET() {
  try {
    await connectDB();
    const permissions = await Permission.find({}).lean();
    return NextResponse.json(permissions || []);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const permission = await Permission.create(data);
    return NextResponse.json(permission);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 