import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Role from '@/models/Role';
import Permission from '@/models/Permission';
import mongoose from 'mongoose';

// Helper function to add CORS headers
function corsResponse(response) {
  response.headers.set('Access-Control-Allow-Origin', '*');
  response.headers.set('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
  return response;
}

// Handle OPTIONS request for CORS preflight
export async function OPTIONS() {
  return corsResponse(new NextResponse(null, { status: 200 }));
}

export async function GET() {
  try {
    await connectDB();
    const roles = await Role.find({})
      .populate('permissions')
      .lean();
    return corsResponse(NextResponse.json(roles || []));
  } catch (error) {
    console.error('API Error:', error);
    return corsResponse(NextResponse.json({ error: error.message }, { status: 500 }));
  }
}

export async function POST(request) {
  try {
    await connectDB();
    const data = await request.json();
    
    // Validate permission IDs
    const permissionIds = data.permissions || [];
    if (!permissionIds.every(id => mongoose.Types.ObjectId.isValid(id))) {
      return corsResponse(NextResponse.json({ 
        error: 'Invalid permission ID format' 
      }, { status: 400 }));
    }

    // Check if permissions exist
    const permissions = await Permission.find({ 
      _id: { $in: permissionIds.map(id => new mongoose.Types.ObjectId(id)) }
    });
    
    if (permissions.length !== permissionIds.length) {
      return corsResponse(NextResponse.json({ 
        error: 'One or more permission IDs are invalid' 
      }, { status: 400 }));
    }

    const role = await Role.create(data);
    const populatedRole = await role.populate('permissions');
    return corsResponse(NextResponse.json(populatedRole));
  } catch (error) {
    console.error('API Error:', error);
    return corsResponse(NextResponse.json({ error: error.message }, { status: 500 }));
  }
} 