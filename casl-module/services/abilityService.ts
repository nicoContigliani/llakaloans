import { permissionService } from './permissionService';
import { createAbility } from '../abilities/createAbility';

export const abilityService = {
  async createUserAbility(userId: string, empresaId: string) {
    const permissions = await permissionService.getUserPermissions(userId, empresaId);
    return createAbility(permissions);
  },

  // Verificación rápida en el backend
  async canUserPerform(
    userId: string, 
    empresaId: string, 
    action: string, 
    subject: string
  ): Promise<boolean> {
    const ability = await this.createUserAbility(userId, empresaId);
    return ability.can(action, subject);
  }
};