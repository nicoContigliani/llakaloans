// app/api/organization/users/[id]/status/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { companyService, userService } from '@/organization-module';
import { toRoleNames } from '@/organization-module/types/organization';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: userId } = await params;
    const body = await request.json();
    const { company_id, status, current_user_id, current_roles } = body;

    console.log('🔄 PUT /api/organization/users/[id]/status - Actualizando estado:', {
      userId, company_id, status, current_user_id
    });

    if (!company_id || !status || !current_user_id) {
      return NextResponse.json(
        { error: 'company_id, status y current_user_id son requeridos' },
        { status: 400 }
      );
    }

    // Validar que el status sea válido
    if (!['active', 'suspended'].includes(status)) {
      return NextResponse.json(
        { error: 'Status debe ser "active" o "suspended"' },
        { status: 400 }
      );
    }

    // Obtener roles del usuario actual
    const currentUserRoles = await companyService.getUserCompanyRoles(current_user_id, company_id);
    const validCurrentUserRoles = toRoleNames(currentUserRoles);

    console.log('👤 Roles usuario actual:', validCurrentUserRoles);

    // Actualizar estado del usuario
    const success = await userService.updateUserStatus(
      userId,
      company_id,
      status,
      validCurrentUserRoles
    );

    if (!success) {
      return NextResponse.json(
        { error: 'No se pudo actualizar el estado del usuario' },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: `Estado del usuario actualizado a ${status}`
    });
  } catch (error) {
    console.error('❌ Error updating user status:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno del servidor' },
      { status: 500 }
    );
  }
}