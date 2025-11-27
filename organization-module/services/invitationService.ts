// organization-module/services/invitationService.ts
import { ObjectId } from 'mongodb';
import clientPromise from '../../lib/mongodb';
import { InvitationData, Invitation, AcceptInvitationResult } from '../types/organization';
import { emailService } from './emailService';

export const invitationService = {
  // Generar token único para la invitación
  generateToken(): string {
    return Math.random().toString(36).substring(2, 15) + 
           Math.random().toString(36).substring(2, 15) +
           Date.now().toString(36);
  },

  // Crear invitación en la base de datos (sin enviar email)
  async createInvitation(invitationData: Omit<InvitationData, 'expires_at'>): Promise<Invitation> {
    const client = await clientPromise;
    const db = client.db();

    const token = this.generateToken();
    const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000); // 7 días

    const invitation = {
      ...invitationData,
      token,
      expires_at,
      status: 'pending' as const,
      created_at: new Date(),
      email_sent: false,
      email_sent_at: null,
      email_attempts: 0,
      last_email_attempt: null,
      last_email_error: null,
      email_message_id: null
    };

    console.log('📝 Creando invitación en BD:', {
      email: invitationData.email,
      company: invitationData.company_name,
      role: invitationData.role_name,
      token: token.substring(0, 10) + '...'
    });

    const result = await db.collection('invitations').insertOne(invitation);

    const createdInvitation: Invitation = {
      _id: result.insertedId.toString(),
      email: invitation.email,
      company_id: invitation.company_id,
      company_name: invitation.company_name,
      role_name: invitation.role_name,
      invited_by: invitation.invited_by,
      token: invitation.token,
      status: invitation.status,
      created_at: invitation.created_at,
      expires_at: invitation.expires_at
    };

    console.log('✅ Invitación creada con ID:', createdInvitation._id);
    return createdInvitation;
  },

  // Enviar email de invitación
  async sendInvitationEmail(invitation: Invitation): Promise<boolean> {
    const client = await clientPromise;
    const db = client.db();

    try {
      console.log('📧 Enviando email de invitación para:', invitation.email);
      
      const emailResult = await emailService.sendInvitationEmail(
        invitation.email,
        invitation.company_name,
        invitation.token
      );

      if (emailResult.success) {
        console.log('✅ Email enviado correctamente');
        
        // Actualizar en base de datos
        await db.collection('invitations').updateOne(
          { _id: new ObjectId(invitation._id) },
          { 
            $set: { 
              email_sent: true,
              email_sent_at: new Date(),
              email_message_id: emailResult.messageId,
              last_email_attempt: new Date(),
              last_email_error: null
            },
            $inc: { email_attempts: 1 }
          }
        );
        
        return true;
      } else {
        console.error('❌ Error enviando email:', emailResult.error);
        
        // Registrar el error en la base de datos
        await db.collection('invitations').updateOne(
          { _id: new ObjectId(invitation._id) },
          { 
            $set: { 
              last_email_error: emailResult.error,
              last_email_attempt: new Date()
            },
            $inc: { email_attempts: 1 }
          }
        );
        
        return false;
      }
    } catch (error: any) {
      console.error('❌ Error en sendInvitationEmail:', error);
      
      // Registrar error en base de datos
      await db.collection('invitations').updateOne(
        { _id: new ObjectId(invitation._id) },
        { 
          $set: { 
            last_email_error: error.message,
            last_email_attempt: new Date()
          },
          $inc: { email_attempts: 1 }
        }
      );
      
      return false;
    }
  },

  // Método unificado que crea Y envía la invitación
  async createAndSendInvitation(invitationData: Omit<InvitationData, 'expires_at'>): Promise<{
    success: boolean;
    invitation?: Invitation;
    message: string;
  }> {
    try {
      console.log('🎯 Creando y enviando invitación completa...');
      
      // 1. Crear la invitación en BD
      const invitation = await this.createInvitation(invitationData);
      console.log('✅ Invitación creada en BD:', invitation._id);

      // 2. Enviar el email
      const emailSent = await this.sendInvitationEmail(invitation);
      
      if (emailSent) {
        console.log('✅ Proceso completo: Invitación creada y email enviado');
        return {
          success: true,
          invitation,
          message: 'Invitación enviada exitosamente'
        };
      } else {
        console.error('❌ Invitación creada pero email falló');
        return {
          success: false,
          invitation,
          message: 'Invitación creada pero error enviando el email'
        };
      }
      
    } catch (error: any) {
      console.error('❌ Error en createAndSendInvitation:', error);
      return {
        success: false,
        message: error.message || 'Error creando invitación'
      };
    }
  },

  // Buscar invitación por token
  async getInvitationByToken(token: string): Promise<Invitation | null> {
    const client = await clientPromise;
    const db = client.db();

    console.log('🔍 Buscando invitación con token:', token.substring(0, 10) + '...');

    const invitationDoc = await db.collection('invitations').findOne({
      token,
      status: 'pending',
      expires_at: { $gt: new Date() }
    });

    if (!invitationDoc) {
      console.log('❌ Invitación no encontrada o expirada');
      return null;
    }

    const invitation: Invitation = {
      _id: invitationDoc._id.toString(),
      email: invitationDoc.email,
      company_id: invitationDoc.company_id,
      company_name: invitationDoc.company_name,
      role_name: invitationDoc.role_name,
      invited_by: invitationDoc.invited_by,
      token: invitationDoc.token,
      status: invitationDoc.status,
      created_at: invitationDoc.created_at,
      expires_at: invitationDoc.expires_at,
      accepted_at: invitationDoc.accepted_at
    };

    console.log('✅ Invitación encontrada:', {
      id: invitation._id,
      email: invitation.email,
      company: invitation.company_name
    });
    return invitation;
  },

  // Aceptar invitación
  async acceptInvitation(token: string, userId: string): Promise<AcceptInvitationResult> {
    const client = await clientPromise;
    const db = client.db();

    console.log('🔍 Buscando invitación para aceptar...');
    const invitation = await this.getInvitationByToken(token);
    
    if (!invitation) {
      console.log('❌ Invitación no válida o expirada');
      return { success: false, message: 'Invitación no válida o expirada' };
    }

    console.log('✅ Invitación encontrada, verificando usuario...');

    // Verificar que el usuario no esté ya en la empresa
    const existingEmployee = await db.collection('employees').findOne({
      user_id: userId,
      company_id: new ObjectId(invitation.company_id)
    });

    if (existingEmployee) {
      console.log('❌ Usuario ya pertenece a esta empresa');
      return { success: false, message: 'Ya perteneces a esta empresa' };
    }

    try {
      // Obtener el ID del rol
      const role = await db.collection('roles').findOne({
        name: invitation.role_name
      });

      if (!role) {
        console.log(`❌ Rol '${invitation.role_name}' no encontrado`);
        return { success: false, message: `Rol '${invitation.role_name}' no encontrado` };
      }

      console.log('✅ Rol encontrado:', role.name, 'ID:', role._id);

      // Crear empleado
      const employeeResult = await db.collection('employees').insertOne({
        user_id: userId,
        company_id: new ObjectId(invitation.company_id),
        role_ids: [role._id],
        status: 'active',
        created_at: new Date(),
        updated_at: new Date()
      });

      console.log('✅ Empleado creado exitosamente:', employeeResult.insertedId);

      // Marcar invitación como aceptada
      const invitationResult = await db.collection('invitations').updateOne(
        { token },
        {
          $set: {
            status: 'accepted',
            accepted_at: new Date()
          }
        }
      );

      console.log('✅ Invitación marcada como aceptada:', invitationResult.modifiedCount);

      return {
        success: true,
        message: 'Invitación aceptada exitosamente',
        company_id: invitation.company_id,
        company_name: invitation.company_name
      };

    } catch (error: any) {
      console.error('❌ Error aceptando invitación:', error);

      // Si ocurre un error después de crear el empleado, intentar revertir manualmente
      try {
        console.log('🔄 Intentando revertir cambios...');
        await db.collection('employees').deleteOne({
          user_id: userId,
          company_id: new ObjectId(invitation.company_id)
        });
        console.log('✅ Cambios revertidos: empleado eliminado');
      } catch (revertError) {
        console.error('❌ Error al revertir cambios:', revertError);
      }

      return {
        success: false,
        message: error.message || 'Error al aceptar la invitación'
      };
    }
  },

  // Obtener invitaciones pendientes de una empresa
  async getPendingInvitations(companyId: string): Promise<Invitation[]> {
    const client = await clientPromise;
    const db = client.db();

    console.log('🔍 Buscando invitaciones pendientes para empresa:', companyId);

    const invitations = await db.collection('invitations')
      .find({
        company_id: companyId,
        status: 'pending',
        expires_at: { $gt: new Date() }
      })
      .sort({ created_at: -1 })
      .toArray();

    console.log(`✅ ${invitations.length} invitaciones pendientes encontradas`);

    return invitations.map(inv => ({
      _id: inv._id.toString(),
      email: inv.email,
      company_id: inv.company_id,
      company_name: inv.company_name,
      role_name: inv.role_name,
      invited_by: inv.invited_by,
      token: inv.token,
      status: inv.status,
      created_at: inv.created_at,
      expires_at: inv.expires_at,
      accepted_at: inv.accepted_at,
      email_sent: inv.email_sent,
      email_sent_at: inv.email_sent_at,
      email_attempts: inv.email_attempts || 0
    }));
  },

  // Cancelar invitación
  async cancelInvitation(invitationId: string): Promise<boolean> {
    const client = await clientPromise;
    const db = client.db();

    console.log('🗑️ Cancelando invitación:', invitationId);

    const result = await db.collection('invitations').updateOne(
      { _id: new ObjectId(invitationId) },
      { $set: { status: 'cancelled', cancelled_at: new Date() } }
    );

    const success = result.modifiedCount > 0;
    console.log(success ? '✅ Invitación cancelada' : '❌ Invitación no encontrada');

    return success;
  },

  // Reenviar invitación
  async resendInvitation(invitationId: string): Promise<{ success: boolean; message: string }> {
    try {
      console.log('🔄 Reenviando invitación:', invitationId);
      
      const client = await clientPromise;
      const db = client.db();
      
      const invitationDoc = await db.collection('invitations').findOne({
        _id: new ObjectId(invitationId),
        status: 'pending',
        expires_at: { $gt: new Date() }
      });

      if (!invitationDoc) {
        console.log('❌ Invitación no encontrada o expirada');
        return { success: false, message: 'Invitación no encontrada o expirada' };
      }

      const invitation: Invitation = {
        _id: invitationDoc._id.toString(),
        email: invitationDoc.email,
        company_id: invitationDoc.company_id,
        company_name: invitationDoc.company_name,
        role_name: invitationDoc.role_name,
        invited_by: invitationDoc.invited_by,
        token: invitationDoc.token,
        status: invitationDoc.status,
        created_at: invitationDoc.created_at,
        expires_at: invitationDoc.expires_at,
        accepted_at: invitationDoc.accepted_at
      };

      console.log('✅ Invitación encontrada, reenviando email...');
      const emailSent = await this.sendInvitationEmail(invitation);
      
      if (emailSent) {
        console.log('✅ Invitación reenviada exitosamente');
        return { success: true, message: 'Invitación reenviada exitosamente' };
      } else {
        console.error('❌ Error reenviando la invitación');
        return { success: false, message: 'Error reenviando la invitación' };
      }
    } catch (error: any) {
      console.error('❌ Error reenviando invitación:', error);
      return { success: false, message: error.message || 'Error interno del servidor' };
    }
  },

  // Obtener estadísticas de invitaciones
  async getInvitationStats(companyId: string): Promise<{
    total: number;
    pending: number;
    accepted: number;
    expired: number;
    cancelled: number;
  }> {
    const client = await clientPromise;
    const db = client.db();

    const now = new Date();

    const [total, pending, accepted, expired, cancelled] = await Promise.all([
      db.collection('invitations').countDocuments({ company_id: companyId }),
      db.collection('invitations').countDocuments({ 
        company_id: companyId, 
        status: 'pending',
        expires_at: { $gt: now }
      }),
      db.collection('invitations').countDocuments({ 
        company_id: companyId, 
        status: 'accepted' 
      }),
      db.collection('invitations').countDocuments({ 
        company_id: companyId, 
        status: 'pending',
        expires_at: { $lte: now }
      }),
      db.collection('invitations').countDocuments({ 
        company_id: companyId, 
        status: 'cancelled' 
      })
    ]);

    return {
      total,
      pending,
      accepted,
      expired,
      cancelled
    };
  },

  // Limpiar invitaciones expiradas
  async cleanupExpiredInvitations(): Promise<number> {
    const client = await clientPromise;
    const db = client.db();

    const result = await db.collection('invitations').updateMany(
      {
        status: 'pending',
        expires_at: { $lte: new Date() }
      },
      {
        $set: {
          status: 'expired',
          expired_at: new Date()
        }
      }
    );

    console.log(`🧹 ${result.modifiedCount} invitaciones expiradas limpiadas`);
    return result.modifiedCount;
  }
};