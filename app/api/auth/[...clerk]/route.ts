import { ClerkProxy } from '@/clerk-modules';
import { NextRequest } from 'next/server';

export async function GET(request: NextRequest) {
  // Manejar proxy para autenticación
  const proxyResponse = await ClerkProxy.handleAuthProxy(request);
  if (proxyResponse) {
    return proxyResponse;
  }

  return Response.json({ 
    message: 'Clerk Auth API',
    timestamp: new Date().toISOString(),
    endpoint: 'auth'
  });
}

export async function POST(request: NextRequest) {
  const proxyResponse = await ClerkProxy.handleAuthProxy(request);
  if (proxyResponse) {
    return proxyResponse;
  }

  return Response.json({ 
    message: 'Clerk Auth API - POST',
    timestamp: new Date().toISOString() 
  });
}

export async function PUT(request: NextRequest) {
  const proxyResponse = await ClerkProxy.handleAuthProxy(request);
  if (proxyResponse) {
    return proxyResponse;
  }

  return Response.json({ 
    message: 'Clerk Auth API - PUT',
    timestamp: new Date().toISOString() 
  });
}

export async function DELETE(request: NextRequest) {
  const proxyResponse = await ClerkProxy.handleAuthProxy(request);
  if (proxyResponse) {
    return proxyResponse;
  }

  return Response.json({ 
    message: 'Clerk Auth API - DELETE',
    timestamp: new Date().toISOString() 
  });
}