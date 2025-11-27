// // import { NotificationMessage, NotificationResult, INotificationStrategy } from '../../types/notification';
// // import nodemailer from 'nodemailer';

// // export class NodemailerStrategy implements INotificationStrategy {
// //   private transporter: nodemailer.Transporter;

// //   constructor() {
// //     // Usar configuración por defecto para desarrollo si no hay variables de entorno
// //     const host = process.env.SMTP_HOST || 'smtp.ethereal.email';
// //     const port = parseInt(process.env.SMTP_PORT || '587');
// //     const user = process.env.SMTP_USER || 'user';
// //     const pass = process.env.SMTP_PASS || 'pass';

// //     this.transporter = nodemailer.createTransport({
// //       host,
// //       port,
// //       secure: port === 465,
// //       auth: {
// //         user,
// //         pass,
// //       },
// //     });
// //   }

// //   validate(message: NotificationMessage): boolean {
// //     if (!message.to || (Array.isArray(message.to) && message.to.length === 0)) {
// //       return false;
// //     }

// //     const emails = Array.isArray(message.to) ? message.to : [message.to];
// //     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// //     return emails.every(email => emailRegex.test(email));
// //   }

// //   async send(message: NotificationMessage): Promise<NotificationResult> {
// //     try {
// //       if (!this.validate(message)) {
// //         return {
// //           success: false,
// //           error: 'Invalid email address(es)',
// //         };
// //       }

// //       const mailOptions: nodemailer.SendMailOptions = {
// //         from: process.env.SMTP_FROM || 'noreply@example.com',
// //         to: message.to,
// //         subject: message.subject || 'Notification',
// //         text: message.content,
// //         html: message.htmlContent || message.content,
// //       };

// //       const result = await this.transporter.sendMail(mailOptions);

// //       return {
// //         success: true,
// //         messageId: result.messageId,
// //         providerResponse: result,
// //       };
// //     } catch (error) {
// //       console.error('Nodemailer error:', error);
// //       return {
// //         success: false,
// //         error: error instanceof Error ? error.message : 'Unknown error occurred',
// //         providerResponse: error,
// //       };
// //     }
// //   }
// // }




// import { NotificationMessage, NotificationResult, INotificationStrategy } from '../../types/notification';
// import nodemailer from 'nodemailer';

// export class NodemailerStrategy implements INotificationStrategy {
//   private transporter: nodemailer.Transporter;

//   constructor() {
//     // Usa las variables de entorno O configuración directa como en tu código
//     const host = process.env.SMTP_HOST || 'smtp.gmail.com';
//     const port = parseInt(process.env.SMTP_PORT || '465');
//     const user = process.env.SMTP_USER || 'nico.contigliani@gmail.com';
//     const pass = process.env.SMTP_PASS || 'zlhixycegxoeuvdj';

//     this.transporter = nodemailer.createTransport({
//       service: 'gmail',
//       host,
//       port,
//       secure: port === 465, // true para 465, false para otros
//       auth: {
//         user,
//         pass,
//       },
//     });
//   }

//   validate(message: NotificationMessage): boolean {
//     if (!message.to || (Array.isArray(message.to) && message.to.length === 0)) {
//       return false;
//     }

//     const emails = Array.isArray(message.to) ? message.to : [message.to];
//     const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

//     return emails.every(email => emailRegex.test(email));
//   }

//   async send(message: NotificationMessage): Promise<NotificationResult> {
//     try {
//       if (!this.validate(message)) {
//         return {
//           success: false,
//           error: 'Invalid email address(es)',
//         };
//       }

//       // Si el mensaje viene con HTML personalizado, úsalo, sino genera uno básico
//       const htmlContent = message.htmlContent || this.generateBasicHTML(message);

//       const mailOptions: nodemailer.SendMailOptions = {
//         from: process.env.SMTP_FROM || 'nico.contigliani@gmail.com',
//         to: message.to,
//         subject: message.subject || 'Notification',
//         text: message.content,
//         html: htmlContent,
//       };

//       const result = await this.transporter.sendMail(mailOptions);

//       return {
//         success: true,
//         messageId: result.messageId,
//         providerResponse: result,
//       };
//     } catch (error) {
//       console.error('Nodemailer error:', error);
//       return {
//         success: false,
//         error: error instanceof Error ? error.message : 'Unknown error occurred',
//         providerResponse: error,
//       };
//     }
//   }

//   // Método para generar HTML similar al que ya tienes
//   private generateBasicHTML(message: NotificationMessage): string {
//     return `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta http-equiv="X-UA-Compatible" content="IE=edge">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <link rel="stylesheet" href="https://cdn.korzh.com/metroui/v4/css/metroui-all.min.css">
//     <title>${message.subject || 'Notification'}</title>
// </head>
// <body>
//     <div style="max-width: 600px; margin: 0 auto; padding: 20px; font-family: Arial, sans-serif;">
//         <h1 style="color: #333; border-bottom: 2px solid #007bff; padding-bottom: 10px;">
//             ${message.subject || 'Notificación del Sistema'}
//         </h1>
//         <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
//             <p style="margin: 0; color: #555; line-height: 1.6;">
//                 ${message.content}
//             </p>
//         </div>
//         ${message.metadata ? this.renderMetadata(message.metadata) : ''}
//         <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #ddd; color: #777; font-size: 12px;">
//             <p>Enviado el: ${new Date().toLocaleString()}</p>
//             <p>Sistema de notificaciones automáticas</p>
//         </div>
//     </div>
// </body>
// </html>
//     `;
//   }

//   private renderMetadata(metadata: Record<string, any>): string {
//     const metadataEntries = Object.entries(metadata);
//     if (metadataEntries.length === 0) return '';

//     return `
//         <div style="background-color: #e7f3ff; padding: 15px; border-radius: 5px; margin: 15px 0;">
//             <h3 style="margin-top: 0; color: #0056b3;">Información adicional:</h3>
//             <table style="width: 100%; border-collapse: collapse;">
//                 ${metadataEntries.map(([key, value]) => `
//                     <tr>
//                         <td style="padding: 5px 10px; border-bottom: 1px solid #cce5ff; font-weight: bold; width: 30%;">${key}:</td>
//                         <td style="padding: 5px 10px; border-bottom: 1px solid #cce5ff;">${value}</td>
//                     </tr>
//                 `).join('')}
//             </table>
//         </div>
//     `;
//   }

//   // Método específico para tu caso de uso actual
//   async sendReturnHomeNotification(data: any): Promise<NotificationResult> {
//     const { id, todo, todos } = data;

//     const contentHTML = `
// <!DOCTYPE html>
// <html lang="en">
// <head>
//     <meta charset="UTF-8">
//     <meta http-equiv="X-UA-Compatible" content="IE=edge">
//     <meta name="viewport" content="width=device-width, initial-scale=1.0">
//     <link rel="stylesheet" href="https://cdn.korzh.com/metroui/v4/css/metroui-all.min.css">
//     <title>Document</title>
// </head>
// <body>
//     <h1>Retorna de donde:</h1>
//     <h3>email:</h3>${todo}  <br>
//     <h3>header:</h3>${todos.host}  <br>
//     <h3>Fecha y hora: </h3>${new Date()}
// </body>
// </html>
//     `;

//     const message: NotificationMessage = {
//       to: 'nico.contigliani@gmail.com',
//       subject: `${todo} abrió el mail - Sistema de envio automático`,
//       content: `Notificación de apertura: ${todo}`,
//       htmlContent: contentHTML,
//       channel: 'email',
//       metadata: {
//         id,
//         todo,
//         host: todos.host,
//         timestamp: new Date().toISOString()
//       }
//     };

//     return await this.send(message);
//   }
// }




// notification-module/services/strategies/nodemailer.strategy.ts - Versión corregida
import { NotificationMessage, NotificationResult, INotificationStrategy } from '../../types/notification';
import nodemailer from 'nodemailer';

export class NodemailerStrategy implements INotificationStrategy {
  private transporter: nodemailer.Transporter;

  constructor() {
    // Configuración más robusta
    const host = process.env.SMTP_HOST || 'smtp.gmail.com';
    const port = parseInt(process.env.SMTP_PORT || '587'); // Cambiar a 587
    const user = process.env.SMTP_USER || 'nico.contigliani@gmail.com';
    const pass = process.env.SMTP_PASS || 'zlhixycegxoeuvdj';

    console.log('Configurando Nodemailer con:', { host, port, user: user ? '***' : 'missing' });

    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: {
        user,
        pass,
      },
      // Opciones adicionales para mejor manejo de errores
      connectionTimeout: 10000,
      greetingTimeout: 10000,
      socketTimeout: 10000,
    });

    // Verificar la configuración
    this.verifyConfiguration();
  }

  private async verifyConfiguration() {
    try {
      await this.transporter.verify();
      console.log('✅ Configuración de Nodemailer verificada correctamente');
    } catch (error) {
      console.error('❌ Error verificando configuración de Nodemailer:', error);
    }
  }

  validate(message: NotificationMessage): boolean {
    if (!message.to || (Array.isArray(message.to) && message.to.length === 0)) {
      return false;
    }

    const emails = Array.isArray(message.to) ? message.to : [message.to];
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    return emails.every(email => emailRegex.test(email));
  }

  // async send(message: NotificationMessage): Promise<NotificationResult> {
  //   try {
  //     console.log('Enviando email a:', message.to);

  //     if (!this.validate(message)) {
  //       return {
  //         success: false,
  //         error: 'Invalid email address(es)',
  //       };
  //     }

  //     const mailOptions: nodemailer.SendMailOptions = {
  //       from: process.env.SMTP_FROM || 'nico.contigliani@gmail.com',
  //       to: message.to,
  //       subject: message.subject || 'Notification',
  //       text: message.content,
  //       html: message.htmlContent || this.generateBasicHTML(message),
  //     };

  //     const result = await this.transporter.sendMail(mailOptions);
  //     console.log('✅ Email enviado correctamente:', result.messageId);

  //     return {
  //       success: true,
  //       messageId: result.messageId,
  //       providerResponse: result,
  //     };
  //   } catch (error: any) {
  //     console.error('❌ Error enviando email:', error);

  //     // Manejar errores específicos de Gmail
  //     let errorMessage = error.message;
  //     if (error.code === 'EAUTH') {
  //       errorMessage = 'Error de autenticación. Verifica usuario y contraseña.';
  //     } else if (error.code === 'ECONNECTION') {
  //       errorMessage = 'Error de conexión con el servidor SMTP.';
  //     }

  //     return {
  //       success: false,
  //       error: errorMessage,
  //       providerResponse: error,
  //     };
  //   }
  // }


  // En tu NodemailerStrategy, agrega manejo de adjuntos:
  async send(message: NotificationMessage): Promise<NotificationResult> {
    try {
      if (!this.validate(message)) {
        return {
          success: false,
          error: 'Invalid email address(es)',
        };
      }

      const mailOptions: nodemailer.SendMailOptions = {
        from: process.env.SMTP_FROM || 'nico.contigliani@gmail.com',
        to: message.to,
        subject: message.subject || 'Notification',
        text: message.content,
        html: message.htmlContent || message.content,
      };

      // Manejar adjuntos si existen
      if (message.metadata?.attachment) {
        mailOptions.attachments = [{
          filename: message.metadata.attachment.filename,
          content: message.metadata.attachment.content,
          encoding: 'base64',
          contentType: message.metadata.attachment.contentType,
        }];
      }

      const result = await this.transporter.sendMail(mailOptions);

      return {
        success: true,
        messageId: result.messageId,
        providerResponse: result,
      };
    } catch (error) {
      console.error('Nodemailer error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        providerResponse: error,
      };
    }
  }

  private generateBasicHTML(message: NotificationMessage): string {
    return `
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h2>${message.subject || 'Notificación'}</h2>
        <p>${message.content}</p>
        <hr>
        <small>Enviado el ${new Date().toLocaleString()}</small>
      </div>
    `;
  }
}