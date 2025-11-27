import { NextRequest } from 'next/server';
import { abilityService } from '../services/abilityService';
import { getAuth } from '@clerk/nextjs/server';

export async function validatePermissions(
  requiredAction: string,
  requiredSubject: string,
  req: NextRequest
): Promise<{ hasAccess: boolean; userId?: string; empresaId?: string }> {
  try {
    const { userId } = getAuth(req);
    
    if (!userId) {
      return { hasAccess: false };
    }

    const empresaId = getEmpresaIdFromRequest(req);
    
    if (!empresaId) {
      return { hasAccess: false };
    }

    const canPerform = await abilityService.canUserPerform(
      userId,
      empresaId,
      requiredAction,
      requiredSubject
    );

    return { 
      hasAccess: canPerform, 
      userId, 
      empresaId 
    };
  } catch (error) {
    console.error('Error validating permissions:', error);
    return { hasAccess: false };
  }
}

export function getEmpresaIdFromRequest(req: NextRequest): string | null {
  const url = new URL(req.url);
  
  // Prioridad: headers > query params
  const headerEmpresa = req.headers.get('x-empresa-id');
  if (headerEmpresa) return headerEmpresa;

  const queryEmpresa = url.searchParams.get('empresaId');
  if (queryEmpresa) return queryEmpresa;

  return null;
}