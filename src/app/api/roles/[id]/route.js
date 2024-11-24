import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Role from '@/models/Role';
import Permission from '@/models/Permission';
import mongoose from 'mongoose';

export async function PUT(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const data = await request.json();

    // Validate permission IDs
    const permissionIds = data.permissions || [];
    if (!permissionIds.every(id => mongoose.Types.ObjectId.isValid(id))) {
      return NextResponse.json({ 
        error: 'Invalid permission ID format' 
      }, { status: 400 });
    }

    // Check if permissions exist
    const permissions = await Permission.find({ 
      _id: { $in: permissionIds.map(id => new mongoose.Types.ObjectId(id)) }
    });
    
    if (permissions.length !== permissionIds.length) {
      return NextResponse.json({ 
        error: 'One or more permission IDs are invalid' 
      }, { status: 400 });
    }

    const role = await Role.findByIdAndUpdate(
      id, 
      data, 
      { new: true, runValidators: true }
    ).populate('permissions');

    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    return NextResponse.json(role);
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(request, { params }) {
  try {
    await connectDB();
    const { id } = params;
    const role = await Role.findByIdAndDelete(id);
    
    if (!role) {
      return NextResponse.json({ error: 'Role not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Role deleted successfully' });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 