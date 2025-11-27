// app/api/test-email/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { emailService } from '@/organization-module/services/emailService';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { toEmail } = body;

    if (!toEmail) {
      return NextResponse.json({
        success: false,
        error: 'toEmail es requerido'
      }, { status: 400 });
    }

    console.log('🎯 Iniciando prueba de email a:', toEmail);

    // Verificar estado del servicio
    const status = emailService.getStatus();
    console.log('📊 Estado del servicio:', status);

    // Enviar email de prueba
    const result = await emailService.sendInvitationEmail(
      toEmail,
      'Empresa de Prueba - Diagnóstico',
      'test-token-diagnostico-' + Date.now()
    );

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: '✅ Email de prueba enviado exitosamente',
        messageId: result.messageId,
        previewUrl: result.previewUrl,
        status: emailService.getStatus(),
        config: {
          hasSmtpConfig: !!(process.env.SMTP_USER && process.env.SMTP_PASS),
          smtpHost: process.env.SMTP_HOST,
          smtpUser: process.env.SMTP_USER ? 'Configurado' : 'No configurado'
        }
      });
    } else {
      return NextResponse.json({
        success: false,
        message: '❌ Error enviando email',
        error: result.error,
        status: emailService.getStatus(),
        config: {
          hasSmtpConfig: !!(process.env.SMTP_USER && process.env.SMTP_PASS),
          smtpHost: process.env.SMTP_HOST
        }
      }, { status: 500 });
    }

  } catch (error: any) {
    console.error('❌ Error en prueba de email:', error);
    return NextResponse.json({
      success: false,
      message: 'Error en el servidor',
      error: error.message,
      status: emailService.getStatus()
    }, { status: 500 });
  }
}
// curl -X POST http://localhost:3000/api/test-email \
//   -H "Content-Type: application/json" \
//   -d '{"toEmail": "llakascript@gmail.com"}'