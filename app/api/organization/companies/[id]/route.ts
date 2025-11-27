import { companyService } from '@/organization-module/services/companyService';
import { NextRequest, NextResponse } from 'next/server';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: companyId } = await params;
    const body = await request.json();
    const { name, slug, contact_email } = body;

    if (!name && !slug && !contact_email) {
      return NextResponse.json(
        { error: 'Al menos un campo debe ser actualizado' },
        { status: 400 }
      );
    }

    // Verificar que la empresa existe antes de actualizar
    const existingCompany = await companyService.getCompanyById(companyId);
    if (!existingCompany) {
      return NextResponse.json(
        { error: 'Empresa no encontrada' },
        { status: 404 }
      );
    }

    const updateData: any = {};
    if (name) updateData.name = name;
    if (slug) updateData.slug = slug;
    if (contact_email) updateData.contact_email = contact_email;

    const success = await companyService.updateCompany(companyId, updateData);
    
    if (!success) {
      return NextResponse.json(
        { error: 'Error al actualizar la empresa' },
        { status: 500 }
      );
    }

    const updatedCompany = await companyService.getCompanyById(companyId);
    return NextResponse.json(updatedCompany);
  } catch (error) {
    console.error('Error updating company:', error);
    
    if (error instanceof Error && error.message.includes('duplicate key')) {
      return NextResponse.json(
        { error: 'El slug ya existe' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: companyId } = await params;
    
    console.log('🗑️ [API] Intentando eliminar empresa:', companyId);

    // Validar que el ID no esté vacío
    if (!companyId || companyId === 'undefined' || companyId === 'null') {
      console.log('❌ [API] ID de empresa inválido:', companyId);
      return NextResponse.json(
        { error: 'ID de empresa inválido' },
        { status: 400 }
      );
    }

    // Verificar que la empresa existe antes de eliminar
    const existingCompany = await companyService.getCompanyById(companyId);
    if (!existingCompany) {
      console.log('❌ [API] Empresa no encontrada para eliminar:', companyId);
      return NextResponse.json(
        { error: 'Empresa no encontrada' },
        { status: 404 }
      );
    }

    console.log('✅ [API] Empresa encontrada, procediendo a eliminar:', existingCompany.name);

    const success = await companyService.deleteCompany(companyId);
    
    if (!success) {
      console.log('❌ [API] Error al eliminar empresa en el service');
      return NextResponse.json(
        { error: 'Error al eliminar la empresa' },
        { status: 500 }
      );
    }

    console.log('✅ [API] Empresa eliminada exitosamente');
    return NextResponse.json({ 
      success: true,
      message: 'Empresa eliminada exitosamente',
      deletedCompany: {
        id: companyId,
        name: existingCompany.name
      }
    });
  } catch (error: any) {
    console.error('❌ [API] Error deleting company:', error);
    
    // Manejar errores específicos de MongoDB
    if (error.name === 'BSONError' || error.message.includes('BSON')) {
      return NextResponse.json(
        { error: 'ID de empresa inválido' },
        { status: 400 }
      );
    }
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor',
        message: error.message 
      },
      { status: 500 }
    );
  }
}