import { NextRequest, NextResponse } from 'next/server';
import { abilityService } from '../services/abilityService';
import { getAuth } from '@clerk/nextjs/server';

export async function withPermissions(
  req: NextRequest,
  handler: Function,
  requiredAction: string,
  requiredSubject: string
) {
  try {
    // Obtener usuario de Clerk para App Router
    const { userId } = getAuth(req);
    
    if (!userId) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
    }

    // Obtener empresaId de headers, query params o body
    const empresaId = getEmpresaIdFromRequest(req);
    
    if (!empresaId) {
      return NextResponse.json({ error: 'Empresa no especificada' }, { status: 400 });
    }

    // Verificar permisos
    const canPerform = await abilityService.canUserPerform(
      userId,
      empresaId,
      requiredAction,
      requiredSubject
    );

    if (!canPerform) {
      return NextResponse.json({ error: 'No tienes permisos para esta acción' }, { status: 403 });
    }

    // Ejecutar el handler si tiene permisos
    return handler(req);
  } catch (error) {
    console.error('Error en withPermissions:', error);
    return NextResponse.json({ error: 'Error de permisos' }, { status: 500 });
  }
}

function getEmpresaIdFromRequest(req: NextRequest): string | null {
  const url = new URL(req.url);
  
  // En query params
  const queryEmpresa = url.searchParams.get('empresaId');
  if (queryEmpresa) return queryEmpresa;

  // En headers
  const headerEmpresa = req.headers.get('x-empresa-id');
  if (headerEmpresa) return headerEmpresa;

  return null;
}