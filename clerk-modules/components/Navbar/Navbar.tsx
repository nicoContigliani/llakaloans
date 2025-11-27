// Navbar.tsx usando CSS Modules
'use client';

import React, { useState, useEffect } from 'react';
import { useClerkAuth } from '../../hooks/use-clerk-auth';
import { AuthButtons } from '../auth/AuthButtons';
import styles from './Navbar.module.css';

export const Navbar: React.FC = () => {
  const { isSignedIn, user } = useClerkAuth();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const menuItems = [
    { name: 'Inicio', href: '/' },
    { name: 'Servicios', href: '/servicios' },
    { name: 'Proyectos', href: '/proyectos' },
    { name: 'Nosotros', href: '/nosotros' },
    { name: 'Contacto', href: '/contacto' },
  ];

  const getUserInitial = () => {
    return user?.firstName?.[0] || user?.emailAddresses?.[0]?.emailAddress?.[0]?.toUpperCase() || 'U';
  };

  const handleSignOut = async () => {
    try {
      // Aquí iría la lógica de signOut
      console.log('Signing out...');
      setIsUserDropdownOpen(false);
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  return (
    <>
      <nav className={`${styles.navbar} ${isScrolled ? styles.navbarScrolled : styles.navbarTransparent}`}>
        <div className={styles.navbarContainer}>
          {/* Logo */}
          <div className={styles.logo}>
            <div className={styles.logoIcon}>
              <div className={styles.logoDot} />
            </div>
            <span className={`${styles.logoText} ${isScrolled ? styles.logoTextDark : styles.logoTextLight}`}>
              LlakaLoans
            </span>
          </div>

          {/* Desktop Menu */}
          <div className={styles.desktopMenu}>
            {menuItems.map((item) => (
              <a
                key={item.name}
                href={item.href}
                className={`${styles.menuItem} ${isScrolled ? styles.menuItemDark : styles.menuItemLight}`}
              >
                {item.name}
              </a>
            ))}
          </div>

        
          <div 
            className={`${styles.mobileMenuButton} ${isScrolled ? styles.mobileMenuButtonDark : styles.mobileMenuButtonLight}`}
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className={`${styles.menuLine} ${isScrolled ? styles.menuLineDark : styles.menuLineLight} ${isMobileMenuOpen ? styles.menuLineOpen : ''}`} />
            <div className={`${styles.menuLine} ${isScrolled ? styles.menuLineDark : styles.menuLineLight} ${isMobileMenuOpen ? styles.menuLineOpen : ''}`} />
            <div className={`${styles.menuLine} ${isScrolled ? styles.menuLineDark : styles.menuLineLight} ${isMobileMenuOpen ? styles.menuLineOpen : ''}`} />
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className={styles.mobileMenu}>
            <div className={styles.mobileMenuContent}>
              {menuItems.map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={styles.mobileMenuItem}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {item.name}
                </a>
              ))}
              
              <div className={styles.mobileAuthSection}>
                <AuthButtons />
              </div>
            </div>
          </div>
        )}
      </nav>

      {/* Overlay para mobile y dropdown */}
      {(isMobileMenuOpen || isUserDropdownOpen) && (
        <div 
          className={styles.overlay}
          onClick={() => {
            setIsMobileMenuOpen(false);
            setIsUserDropdownOpen(false);
          }}
        />
      )}
    </>
  );
};