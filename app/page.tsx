// page.tsx actualizado
'use client';

import { AuthButtons } from '../clerk-modules/components/auth/AuthButtons';
import { useAuth } from '../clerk-modules/utils/auth-utils';
import styles from './page.module.css';

export default function Home() {
  const { user, isSignedIn } = useAuth();

  return (
    <div className={styles.page}>
      <main className={styles.main}>
        {/* <header className={styles.header}>
          <AuthButtons />
        </header> */}
        
        <section className={styles.intro}>
          <h1>
            {user ? `Bienvenido, ${user.firstName}` : 'Bienvenido a Olympus'}
          </h1>
          <p>
            {user 
              ? 'Tu sesión está activa y puedes acceder a todas las funciones divinas.' 
              : 'Inicia sesión para descubrir el poder de los dioses en nuestra plataforma.'
            }
          </p>
          
          <div className={styles.ctas}>
            {/* {!isSignedIn && (
              <>
                <a href="/sign-in" className={styles.primary}>
                  Iniciar Sesión
                </a>
                <a href="/sign-up" className={styles.secondary}>
                  Registrarse
                </a>
              </>
            )} */}
            {isSignedIn && (
              <a href="/dashboard" className={styles.primary}>
                Ir al Dashboard
              </a>
            )}
          </div>
        </section>

        <div className={styles.features}>
          <div className={styles.feature}>
            <h3>Seguridad Divina</h3>
            <p>Protegido con la fuerza de los dioses olímpicos</p>
          </div>
          <div className={styles.feature}>
            <h3>Arquitectura Eterna</h3>
            <p>Diseñado como los templos de la antigua Grecia</p>
          </div>
          <div className={styles.feature}>
            <h3>Rendimiento Olímpico</h3>
            <p>Velocidad y elegancia en cada interacción</p>
          </div>
        </div>
      </main>
    </div>
  );
}