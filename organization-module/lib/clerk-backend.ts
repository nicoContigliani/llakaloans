// organization-module/lib/clerk-backend.ts

// 🚨 CORREGIDO: Importar 'createClerkClient' en lugar de 'Clerk'.
import { createClerkClient, User } from '@clerk/backend';

// Inicializar Clerk con la API key del backend
// 🚨 CORREGIDO: Usar 'createClerkClient' como una función.
const clerkClient = createClerkClient({
  secretKey: process.env.CLERK_SECRET_KEY,
});

// Usamos la interfaz 'User' de Clerk directamente para mayor seguridad
// y extendemos (si fuera necesario) o mapeamos si es un subconjunto.
// Para este caso, redefinimos la interfaz para que sea el tipo 'User' de Clerk.
export interface ClerkUser extends User {}

// Nota: El tipo 'User' del SDK de Clerk ya contiene todas las propiedades 
// que definiste, y más. Usamos 'User' directamente.

export class ClerkBackendService {
  /**
   * Buscar usuario por email en Clerk
   */
  async findUserByEmail(email: string): Promise<ClerkUser | null> {
    try {
      console.log('🔍 Buscando usuario en Clerk por email:', email);
      
      // La API 'getUserList' retorna un objeto con una propiedad 'data'.
      const users = await clerkClient.users.getUserList({
        emailAddress: [email],
      });

      if (users.data.length === 0) {
        console.log('❌ Usuario no encontrado en Clerk:', email);
        return null;
      }

      const user = users.data[0];
      // El SDK de backend ya usa 'emailAddresses' como un array.
      console.log('✅ Usuario encontrado en Clerk:', user.id, user.emailAddresses[0]?.emailAddress);

      // El tipo de 'user' aquí ya es 'User' (o 'ClerkUser' con la extensión)
      return user as ClerkUser;
    } catch (error) {
      console.error('❌ Error buscando usuario en Clerk:', error);
      // Lanzar un error más específico para el frontend/consumidor
      throw new Error(`Error al buscar usuario: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Obtener usuario por ID
   */
  async getUserById(userId: string): Promise<ClerkUser | null> {
    try {
      console.log('🔍 Buscando usuario en Clerk por ID:', userId);
      
      const user = await clerkClient.users.getUser(userId);
      
      console.log('✅ Usuario encontrado por ID:', user.id);
      return user as ClerkUser;
    } catch (error) {
      // La API de Clerk lanza un error si el usuario no existe (e.g., 404),
      // por lo que capturarlo y retornar null es una buena práctica aquí.
      console.error('❌ Error obteniendo usuario por ID:', error);
      return null;
    }
  }

  /**
   * Crear invitación para un nuevo usuario en Clerk
   */
  async createInvitation(email: string, companyName: string): Promise<{ invitationId: string; status: string }> {
    try {
      console.log('📧 Creando invitación para:', email);
      
      // 🚀 Implementación real de la API de Clerk
      const invitation = await clerkClient.invitations.createInvitation({
        emailAddress: email,
        // Puedes añadir aquí el ID de la organización si es relevante
        // publicMetadata: { companyName } // O usar metadata si es necesario
      });

      console.log('✅ Invitación creada:', invitation.id);
      return {
        invitationId: invitation.id,
        status: invitation.status,
      };
    } catch (error) {
      console.error('❌ Error creando invitación:', error);
      throw new Error(`Error al crear invitación: ${error instanceof Error ? error.message : 'Error desconocido'}`);
    }
  }

  /**
   * Verificar si un email existe en Clerk
   */
  async emailExists(email: string): Promise<boolean> {
    // Reutilizamos el método existente
    return (await this.findUserByEmail(email)) !== null;
  }

  /**
   * Obtener información básica del usuario para mostrar
   */
  async getUserInfo(userId: string): Promise<{ email: string; name: string } | null> {
    try {
      const user = await this.getUserById(userId);
      if (!user) return null;

      // Usamos el primer email verificado o simplemente el primero
      const primaryEmail = user.emailAddresses.find(e => e.verification?.status === 'verified')?.emailAddress || user.emailAddresses[0]?.emailAddress || '';
      
      // Concatenar nombre y apellido, filtrando nulos
      const fullName = [user.firstName, user.lastName].filter(Boolean).join(' ') || primaryEmail || 'Usuario Desconocido';

      return {
        email: primaryEmail,
        name: fullName
      };
    } catch (error) {
      console.error('❌ Error obteniendo información del usuario:', error);
      return null;
    }
  }
}

export const clerkBackendService = new ClerkBackendService();