import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Permission from '@/models/Permission';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const data = await request.json();
    const permission = await Permission.findByIdAndUpdate(id, data, { new: true });
    return NextResponse.json(permission);
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    await Permission.findByIdAndDelete(id);
    return NextResponse.json({ message: 'Permission deleted successfully' });
  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 