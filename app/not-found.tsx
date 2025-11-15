// app/not-found.tsx
'use client';

import Link from 'next/link';
import styles from './not-found.module.css';
import { useClerkAuth } from '@/clerk-modules/hooks/use-clerk-auth';
import { useEffect, useState } from 'react';

export default function NotFound() {
  const { isSignedIn } = useClerkAuth();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <div className={styles.iconContainer}>
            <div className={styles.olympicIcon}></div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Efectos de luz olímpica */}
      <div className={styles.olympicGlow}></div>
      
      {/* Partículas divinas */}
      <div className={styles.divineParticles}>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
        <div className={styles.particle}></div>
      </div>

      <div className={styles.content}>
        {/* Icono de rayo de Zeus */}
        <div className={styles.iconContainer}>
          <div className={styles.olympicIcon}></div>
        </div>

        {/* Código de error con estilo olímpico */}
        <h1 className={styles.errorCode}>404</h1>

        {/* Títulos con tipografía clásica */}
        <h2 className={styles.title}>Página No Encontrada</h2>
        <p className={styles.subtitle}>
          Esta página ha desaparecido como los dioses del Olimpo en la modernidad.
        </p>

        {/* Botones con acentos mitológicos */}
        <div className={styles.buttonGroup}>
          <Link href="/" className={styles.primaryButton}>
            Volver al Olimpo
          </Link>
          
          {isSignedIn ? (
            <Link href="/dashboard" className={styles.secondaryButton}>
              Tu Santuario
            </Link>
          ) : (
            <Link href="/auth/sign-in" className={styles.secondingButton}>
              Iniciar Ceremonia
            </Link>
          )}
        </div>

        {/* Mensaje del oráculo */}
        <div className={styles.footer}>
          <p>El oráculo sugiere revisar la dirección</p>
        </div>
      </div>
    </div>
  );
}