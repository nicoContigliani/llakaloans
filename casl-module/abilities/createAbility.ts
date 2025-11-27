import { createMongoAbility, AbilityBuilder } from '@casl/ability';

// Tipo más simple que funciona seguro
export type AppAbility = ReturnType<typeof createMongoAbility>;

export function createAbility(permissions: Record<string, string[]>): AppAbility {
  const { can, build } = new AbilityBuilder(createMongoAbility);

  // Convertir permisos simples a reglas CASL
  Object.entries(permissions).forEach(([subject, actions]) => {
    if (Array.isArray(actions)) {
      actions.forEach(action => {
        can(action, subject);
      });
    }
  });

  return build();
}