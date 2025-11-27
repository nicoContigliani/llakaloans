// organization-module/services/emailService.ts
import nodemailer from 'nodemailer';

interface EmailResponse {
  success: boolean;
  messageId?: string;
  previewUrl?: string | null;
  response?: string;
  error?: string;
  code?: string;
}

class EmailService {
  private transporter: nodemailer.Transporter | null = null;
  private initialized: boolean = false;
  private initializing: boolean = false;

  async ensureInitialized(): Promise<void> {
    if (this.initialized) return;
    
    // Esperar si ya se está inicializando
    while (this.initializing) {
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    if (this.initialized) return;

    this.initializing = true;
    try {
      await this.initialize();
      this.initialized = true;
    } finally {
      this.initializing = false;
    }
  }

  async initialize(): Promise<void> {
    try {
      console.log('🔧 Inicializando servicio de email...');
      
      // Verificar variables requeridas para SMTP real
      const hasSmtpConfig = process.env.SMTP_USER && process.env.SMTP_PASS;
      
      if (hasSmtpConfig) {
        console.log('📧 Usando configuración SMTP real...');
        
        const config = {
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          tls: {
            rejectUnauthorized: false
          }
        };

        this.transporter = nodemailer.createTransport(config);

        // Verificar conexión
        await this.transporter.verify();
        console.log('✅ SMTP real configurado y verificado');
        
      } else {
        console.log('🔄 Usando Ethereal Email (modo desarrollo)...');
        const testAccount = await nodemailer.createTestAccount();
        
        this.transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });

        console.log('✅ Ethereal Email configurado:', testAccount.user);
      }
      
    } catch (error: any) {
      console.error('❌ Error inicializando servicio de email:', error.message);
      this.transporter = null;
      throw error;
    }
  }

  async sendEmail(to: string, subject: string, html: string, text?: string): Promise<EmailResponse> {
    await this.ensureInitialized();

    if (!this.transporter) {
      throw new Error('Servicio de email no disponible después de inicialización');
    }

    try {
      const fromEmail = process.env.SMTP_FROM_EMAIL || process.env.SMTP_USER;
      const fromName = process.env.SMTP_FROM_NAME || 'Sistema de Organización';

      if (!fromEmail) {
        throw new Error('Email del remitente no configurado');
      }

      const mailOptions = {
        from: {
          name: fromName,
          address: fromEmail
        },
        to,
        subject,
        text: text || this.htmlToText(html),
        html,
      };

      console.log('📤 Enviando email a:', to);
      
      const info = await this.transporter.sendMail(mailOptions);
      
      console.log('✅ Email enviado exitosamente:', info.messageId);

      // Si es Ethereal Email, mostrar URL de preview
      let previewUrl:any = null;
      if (info.messageId && info.messageId.includes('ethereal')) {
        previewUrl = nodemailer.getTestMessageUrl(info);
        console.log('👀 Vista previa:', previewUrl);
      }

      return {
        success: true,
        messageId: info.messageId,
        previewUrl,
        response: info.response
      };

    } catch (error: any) {
      console.error('❌ Error enviando email:', error.message);
      
      return {
        success: false,
        error: error.message,
        code: error.code
      };
    }
  }

  private htmlToText(html: string): string {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  async sendInvitationEmail(email: string, companyName: string, token: string): Promise<EmailResponse> {
    const baseUrl = process.env.NEXTAUTH_URL || 
                   (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : 'http://localhost:3000');
    
    const invitationLink = `${baseUrl}/invitation/accept?token=${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Invitación a ${companyName}</title>
        <style>
          body { 
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
            line-height: 1.6; 
            color: #333; 
            margin: 0; 
            padding: 0; 
            background-color: #f6f9fc;
          }
          .container { 
            max-width: 600px; 
            margin: 0 auto; 
            background: white; 
            border-radius: 10px; 
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
          }
          .header { 
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            padding: 40px 30px; 
            text-align: center; 
            color: white; 
          }
          .header h1 { 
            margin: 0; 
            font-size: 28px; 
            font-weight: 700; 
          }
          .content { 
            padding: 40px 30px; 
          }
          .button { 
            display: inline-block; 
            background: #667eea; 
            color: white; 
            padding: 16px 32px; 
            text-decoration: none; 
            border-radius: 8px; 
            font-weight: 600; 
            font-size: 16px; 
            margin: 20px 0; 
            transition: background 0.3s ease;
          }
          .button:hover {
            background: #5a6fd8;
          }
          .details { 
            background: #f8f9fa; 
            padding: 25px; 
            border-radius: 8px; 
            border-left: 4px solid #667eea; 
            margin: 25px 0; 
          }
          .footer { 
            text-align: center; 
            padding: 20px; 
            color: #999; 
            font-size: 12px; 
            background: #f1f3f4; 
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>¡Te han invitado!</h1>
          </div>
          <div class="content">
            <h2 style="color: #333; margin-bottom: 20px;">Invitación a ${companyName}</h2>
            <p style="color: #666; line-height: 1.6;">
              Has sido invitado a unirte a <strong style="color: #333;">${companyName}</strong> en nuestra plataforma.
            </p>
            
            <div style="text-align: center;">
              <a href="${invitationLink}" class="button">Aceptar Invitación</a>
            </div>
            
            <div class="details">
              <p style="margin: 0; color: #666;">
                <strong>Enlace de invitación:</strong><br>
                <a href="${invitationLink}" style="color: #667eea; word-break: break-all;">${invitationLink}</a>
              </p>
              <p style="margin: 10px 0 0 0; color: #999; font-size: 14px;">
                ⚠️ Este enlace expirará en 7 días.
              </p>
            </div>
            
            <p style="color: #999; font-size: 14px; text-align: center; margin-top: 30px;">
              Si no solicitaste esta invitación, puedes ignorar este email.
            </p>
          </div>
          <div class="footer">
            <p>Este es un email automático, por favor no respondas a este mensaje.</p>
          </div>
        </div>
      </body>
      </html>
    `;

    const text = `
      INVITACIÓN A ${companyName.toUpperCase()}

      Has sido invitado a unirte a ${companyName} en nuestra plataforma.

      Para aceptar la invitación, visita el siguiente enlace:
      ${invitationLink}

      ⚠️ Importante: Este enlace expirará en 7 días.

      Si no solicitaste esta invitación, puedes ignorar este email.

      --
      Sistema de Organización
      Email automático
    `;

    return this.sendEmail(email, `Invitación a ${companyName}`, html, text);
  }

  // Método para verificar estado
  getStatus(): {
    initialized: boolean;
    initializing: boolean;
    hasTransporter: boolean;
    hasSmtpConfig: boolean;
    smtpHost?: string;
    smtpUser?: string;
  } {
    return {
      initialized: this.initialized,
      initializing: this.initializing,
      hasTransporter: !!this.transporter,
      hasSmtpConfig: !!(process.env.SMTP_USER && process.env.SMTP_PASS),
      smtpHost: process.env.SMTP_HOST,
      smtpUser: process.env.SMTP_USER
    };
  }
}

export const emailService = new EmailService();