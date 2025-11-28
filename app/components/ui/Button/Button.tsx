'use client';

import React from 'react';
import styles from './Button.module.css';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger';
  size?: 'small' | 'medium' | 'large';
  fullWidth?: boolean;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    children, 
    variant = 'primary', 
    size = 'medium', 
    fullWidth = false,
    className = '',
    ...props 
  }, ref) => {
    const classNames = [
      styles.button,
      styles[variant],
      size !== 'medium' && styles[size],
      fullWidth && styles.fullWidth,
      className
    ].filter(Boolean).join(' ');

    return (
      <button ref={ref} className={classNames} {...props}>
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';