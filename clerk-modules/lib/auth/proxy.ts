import { NextRequest } from 'next/server';
import { ProxyUtils } from '../../utils/proxy-utils';

export class ClerkProxy {
  static async handleAuthProxy(request: NextRequest) {
    const pathname = request.nextUrl.pathname;
    
    // Manejar rutas de API de auth
    if (ProxyUtils.shouldHandleAuth(pathname)) {
      return this.handleAuthApi(request);
    }

    return null;
  }

  private static async handleAuthApi(request: NextRequest) {
    const { searchParams } = new URL(request.url);
    const action = searchParams.get('action');

    try {
      switch (action) {
        case 'health':
          return Response.json({ 
            status: 'ok',
            message: 'Clerk auth proxy active',
            timestamp: new Date().toISOString() 
          });
        
        default:
          return Response.json({ 
            message: 'Clerk auth proxy',
            availableActions: ['health'],
            timestamp: new Date().toISOString() 
          });
      }
    } catch (error) {
      console.error('Auth proxy error:', error);
      return Response.json(
        { error: 'Authentication proxy failed' },
        { status: 500 }
      );
    }
  }
}