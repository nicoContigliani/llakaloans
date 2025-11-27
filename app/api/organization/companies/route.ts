// app/api/organization/companies/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { companyService, roleService, userService, toRoleNames } from '@/organization-module';

// GET /api/organization/companies - Listar empresas
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');
    
    let userRoles: string[] = [];
    
    // Obtener roles del usuario desde la base de datos si se proporciona user_id
    if (user_id) {
      try {
        // Obtener todas las empresas del usuario para determinar sus roles globales
        const userCompanies = await companyService.getUserCompanies(user_id);
        
        if (userCompanies.length > 0) {
          // Obtener todos los roles del usuario en todas sus empresas
          const allUserRoles: string[] = [];
          
          for (const company of userCompanies) {
            const companyRoles = await companyService.getUserCompanyRoles(user_id, company._id);
            allUserRoles.push(...companyRoles);
          }
          
          // Eliminar duplicados y convertir a RoleName[]
          userRoles = [...new Set(allUserRoles)];
          console.log('🎯 Roles globales del usuario:', userRoles);
        } else {
          console.log('👤 Usuario no tiene empresas asociadas');
          userRoles = [];
        }
      } catch (error) {
        console.error('❌ Error obteniendo roles del usuario:', error);
        userRoles = [];
      }
    }

    // Convertir a RoleName[] válidos
    const validUserRoles = toRoleNames(userRoles);

    const filters = {
      search: searchParams.get('search') || undefined,
      status: searchParams.get('status') || undefined,
      page: parseInt(searchParams.get('page') || '1'),
      limit: parseInt(searchParams.get('limit') || '10'),
      user_id: user_id || undefined
    };

    console.log('🔍 Buscando empresas con filtros:', filters, 'y roles:', validUserRoles);

    const result = await companyService.getCompanies(filters, validUserRoles);
    
    return NextResponse.json(result);
  } catch (error) {
    console.error('Error fetching companies:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

// POST /api/organization/companies - Crear empresa
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, slug, contact_email, user_id } = body;

    if (!name || !slug || !contact_email || !user_id) {
      return NextResponse.json(
        { error: 'Nombre, slug, email y user_id son requeridos' },
        { status: 400 }
      );
    }

    console.log('🏢 Creando nueva empresa:', { name, slug, contact_email, user_id });

    // Validar formato del slug
    if (!/^[a-z0-9-]+$/.test(slug)) {
      return NextResponse.json(
        { error: 'El slug solo puede contener letras minúsculas, números y guiones' },
        { status: 400 }
      );
    }

    // Validar formato del email
    if (!/\S+@\S+\.\S+/.test(contact_email)) {
      return NextResponse.json(
        { error: 'El email de contacto no es válido' },
        { status: 400 }
      );
    }

    // Crear la empresa
    const companyId = await companyService.createCompany({
      name,
      slug,
      contact_email,
      status: 'active',
      created_by: user_id
    });

    console.log('✅ Empresa creada con ID:', companyId);

    // Obtener rol de owner
    const ownerRole = await roleService.getRoleByName('owner');
    if (!ownerRole) {
      // Si no existe el rol owner, inicializar roles
      console.log('⚠️ Rol owner no encontrado, inicializando roles...');
      await roleService.initializeRoles();
      
      // Intentar obtener el rol owner nuevamente
      const ownerRoleRetry = await roleService.getRoleByName('owner');
      if (!ownerRoleRetry) {
        throw new Error('No se pudo crear el rol owner después de inicializar roles');
      }
      
      console.log('✅ Roles inicializados, rol owner obtenido');
    }

    const finalOwnerRole = ownerRole || (await roleService.getRoleByName('owner'));
    if (!finalOwnerRole) {
      throw new Error('Rol owner no encontrado después de múltiples intentos');
    }

    console.log('✅ Rol owner obtenido:', finalOwnerRole.name);

    // El creador de la empresa automáticamente tiene rol de owner
    const currentUserRoles: string[] = ['owner'];

    // Asignar usuario como owner de la empresa
    await userService.addUserToCompany(
      user_id, 
      companyId, 
      [finalOwnerRole._id], 
      toRoleNames(currentUserRoles)
    );

    console.log('✅ Usuario asignado como owner de la empresa');

    // Obtener la empresa creada para retornarla
    const newCompany = await companyService.getCompanyById(companyId);
    
    if (!newCompany) {
      throw new Error('No se pudo obtener la empresa recién creada');
    }

    console.log('✅ Empresa retornada:', newCompany.name);

    return NextResponse.json(newCompany, { status: 201 });
  } catch (error) {
    console.error('❌ Error creating company:', error);
    
    // Manejar errores específicos
    if (error instanceof Error) {
      if (error.message.includes('duplicate key')) {
        return NextResponse.json(
          { error: 'El slug ya existe. Por favor usa un slug único.' },
          { status: 400 }
        );
      }
      
      if (error.message.includes('E11000')) {
        return NextResponse.json(
          { error: 'El slug ya existe. Por favor usa un slug único.' },
          { status: 400 }
        );
      }
      
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}