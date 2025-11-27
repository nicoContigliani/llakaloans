import React from 'react';
import { usePermissions } from '../hooks/usePermissions';

interface CanProps {
  action: string;
  subject: string;
  empresaId: string;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export const Can: React.FC<CanProps> = ({ 
  action, 
  subject, 
  empresaId, 
  children, 
  fallback = null 
}) => {
  const { can } = usePermissions(empresaId);

  if (can(action, subject)) {
    return <>{children}</>;
  }

  return <>{fallback}</>;
};