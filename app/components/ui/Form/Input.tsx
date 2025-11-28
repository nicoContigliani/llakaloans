'use client';

import React from 'react';
import styles from './Input.module.css';

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ 
    label, 
    error, 
    helperText, 
    required = false,
    className = '',
    id,
    ...props 
  }, ref) => {
    const inputId = id || `input-${Math.random().toString(36).substr(2, 9)}`;
    
    const inputClasses = [
      styles.input,
      error && styles.error,
      className
    ].filter(Boolean).join(' ');

    return (
      <div className={styles.inputGroup}>
        {label && (
          <label htmlFor={inputId} className={styles.label}>
            <span className={required ? styles.required : ''}>
              {label}
            </span>
          </label>
        )}
        
        <input
          ref={ref}
          id={inputId}
          className={inputClasses}
          required={required}
          {...props}
        />
        
        {error && (
          <span className={styles.errorMessage}>{error}</span>
        )}
        
        {helperText && !error && (
          <span className={styles.helperText}>{helperText}</span>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';