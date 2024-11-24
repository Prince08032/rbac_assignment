import { NextResponse } from 'next/server';
import connectDB from '@/lib/mongodb';
import Role from '@/models/Role';

export async function GET(request, { params }) {
  try {
    await connectDB();
    const { id } = params;

    // Find all roles that use this permission
    const rolesWithPermission = await Role.find({
      permissions: id
    }).select('name');

    const isLinked = rolesWithPermission.length > 0;
    const linkedRoles = rolesWithPermission.map(role => role.name);

    return NextResponse.json({
      isLinked,
      linkedRoles,
      count: rolesWithPermission.length
    });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
} 