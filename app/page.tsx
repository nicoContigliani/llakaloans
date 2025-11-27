'use client';

import { useAuth } from '../clerk-modules/utils/auth-utils';
import styles from './page.module.css';

export default function Home() {
  const { user, isSignedIn } = useAuth();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <section className={styles.hero}>
          <div className={styles.heroContent}>
            <h1 className={styles.title}>
              {user 
                ? `¡Bienvenido de vuelta, ${user.firstName}!` 
                : 'Financiamiento Divino para tu Proyecto'
              }
            </h1>
            
            <p className={styles.subtitle}>
              {user 
                ? 'Tu sesión está activa y puedes gestionar tus préstamos.' 
                : 'Obtén el préstamo que necesitas con tasas divinas y aprobación inmediata.'
              }
            </p>
            
            <div className={styles.ctas}>
              {!isSignedIn ? (
                <div className={styles.authButtons}>
                  <a href="/sign-in" className={styles.primary}>
                    Solicitar Préstamo
                  </a>
                  <a href="/sign-up" className={styles.secondary}>
                    Simular Crédito
                  </a>
                </div>
              ) : (
                <div className={styles.dashboardActions}>
                  <a href="/dashboard" className={styles.primary}>
                    Mi Panel de Control
                  </a>
                  <a href="/loans" className={styles.secondary}>
                    Ver Mis Préstamos
                  </a>
                </div>
              )}
            </div>
          </div>
        </section>

        <section className={styles.benefits}>
          <h2 className={styles.benefitsTitle}>Beneficios Exclusivos</h2>
          <div className={styles.features}>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>⚡</div>
              <h3>Aprobación Inmediata</h3>
              <p>Respuesta en minutos con nuestro sistema divino</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>🛡️</div>
              <h3>Seguridad Garantizada</h3>
              <p>Tus datos protegidos con tecnología olímpica</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>💎</div>
              <h3>Tasas Preferenciales</h3>
              <p>Las mejores condiciones del mercado mitológico</p>
            </div>
            <div className={styles.feature}>
              <div className={styles.featureIcon}>📱</div>
              <h3>Gestión Digital</h3>
              <p>Controla todo desde tu dispositivo, sin trámites</p>
            </div>
          </div>
        </section>

        <section className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statNumber}>24h</span>
            <span className={styles.statLabel}>Desembolso</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>99%</span>
            <span className={styles.statLabel}>Aprobación</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statNumber}>+10k</span>
            <span className={styles.statLabel}>Clientes</span>
          </div>
        </section>
      </main>
    </div>
  );
}