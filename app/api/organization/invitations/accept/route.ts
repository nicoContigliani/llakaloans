// app/api/organization/invitations/accept/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { invitationService } from '@/organization-module/services/invitationService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { token, user_id } = body;

    console.log('🔍 Procesando aceptación de invitación:', { 
      token: token ? `${token.substring(0, 10)}...` : 'undefined',
      user_id: user_id ? `${user_id.substring(0, 8)}...` : 'undefined'
    });

    // Validaciones más detalladas
    if (!token) {
      console.log('❌ Token faltante');
      return NextResponse.json(
        { success: false, message: 'Token de invitación es requerido' },
        { status: 400 }
      );
    }

    if (!user_id) {
      console.log('❌ User ID faltante');
      return NextResponse.json(
        { success: false, message: 'ID de usuario es requerido' },
        { status: 400 }
      );
    }

    // Validar formato del token
    if (typeof token !== 'string' || token.length < 10) {
      console.log('❌ Token inválido:', token);
      return NextResponse.json(
        { success: false, message: 'Token de invitación no válido' },
        { status: 400 }
      );
    }

    // Validar formato del user_id
    if (typeof user_id !== 'string' || user_id.length === 0) {
      console.log('❌ User ID inválido:', user_id);
      return NextResponse.json(
        { success: false, message: 'ID de usuario no válido' },
        { status: 400 }
      );
    }

    console.log('✅ Validaciones pasadas, procesando invitación...');

    const result = await invitationService.acceptInvitation(token, user_id);
    
    console.log('📋 Resultado del servicio:', result);

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message,
        company_id: result.company_id,
        company_name: result.company_name
      });
    } else {
      return NextResponse.json(
        { 
          success: false, 
          message: result.message,
          error: result.message
        }, 
        { status: 400 }
      );
    }

  } catch (error: any) {
    console.error('❌ Error aceptando invitación:', error);
    
    // Mensajes de error más específicos
    let errorMessage = 'Error interno del servidor';
    
    if (error.name === 'MongoError') {
      errorMessage = 'Error de base de datos';
    } else if (error.message?.includes('ObjectId')) {
      errorMessage = 'ID de empresa o roles inválidos';
    } else if (error.message) {
      errorMessage = error.message;
    }

    return NextResponse.json(
      { 
        success: false, 
        message: errorMessage,
        error: errorMessage 
      },
      { status: 500 }
    );
  }
}