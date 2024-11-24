import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Permission from '@/models/Permission';
import { corsResponse, handleOptions } from '@/utils/cors-response';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET() {
  try {
    await connectDB();
    const permissions = await Permission.find({}).lean();
    return corsResponse(NextResponse.json(permissions || []));
  } catch (error) {
    return corsResponse(NextResponse.json({ error: error.message }, { status: 500 }));
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    const permission = await Permission.create(data);
    return corsResponse(NextResponse.json(permission));
  } catch (error) {
    return corsResponse(NextResponse.json({ error: error.message }, { status: 500 }));
  }
} 