import { useAbility } from './useAbility';

export const usePermissions = (empresaId: string) => {
  const ability = useAbility(empresaId);

  const can = (action: string, subject: string) => {
    return ability.can(action, subject);
  };

  const cannot = (action: string, subject: string) => {
    return ability.cannot(action, subject);
  };

  return {
    can,
    cannot,
    ability
  };
};