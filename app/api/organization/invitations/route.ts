import { NextRequest, NextResponse } from 'next/server';
import { invitationService } from '@/organization-module/services/invitationService';

// GET - Obtener invitaciones pendientes de una empresa
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const company_id = searchParams.get('company_id');

    if (!company_id) {
      return NextResponse.json(
        { error: 'company_id es requerido' },
        { status: 400 }
      );
    }

    console.log('🔍 Obteniendo invitaciones para empresa:', company_id);
    
    const invitations = await invitationService.getPendingInvitations(company_id);
    
    return NextResponse.json({
      success: true,
      invitations,
      total: invitations.length
    });

  } catch (error: any) {
    console.error('❌ Error obteniendo invitaciones:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}

// POST - Crear y enviar nueva invitación
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, company_id, company_name, role_name, invited_by } = body;

    console.log('📧 Creando y enviando invitación:', { 
      email, 
      company_id, 
      company_name, 
      role_name, 
      invited_by 
    });

    // Validaciones mejoradas con mensajes más específicos
    if (!email) {
      return NextResponse.json(
        { error: 'El email es requerido' },
        { status: 400 }
      );
    }

    if (!company_id) {
      return NextResponse.json(
        { error: 'El ID de empresa es requerido' },
        { status: 400 }
      );
    }

    if (!company_name) {
      return NextResponse.json(
        { error: 'El nombre de la empresa es requerido' },
        { status: 400 }
      );
    }

    if (!role_name) {
      return NextResponse.json(
        { error: 'El rol es requerido' },
        { status: 400 }
      );
    }

    if (!invited_by) {
      return NextResponse.json(
        { error: 'El ID del usuario que invita es requerido' },
        { status: 400 }
      );
    }

    if (!/\S+@\S+\.\S+/.test(email)) {
      return NextResponse.json(
        { error: 'El formato del email no es válido' },
        { status: 400 }
      );
    }

    if (!/^[0-9a-fA-F]{24}$/.test(company_id)) {
      return NextResponse.json(
        { error: 'ID de empresa inválido' },
        { status: 400 }
      );
    }

    const validRoles = ['toor', 'owner', 'admin', 'user', 'guest'];
    if (!validRoles.includes(role_name)) {
      return NextResponse.json(
        { error: 'Rol inválido. Los roles válidos son: toor, owner, admin, user, guest' },
        { status: 400 }
      );
    }

    // Usar el método unificado que crea Y envía
    const result = await invitationService.createAndSendInvitation({
      email,
      company_id,
      company_name,
      role_name,
      invited_by
    });

    if (result.success) {
      console.log('✅ Proceso completo exitoso:', result.invitation?._id);
      
      return NextResponse.json({
        success: true,
        message: result.message,
        invitation: result.invitation ? {
          id: result.invitation._id,
          email: result.invitation.email,
          expires_at: result.invitation.expires_at,
          company_name: result.invitation.company_name,
          role_name: result.invitation.role_name
        } : undefined
      });
    } else {
      console.error('❌ Error en el proceso:', result.message);
      
      // Si la invitación se creó pero falló el email, igual retornar éxito parcial
      if (result.invitation) {
        return NextResponse.json({
          success: false,
          message: 'Invitación creada pero error enviando email. Puedes reenviarlo más tarde.',
          invitation: {
            id: result.invitation._id,
            email: result.invitation.email,
            expires_at: result.invitation.expires_at
          }
        }, { status: 207 }); // Status 207 - Multi-Status
      } else {
        return NextResponse.json(
          { success: false, error: result.message },
          { status: 500 }
        );
      }
    }

  } catch (error: any) {
    console.error('❌ Error creando invitación:', error);
    
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Error interno del servidor' 
      },
      { status: 500 }
    );
  }
}