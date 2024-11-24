import { NextResponse } from 'next/server';
import { corsHeaders } from '@/config/cors';

export function apiResponse(data, status = 200) {
  return NextResponse.json(data, {
    status,
    headers: corsHeaders
  });
} 