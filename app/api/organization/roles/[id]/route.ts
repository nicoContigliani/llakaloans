// app/api/organization/roles/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { roleService } from '@/organization-module';

// GET /api/organization/roles - Obtener todos los roles
export async function GET(request: NextRequest) {
  try {
    // Inicializar roles si es necesario
    await roleService.initializeRoles();
    
    const roles = await roleService.getRoles();
    
    return NextResponse.json({ roles });
  } catch (error) {
    console.error('Error fetching roles:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}