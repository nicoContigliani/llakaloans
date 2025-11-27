// import { PDFGenerationRequest, EmailConfig } from '../types/dynamic';
// import nodemailer from 'nodemailer';
// import { pdfService } from './pdfService';

// export class PDFEmailService {
//   private transporter: nodemailer.Transporter;

//   constructor() {
//     // ✅ CONFIGURACIÓN CORREGIDA para Gmail
//     this.transporter = nodemailer.createTransport({
//       host: process.env.SMTP_HOST || 'smtp.gmail.com',
//       port: parseInt(process.env.SMTP_PORT || '465'), // 465 para SSL
//       secure: true, // ✅ TRUE para puerto 465
//       auth: {
//         user: process.env.SMTP_USER,
//         pass: process.env.SMTP_PASS,
//       },
//       tls: {
//         rejectUnauthorized: false // ✅ Para evitar errores de certificado en desarrollo
//       }
//     });
//   }

//   async generateAndSendPDF(
//     pdfRequest: PDFGenerationRequest, 
//     emailConfig: EmailConfig
//   ): Promise<{
//     success: boolean;
//     pdfGenerated: boolean;
//     emailSent: boolean;
//     messageId?: string;
//     error?: string;
//   }> {
//     try {
//       console.log('📧 Iniciando generación y envío de PDF...');
      
//       // 1. Generar PDF
//       const pdfResult = await pdfService.generatePDF(pdfRequest);
      
//       if (!pdfResult.success || !pdfResult.pdfBuffer) {
//         console.error('❌ Error generando PDF:', pdfResult.error);
//         return {
//           success: false,
//           pdfGenerated: false,
//           emailSent: false,
//           error: pdfResult.error,
//         };
//       }

//       console.log('✅ PDF generado correctamente');

//       // 2. Enviar email con PDF adjunto
//       const emailResult = await this.sendEmailWithAttachment(emailConfig, pdfResult.pdfBuffer);

//       return {
//         success: emailResult.success,
//         pdfGenerated: true,
//         emailSent: emailResult.success,
//         messageId: emailResult.messageId,
//         error: emailResult.error,
//       };
//     } catch (error) {
//       console.error('❌ Error en generateAndSendPDF:', error);
//       return {
//         success: false,
//         pdfGenerated: false,
//         emailSent: false,
//         error: error instanceof Error ? error.message : 'Unknown error occurred',
//       };
//     }
//   }

//   private async sendEmailWithAttachment(
//     emailConfig: EmailConfig, 
//     pdfBuffer: Buffer
//   ): Promise<{ success: boolean; messageId?: string; error?: string }> {
//     try {
//       console.log('📤 Preparando envío de email...');
//       console.log('📧 Para:', emailConfig.to);
//       console.log('📎 Tamaño del PDF:', pdfBuffer.length, 'bytes');

//       const mailOptions = {
//         from: process.env.SMTP_FROM || `"Sistema PDF" <${process.env.SMTP_USER}>`,
//         to: Array.isArray(emailConfig.to) ? emailConfig.to.join(', ') : emailConfig.to,
//         cc: emailConfig.cc ? (Array.isArray(emailConfig.cc) ? emailConfig.cc.join(', ') : emailConfig.cc) : undefined,
//         bcc: emailConfig.bcc ? (Array.isArray(emailConfig.bcc) ? emailConfig.bcc.join(', ') : emailConfig.bcc) : undefined,
//         subject: emailConfig.subject,
//         text: emailConfig.body,
//         html: this.generateHTMLTemplate(emailConfig.body),
//         attachments: [
//           {
//             filename: `documento-${Date.now()}.pdf`,
//             content: pdfBuffer,
//             contentType: 'application/pdf',
//           },
//         ],
//       };

//       console.log('🔄 Conectando con SMTP...');
      
//       // Verificar conexión primero
//       await this.transporter.verify();
//       console.log('✅ Conexión SMTP verificada');

//       const result = await this.transporter.sendMail(mailOptions);
      
//       console.log('✅ Email enviado correctamente:', result.messageId);
//       return { 
//         success: true, 
//         messageId: result.messageId 
//       };
//     } catch (error) {
//       console.error('❌ Error enviando email:', error);
//       return {
//         success: false,
//         error: error instanceof Error ? error.message : 'Email sending failed',
//       };
//     }
//   }

//   // Método para enviar email sin PDF (solo texto)
//   async sendEmail(emailConfig: EmailConfig): Promise<{ success: boolean; messageId?: string; error?: string }> {
//     try {
//       const mailOptions = {
//         from: process.env.SMTP_FROM || `"Sistema PDF" <${process.env.SMTP_USER}>`,
//         to: Array.isArray(emailConfig.to) ? emailConfig.to.join(', ') : emailConfig.to,
//         cc: emailConfig.cc,
//         bcc: emailConfig.bcc,
//         subject: emailConfig.subject,
//         text: emailConfig.body,
//         html: this.generateHTMLTemplate(emailConfig.body),
//       };

//       const result = await this.transporter.sendMail(mailOptions);
//       return { success: true, messageId: result.messageId };
//     } catch (error) {
//       return {
//         success: false,
//         error: error instanceof Error ? error.message : 'Email sending failed',
//       };
//     }
//   }

//   private generateHTMLTemplate(body: string): string {
//     return `
//       <!DOCTYPE html>
//       <html>
//         <head>
//           <meta charset="utf-8">
//           <style>
//             body { 
//               font-family: Arial, sans-serif; 
//               line-height: 1.6; 
//               color: #333; 
//               max-width: 600px; 
//               margin: 0 auto; 
//               padding: 20px;
//             }
//             .header { 
//               background: #2563eb; 
//               color: white; 
//               padding: 20px; 
//               text-align: center; 
//               border-radius: 8px 8px 0 0;
//             }
//             .content { 
//               background: #f9f9f9; 
//               padding: 20px; 
//               border-radius: 0 0 8px 8px;
//             }
//             .footer { 
//               text-align: center; 
//               padding: 20px; 
//               color: #666; 
//               font-size: 12px; 
//             }
//           </style>
//         </head>
//         <body>
//           <div class="header">
//             <h1>📄 Documento Adjunto</h1>
//           </div>
//           <div class="content">
//             ${body.replace(/\n/g, '<br>')}
//             <p><strong>El documento PDF está adjunto a este email.</strong></p>
//           </div>
//           <div class="footer">
//             <p>Este es un mensaje automático, por favor no responda a este email.</p>
//           </div>
//         </body>
//       </html>
//     `;
//   }

//   // Verificar conexión SMTP
//   async verifyConnection(): Promise<boolean> {
//     try {
//       console.log('🔍 Verificando conexión SMTP...');
//       console.log('📧 Host:', process.env.SMTP_HOST);
//       console.log('🔌 Puerto:', process.env.SMTP_PORT);
//       console.log('👤 Usuario:', process.env.SMTP_USER);
      
//       await this.transporter.verify();
//       console.log('✅ Conexión SMTP configurada correctamente');
//       return true;
//     } catch (error) {
//       console.error('❌ Error en conexión SMTP:', error);
//       return false;
//     }
//   }
// }

// export const pdfEmailService = new PDFEmailService();



import { PDFGenerationRequest, EmailConfig } from '../types/dynamic';
import nodemailer from 'nodemailer';
import { pdfService } from './pdfService';

export class PDFEmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configuración para Gmail
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: parseInt(process.env.SMTP_PORT || '587'), // Usar 587 que es más confiable
      secure: false, // false para puerto 587
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }

  async generateAndSendPDF(
    pdfRequest: PDFGenerationRequest, 
    emailConfig: EmailConfig
  ): Promise<{
    success: boolean;
    pdfGenerated: boolean;
    emailSent: boolean;
    messageId?: string;
    error?: string;
  }> {
    try {
      console.log('📧 Iniciando generación y envío de PDF...');
      
      // 1. Generar PDF
      const pdfResult = await pdfService.generatePDF(pdfRequest);
      
      if (!pdfResult.success || !pdfResult.pdfBuffer) {
        console.error('❌ Error generando PDF:', pdfResult.error);
        return {
          success: false,
          pdfGenerated: false,
          emailSent: false,
          error: pdfResult.error,
        };
      }

      console.log('✅ PDF generado - Tamaño:', pdfResult.pdfBuffer.length, 'bytes');

      // 2. Enviar email con PDF adjunto
      const emailResult = await this.sendEmailWithAttachment(emailConfig, pdfResult.pdfBuffer);

      return {
        success: emailResult.success,
        pdfGenerated: true,
        emailSent: emailResult.success,
        messageId: emailResult.messageId,
        error: emailResult.error,
      };
    } catch (error) {
      console.error('❌ Error en generateAndSendPDF:', error);
      return {
        success: false,
        pdfGenerated: false,
        emailSent: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  private async sendEmailWithAttachment(
    emailConfig: EmailConfig, 
    pdfBuffer: Buffer
  ): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      console.log('📤 Preparando envío de email con PDF adjunto...');
      console.log('📧 Para:', emailConfig.to);
      console.log('📎 Tamaño del PDF:', pdfBuffer.length, 'bytes');

      // Optimizar el PDF si es muy grande (raro pero por si acaso)
      let finalPdfBuffer = pdfBuffer;
      if (pdfBuffer.length > 10 * 1024 * 1024) { // 10MB
        console.warn('⚠️ PDF muy grande, considerando optimización');
        // En un caso real, aquí podrías comprimir el PDF
      }

      const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.SMTP_FROM || `"Sistema PDF" <${process.env.SMTP_USER}>`,
        to: Array.isArray(emailConfig.to) ? emailConfig.to.join(', ') : emailConfig.to,
        cc: emailConfig.cc ? (Array.isArray(emailConfig.cc) ? emailConfig.cc.join(', ') : emailConfig.cc) : undefined,
        bcc: emailConfig.bcc ? (Array.isArray(emailConfig.bcc) ? emailConfig.bcc.join(', ') : emailConfig.bcc) : undefined,
        subject: emailConfig.subject,
        text: emailConfig.body,
        html: this.generateHTMLTemplate(emailConfig.body),
        attachments: [
          {
            filename: `documento-${Date.now()}.pdf`,
            content: finalPdfBuffer,
            contentType: 'application/pdf',
            encoding: 'base64' // ✅ IMPORTANTE: Usar base64 para attachments
          },
        ],
      };

      console.log('🔄 Conectando con servidor SMTP...');
      
      // Verificar conexión primero
      await this.transporter.verify();
      console.log('✅ Conexión SMTP verificada');

      console.log('📨 Enviando email...');
      const result = await this.transporter.sendMail(mailOptions);
      
      console.log('✅ Email enviado correctamente - Message ID:', result.messageId);
      console.log('✅ Respuesta del servidor:', result.response);
      
      return { 
        success: true, 
        messageId: result.messageId 
      };
    } catch (error: any) {
      console.error('❌ Error enviando email:', error);
      
      // Mensajes de error más específicos
      let errorMessage = error.message;
      if (error.code === 'EAUTH') {
        errorMessage = 'Error de autenticación - Verifica usuario y contraseña';
      } else if (error.code === 'ECONNECTION') {
        errorMessage = 'Error de conexión con el servidor SMTP';
      } else if (error.code === 'EMESSAGE') {
        errorMessage = 'Error en el formato del mensaje';
      }
      
      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  // Método alternativo: enviar email con PDF como link (si el attachment falla)
  async generateAndSendPDFAsLink(
    pdfRequest: PDFGenerationRequest, 
    emailConfig: EmailConfig,
    pdfUrl: string
  ): Promise<{ success: boolean; pdfGenerated: boolean; emailSent: boolean; error?: string }> {
    try {
      // 1. Generar PDF
      const pdfResult = await pdfService.generatePDF(pdfRequest);
      
      if (!pdfResult.success) {
        return {
          success: false,
          pdfGenerated: false,
          emailSent: false,
          error: pdfResult.error,
        };
      }

      // 2. Enviar email con link al PDF (en lugar de attachment)
      const emailBody = `${emailConfig.body}\n\n🔗 Descargar PDF: ${pdfUrl}`;
      
      const emailResult = await this.sendEmail({
        ...emailConfig,
        body: emailBody
      });

      return {
        success: emailResult.success,
        pdfGenerated: true,
        emailSent: emailResult.success,
        error: emailResult.error,
      };
    } catch (error) {
      return {
        success: false,
        pdfGenerated: false,
        emailSent: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
      };
    }
  }

  // Método para enviar email sin attachment
  async sendEmail(emailConfig: EmailConfig): Promise<{ success: boolean; messageId?: string; error?: string }> {
    try {
      const mailOptions = {
        from: process.env.SMTP_FROM || `"Sistema PDF" <${process.env.SMTP_USER}>`,
        to: Array.isArray(emailConfig.to) ? emailConfig.to.join(', ') : emailConfig.to,
        cc: emailConfig.cc,
        bcc: emailConfig.bcc,
        subject: emailConfig.subject,
        text: emailConfig.body,
        html: this.generateHTMLTemplate(emailConfig.body),
      };

      const result = await this.transporter.sendMail(mailOptions);
      console.log('✅ Email simple enviado:', result.messageId);
      return { success: true, messageId: result.messageId };
    } catch (error) {
      console.error('❌ Error enviando email simple:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Email sending failed',
      };
    }
  }

  private generateHTMLTemplate(body: string): string {
    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              line-height: 1.6; 
              color: #333; 
              max-width: 600px; 
              margin: 0 auto; 
              padding: 20px;
              background-color: #f5f5f5;
            }
            .container {
              background: white;
              border-radius: 10px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
              overflow: hidden;
            }
            .header { 
              background: linear(135deg, #667eea 0%, #764ba2 100%); 
              color: white; 
              padding: 30px 20px; 
              text-align: center; 
            }
            .header h1 {
              margin: 0;
              font-size: 24px;
            }
            .content { 
              padding: 30px; 
            }
            .attachment-notice {
              background: #e3f2fd;
              border-left: 4px solid #2196f3;
              padding: 15px;
              margin: 20px 0;
              border-radius: 4px;
            }
            .footer { 
              text-align: center; 
              padding: 20px; 
              color: #666; 
              font-size: 12px; 
              background: #f8f9fa;
            }
            .button {
              display: inline-block;
              background: #2563eb;
              color: white;
              padding: 12px 24px;
              text-decoration: none;
              border-radius: 5px;
              margin: 10px 0;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📄 Documento PDF Adjunto</h1>
            </div>
            <div class="content">
              <div style="white-space: pre-line;">${body}</div>
              
              <div class="attachment-notice">
                <strong>📎 Archivo Adjunto</strong>
                <p>Has recibido un documento PDF adjunto a este email.</p>
              </div>
              
              <p>Si no puedes ver el archivo adjunto, por favor responde a este email para notificarnos.</p>
            </div>
            <div class="footer">
              <p>Este es un mensaje automático generado por el sistema.</p>
              <p>📍 ${new Date().toLocaleDateString('es-AR', { 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}</p>
            </div>
          </div>
        </body>
      </html>
    `;
  }

  // Verificar conexión SMTP con más detalles
  async verifyConnection(): Promise<{ success: boolean; error?: string; details?: any }> {
    try {
      console.log('🔍 Verificando conexión SMTP...');
      console.log('📧 Host:', process.env.SMTP_HOST);
      console.log('🔌 Puerto:', process.env.SMTP_PORT);
      console.log('👤 Usuario:', process.env.SMTP_USER);
      
      await this.transporter.verify();
      console.log('✅ Conexión SMTP configurada correctamente');
      
      return { 
        success: true,
        details: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          user: process.env.SMTP_USER,
          from: process.env.SMTP_FROM
        }
      };
    } catch (error: any) {
      console.error('❌ Error en conexión SMTP:', error);
      
      let errorMessage = error.message;
      if (error.code) {
        errorMessage = `${error.code}: ${error.message}`;
      }
      
      return { 
        success: false, 
        error: errorMessage,
        details: {
          host: process.env.SMTP_HOST,
          port: process.env.SMTP_PORT,
          user: process.env.SMTP_USER
        }
      };
    }
  }
}

export const pdfEmailService = new PDFEmailService();