import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Role from '@/models/Role';
import { corsResponse, handleOptions } from '@/utils/cors-response';

export async function OPTIONS() {
  return handleOptions();
}

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    const rolesWithPermission = await Role.find({
      permissions: id
    }).select('name');

    const isLinked = rolesWithPermission.length > 0;
    const linkedRoles = rolesWithPermission.map(role => role.name);

    return corsResponse(NextResponse.json({
      isLinked,
      linkedRoles,
      count: rolesWithPermission.length
    }));
  } catch (error) {
    console.error('API Error:', error);
    return corsResponse(NextResponse.json({ error: error.message }, { status: 500 }));
  }
} 