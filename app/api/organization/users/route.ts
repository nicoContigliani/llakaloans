// app/api/organization/users/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { companyService, userService, roleService } from '@/organization-module';
import { toRoleNames, isRoleName } from '@/organization-module/types/organization';

// GET /api/organization/users - Listar usuarios de una empresa
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const company_id = searchParams.get('company_id');
    const user_id = searchParams.get('user_id');

    console.log('🔍 GET /api/organization/users - Params:', { company_id, user_id });

    if (!company_id) {
      return NextResponse.json(
        { error: 'company_id es requerido' },
        { status: 400 }
      );
    }

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id es requerido' },
        { status: 400 }
      );
    }

    // Obtener roles del usuario actual y convertirlos a RoleName[]
    const currentUserRoles = await companyService.getUserCompanyRoles(user_id, company_id);
    const validCurrentUserRoles = toRoleNames(currentUserRoles);
    
    console.log('🎯 Roles del usuario actual:', validCurrentUserRoles);

    // Convertir el rol del filtro a RoleName si existe
    const roleParam = searchParams.get('role');
    const validRole = roleParam && isRoleName(roleParam) ? roleParam : undefined;

    const filters = {
      company_id,
      search: searchParams.get('search') || undefined,
      role: validRole,
      status: searchParams.get('status') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10')
    };

    console.log('🔍 Filtros aplicados:', filters);

    const result = await userService.getCompanyUsers(filters, validCurrentUserRoles);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('❌ Error fetching users:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST /api/organization/users - Agregar usuario a empresa por email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, company_id, role_ids, current_user_id } = body;

    console.log('📨 POST /api/organization/users - Datos recibidos:', { 
      email, 
      company_id, 
      role_ids, 
      current_user_id 
    });

    // Validaciones básicas
    if (!email || !company_id || !role_ids || !Array.isArray(role_ids) || !current_user_id) {
      console.error('❌ Faltan campos requeridos');
      return NextResponse.json(
        { error: 'email, company_id, role_ids y current_user_id son requeridos' },
        { status: 400 }
      );
    }

    // Validar que role_ids no contenga valores nulos o vacíos
    if (role_ids.some(id => id === null || id === undefined || id === '')) {
      console.error('❌ IDs de rol inválidos:', role_ids);
      return NextResponse.json(
        { error: 'Uno o más IDs de rol son inválidos' },
        { status: 400 }
      );
    }

    // Validar formato de email
    if (!/\S+@\S+\.\S+/.test(email)) {
      console.error('❌ Email inválido:', email);
      return NextResponse.json(
        { error: 'El formato del email no es válido' },
        { status: 400 }
      );
    }

    // Validar que company_id es un ObjectId válido
    if (!/^[0-9a-fA-F]{24}$/.test(company_id)) {
      console.error('❌ Company ID inválido:', company_id);
      return NextResponse.json(
        { error: 'ID de empresa inválido' },
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

    // Obtener roles del usuario actual y convertirlos a RoleName[]
    const currentUserRoles = await companyService.getUserCompanyRoles(current_user_id, company_id);
    const validCurrentUserRoles = toRoleNames(currentUserRoles);

    console.log('👤 Usuario actual roles:', validCurrentUserRoles);

    // Verificar que los roles existen en la base de datos
    const roles = await roleService.getRolesByIds(role_ids);
    if (roles.length !== role_ids.length) {
      console.error('❌ Roles no encontrados. Solicitados:', role_ids, 'Encontrados:', roles.map(r => r._id));
      return NextResponse.json(
        { error: 'Uno o más roles no existen en la base de datos' },
        { status: 400 }
      );
    }

    console.log('✅ Roles verificados:', roles.map(r => ({ id: r._id, name: r.name })));

    // Verificar permisos del usuario actual
    const canManage = validCurrentUserRoles.some(role => 
      ['toor', 'owner', 'admin'].includes(role)
    );
    
    if (!canManage) {
      console.error('❌ Usuario no tiene permisos para gestionar usuarios');
      return NextResponse.json(
        { error: 'No tienes permisos para gestionar usuarios en esta empresa' },
        { status: 403 }
      );
    }

    // Agregar usuario a la empresa por email
    const result = await userService.addUserToCompanyByEmail(
      email, 
      company_id, 
      role_ids,
      validCurrentUserRoles
    );
    
    console.log('✅ Resultado de agregar usuario:', result);

    if (!result.success) {
      return NextResponse.json(
        { error: result.message },
        { status: 400 }
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    console.error('❌ Error adding user:', error);
    
    // Manejar errores específicos
    if (error instanceof Error) {
      if (error.message.includes('ObjectId') || error.message.includes('hex string')) {
        return NextResponse.json(
          { error: 'ID de empresa o roles inválidos' },
          { status: 400 }
        );
      }
      
      if (error.message.includes('permissions')) {
        return NextResponse.json(
          { error: error.message },
          { status: 403 }
        );
      }
      
      if (error.message.includes('ya pertenece')) {
        return NextResponse.json(
          { error: error.message },
          { status: 409 }
        );
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}