// app/api/organization/invitations/[id]/resend/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { invitationService } from '@/organization-module/services/invitationService';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    console.log('🔄 Reenviando invitación:', id);
    
    const result = await invitationService.resendInvitation(id);
    
    if (result.success) {
      return NextResponse.json({
        success: true,
        message: result.message
      });
    } else {
      return NextResponse.json(
        { success: false, error: result.message },
        { status: 500 }
      );
    }
    
  } catch (error: any) {
    console.error('❌ Error reenviando invitación:', error);
    return NextResponse.json(
      { success: false, error: error.message || 'Error interno del servidor' },
      { status: 500 }
    );
  }
}