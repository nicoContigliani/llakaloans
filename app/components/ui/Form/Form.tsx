import React from 'react';
import styles from './Form.module.css';

export interface FormProps extends React.FormHTMLAttributes<HTMLFormElement> {
  actionsAlign?: 'start' | 'center' | 'end';
  actionsStacked?: boolean;
}

export const Form = React.forwardRef<HTMLFormElement, FormProps>(
  ({ 
    children, 
    actionsAlign = 'end',
    actionsStacked = false,
    className = '',
    ...props 
  }, ref) => {
    const formClasses = [
      styles.form,
      className
    ].filter(Boolean).join(' ');

    const actionsClasses = [
      styles.actions,
      styles[actionsAlign],
      actionsStacked && styles.stacked
    ].filter(Boolean).join(' ');

    return (
      <form ref={ref} className={formClasses} {...props}>
        {children}
      </form>
    );
  }
);

Form.displayName = 'Form';

// Subcomponentes para mejor organización
export const FormGroup: React.FC<{ children: React.ReactNode; className?: string }> = ({ 
  children, 
  className = '' 
}) => {
  const classes = [styles.formGroup, className].filter(Boolean).join(' ');
  return <div className={classes}>{children}</div>;
};

export const FormActions: React.FC<{ 
  children: React.ReactNode; 
  align?: 'start' | 'center' | 'end';
  stacked?: boolean;
  className?: string;
}> = ({ 
  children, 
  align = 'end',
  stacked = false,
  className = '' 
}) => {
  const classes = [
    styles.actions,
    styles[align],
    stacked && styles.stacked,
    className
  ].filter(Boolean).join(' ');
  
  return <div className={classes}>{children}</div>;
};