import { NextRequest, NextResponse } from 'next/server';
import { companyService } from '../../../../organization-module/services/companyService';

// GET /api/organization/employees - Obtener empresas del usuario
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const user_id = searchParams.get('user_id');

    console.log('🔍 Buscando empresas para user_id:', user_id);

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id es requerido' },
        { status: 400 }
      );
    }

    const companies = await companyService.getUserCompanies(user_id);
    
    console.log('✅ Empresas encontradas:', companies.length);
    
    return NextResponse.json({ companies });
  } catch (error) {
    console.error('❌ Error fetching user companies:', error);
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}