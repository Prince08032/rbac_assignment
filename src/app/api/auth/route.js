import { apiResponse } from '@/utils/api-response';

export async function GET(request) {
  return apiResponse({ message: "API is working" });
}

export async function POST(request) {
  try {
    const body = await request.json();
    return apiResponse({ message: "Data received", data: body });
  } catch (error) {
    return apiResponse({ error: error.message }, 400);
  }
}

export async function OPTIONS(request) {
  return apiResponse(null, 204);
} 