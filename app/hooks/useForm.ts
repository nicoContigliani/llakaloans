'use client';

import { useCallback, useMemo } from 'react';
import { createFormStore, FormState } from '../store/formStore';
import { useStore } from 'zustand';

export interface UseFormProps<T = Record<string, any>> {
  initialValues?: T;
  onSubmit?: (values: T) => void;
  validate?: (values: T) => Record<string, string>;
}

export const useForm = <T extends Record<string, any>>({ 
  initialValues = {} as T, 
  onSubmit, 
  validate 
}: UseFormProps<T>) => {
  // Crear el store una sola vez con useMemo
  const formStore = useMemo(() => createFormStore(initialValues), []);
  
  // Usar selectores simples para evitar recreación de objetos en cada render
  const fields = useStore(formStore, (state: FormState) => state.fields);
  
  // Calcular valores, errores y touched basado en fields
  const values = useMemo(() => 
    Object.keys(fields).reduce((acc, key) => {
      acc[key as keyof T] = fields[key].value;
      return acc;
    }, {} as T),
    [fields]
  );
  
  const errors = useMemo(() => 
    Object.keys(fields).reduce((acc, key) => {
      const error = fields[key].error;
      if (error) acc[key] = error;
      return acc;
    }, {} as Record<string, string>),
    [fields]
  );
  
  const touched = useMemo(() => 
    Object.keys(fields).reduce((acc, key) => {
      acc[key] = fields[key].touched;
      return acc;
    }, {} as Record<string, boolean>),
    [fields]
  );

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault();
    
    if (validate) {
      const validationErrors = validate(values);
      Object.keys(validationErrors).forEach(key => {
        formStore.getState().setFieldError(key, validationErrors[key]);
      });
      
      if (Object.keys(validationErrors).length > 0) {
        return;
      }
    }
    
    onSubmit?.(values);
  }, [values, onSubmit, validate, formStore]);

  const setFieldValue = useCallback(<K extends keyof T>(name: K, value: T[K]) => {
    formStore.getState().setFieldValue(name as string, value);
    
    // Clear error when user starts typing
    if (formStore.getState().getFieldError(name as string)) {
      formStore.getState().setFieldError(name as string, '');
    }
  }, [formStore]);

  const setFieldTouched = useCallback((name: keyof T, touched: boolean) => {
    formStore.getState().setFieldTouched(name as string, touched);
  }, [formStore]);

  const getFieldValue = useCallback(<K extends keyof T>(name: K): T[K] => {
    return formStore.getState().getFieldValue(name as string);
  }, [formStore]);

  const getFieldError = useCallback((name: keyof T): string | undefined => {
    return formStore.getState().getFieldError(name as string);
  }, [formStore]);

  const isFieldTouched = useCallback((name: keyof T): boolean => {
    return formStore.getState().isFieldTouched(name as string);
  }, [formStore]);

  const resetForm = useCallback(() => {
    formStore.getState().resetForm();
  }, [formStore]);

  return {
    values,
    errors,
    touched,
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    getFieldValue,
    getFieldError,
    isFieldTouched,
    resetForm
  };
};