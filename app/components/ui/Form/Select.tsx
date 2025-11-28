'use client';

import React from 'react';
import styles from './Select.module.css';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  options: SelectOption[];
  placeholder?: string;
}

export const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ 
    label, 
    error, 
    helperText, 
    required = false,
    options,
    placeholder,
    className = '',
    id,
    ...props 
  }, ref) => {
    const selectId = id || `select-${Math.random().toString(36).substr(2, 9)}`;
    
    const selectClasses = [
      styles.select,
      error && styles.error,
      className
    ].filter(Boolean).join(' ');

    return (
      <div className={styles.selectGroup}>
        {label && (
          <label htmlFor={selectId} className={styles.label}>
            <span className={required ? styles.required : ''}>
              {label}
            </span>
          </label>
        )}
        
        <select
          ref={ref}
          id={selectId}
          className={selectClasses}
          required={required}
          {...props}
        >
          {placeholder && (
            <option value="" disabled>
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        
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

Select.displayName = 'Select';