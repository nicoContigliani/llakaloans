import { useState, useEffect } from 'react';
import { AppAbility, createAbility } from '../abilities/createAbility';
import { permissionService } from '../services/permissionService';
import { useAuth } from '@clerk/nextjs';

export const useAbility = (empresaId: string): AppAbility => {
  const { isLoaded, userId } = useAuth(); // Usar userId en lugar de user
  const [ability, setAbility] = useState<AppAbility>(createAbility({}));

  useEffect(() => {
    if (isLoaded && userId && empresaId) {
      const loadPermissions = async () => {
        try {
          const permissions = await permissionService.getUserPermissions(
            userId, // Usar userId directamente
            empresaId
          );
          const userAbility = createAbility(permissions);
          setAbility(userAbility);
        } catch (error) {
          console.error('Error loading permissions:', error);
          setAbility(createAbility({}));
        }
      };

      loadPermissions();
    }
  }, [userId, empresaId, isLoaded]);

  return ability;
};