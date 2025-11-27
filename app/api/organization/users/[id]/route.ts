// app/api/organization/users/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { companyService, userService, roleService } from '@/organization-module';
import { toRoleNames } from '@/organization-module/types/organization';

// PUT /api/organization/users/[id] - Actualizar roles de usuario
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { company_id, role_ids, current_user_id, current_roles } = body;

    console.log('🔄 PUT /api/organization/users/[id] - Actualizando usuario:', {
      id, company_id, role_ids, current_user_id
    });

    if (!company_id || !role_ids || !Array.isArray(role_ids) || !current_user_id) {
      return NextResponse.json(
        { error: 'company_id, role_ids y current_user_id son requeridos' },
        { status: 400 }
      );
    }

    // Validar que los role_ids son ObjectId válidos
    for (const roleId of role_ids) {
      if (!/^[0-9a-fA-F]{24}$/.test(roleId)) {
        console.error('❌ Role ID inválido:', roleId);
        return NextResponse.json(
          { error: `ID de rol inválido: ${roleId}` },
          { status: 400 }
        );
      }
    }

    // Obtener roles del usuario actual
    const currentUserRoles = await companyService.getUserCompanyRoles(current_user_id, company_id);
    const validCurrentUserRoles = toRoleNames(currentUserRoles);

    // Obtener roles del usuario objetivo
    const targetUserRoles = current_roles || await companyService.getUserCompanyRoles(id, company_id);
    const validTargetUserRoles = toRoleNames(targetUserRoles);

    console.log('👤 Roles usuario actual:', validCurrentUserRoles);
    console.log('🎯 Roles usuario objetivo:', validTargetUserRoles);

    // Verificar que los roles existen
    const roles = await roleService.getRolesByIds(role_ids);
    if (roles.length !== role_ids.length) {
      console.error('❌ Roles no encontrados. Solicitados:', role_ids, 'Encontrados:', roles.map(r => r._id));
      return NextResponse.json(
        { error: 'Uno o más roles no existen en la base de datos' },
        { status: 400 }
      );
    }

    // Actualizar roles del usuario
    const success = await userService.updateUserRoles(
      id,
      company_id,
      role_ids,
      validCurrentUserRoles,
      validTargetUserRoles
    );

    if (!success) {
      return NextResponse.json(
        { error: 'No se pudo actualizar los roles del usuario' },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Roles actualizados exitosamente'
    });
  } catch (error) {
    console.error('❌ Error updating user roles:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/organization/users/[id] - Eliminar usuario de empresa
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { searchParams } = new URL(request.url);
    const company_id = searchParams.get('company_id');
    const current_user_id = searchParams.get('current_user_id');

    console.log('🗑️ DELETE /api/organization/users/[id] - Eliminando usuario:', {
      id, company_id, current_user_id
    });

    if (!company_id || !current_user_id) {
      return NextResponse.json(
        { error: 'company_id y current_user_id son requeridos' },
        { status: 400 }
      );
    }

    // Obtener roles del usuario actual
    const currentUserRoles = await companyService.getUserCompanyRoles(current_user_id, company_id);
    const validCurrentUserRoles = toRoleNames(currentUserRoles);

    // Obtener roles del usuario objetivo
    const targetUserRoles = await companyService.getUserCompanyRoles(id, company_id);
    const validTargetUserRoles = toRoleNames(targetUserRoles);

    console.log('👤 Roles usuario actual:', validCurrentUserRoles);
    console.log('🎯 Roles usuario objetivo:', validTargetUserRoles);

    // Eliminar usuario de la empresa
    const success = await userService.removeUserFromCompany(
      id,
      company_id,
      validCurrentUserRoles,
      validTargetUserRoles
    );

    if (!success) {
      return NextResponse.json(
        { error: 'No se pudo eliminar el usuario de la empresa' },
        { status: 400 }
      );
    }

    return NextResponse.json({ 
      success: true,
      message: 'Usuario eliminado exitosamente'
    });
  } catch (error) {
    console.error('❌ Error removing user:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Error interno del servidor' },
      { status: 500 }
    );
  }
}