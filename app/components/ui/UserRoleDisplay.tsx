'use client';

import { useUserRoles } from '@/app/hooks/useUserRoles';
import styles from './UserRoleDisplay.module.css';
import { Button } from './Button/Button';
import { useRouter } from 'next/navigation';

export const UserRoleDisplay: React.FC = () => {
  const { userRoles, isLoading, error, refetch, getPrimaryRole, getUserRolesText, hasRoles } = useUserRoles();
  const router = useRouter();

  const goToOrganization = () => {
    router.push('/organization');
  };

  const goToUserManagement = () => {
    router.push('/admin/users');
  };

  if (isLoading) {
    return (
      <div className={styles.roleContainer}>
        <div className={styles.loading}>
          <span className={styles.loadingSpinner}>⏳</span>
          Cargando roles...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className={styles.roleContainer}>
        <div className={styles.error}>
          <span className={styles.errorIcon}>⚠️</span>
          <div className={styles.errorContent}>
            <strong>Error al cargar roles:</strong>
            <p>{error}</p>
            <button onClick={refetch} className={styles.retryButton}>
              Reintentar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!hasRoles) {
    return (
      <div className={styles.roleContainer}>
        <div className={styles.noRoles}>
          <span className={styles.roleIcon}>👤</span>
          <span>Usted no es miembro de ninguna empresa, ¿Desea crear una?</span>
        </div>
        <div className={styles.buttonGroup}>
          <Button onClick={goToOrganization} className={styles.compactButton}>
            Crear empresa
          </Button>
        </div>
      </div>
    );
  }

  const primaryRole = getPrimaryRole();

  return (
    <div className={styles.roleContainer}>
      <div className={styles.roleHeader}>
        <div className={styles.roleHeaderContent}>
          <span className={styles.roleIcon}>🎯</span>
          <strong>Su rol principal:</strong>
        </div>
        <div className={styles.buttonGroup}>
          <Button onClick={goToUserManagement} className={styles.compactButton}>
            Administrar usuarios
          </Button>
        </div>
      </div>

      <div className={styles.primaryRole}>
        <span className={styles.company}>{primaryRole?.company}</span>
        <span className={styles.role}>{primaryRole?.role}</span>
      </div>

      {userRoles && userRoles.companies.length > 1 && (
        <div className={styles.allRoles}>
          <details className={styles.rolesDetails}>
            <summary className={styles.rolesSummary}>
              Ver todos los roles ({userRoles.companies.length} empresas)
            </summary>
            <div className={styles.rolesList}>
              {userRoles.companies.map((company, index) => (
                <div key={index} className={styles.companyRoles}>
                  <strong>{company.company_name}:</strong>
                  <div className={styles.roles}>
                    {company.roles.map((role, roleIndex) => (
                      <span key={roleIndex} className={styles.roleTag}>
                        {role}
                      </span>
                    ))}
                  </div>
                  <div className={styles.status}>
                    Estado: <span className={company.status === 'active' ? styles.active : styles.inactive}>
                      {company.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </details>
        </div>
      )}
    </div>
  );
};