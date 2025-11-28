import { create } from 'zustand';

export interface FormField {
  name: string;
  value: any;
  error?: string;
  touched: boolean;
}

export interface FormState {
  fields: Record<string, FormField>;
  setFieldValue: (name: string, value: any) => void;
  setFieldError: (name: string, error: string) => void;
  setFieldTouched: (name: string, touched: boolean) => void;
  getFieldValue: (name: string) => any;
  getFieldError: (name: string) => string | undefined;
  isFieldTouched: (name: string) => boolean;
  resetForm: () => void;
}

export const createFormStore = (initialValues: Record<string, any> = {}) => {
  return create<FormState>((set, get) => ({
    fields: Object.keys(initialValues).reduce((acc, key) => {
      acc[key] = {
        name: key,
        value: initialValues[key],
        touched: false,
        error: undefined
      };
      return acc;
    }, {} as Record<string, FormField>),
    
    setFieldValue: (name: string, value: any) => {
      set((state) => ({
        fields: {
          ...state.fields,
          [name]: {
            ...state.fields[name],
            value,
            touched: true
          }
        }
      }));
    },
    
    setFieldError: (name: string, error: string) => {
      set((state) => ({
        fields: {
          ...state.fields,
          [name]: {
            ...state.fields[name],
            error
          }
        }
      }));
    },
    
    setFieldTouched: (name: string, touched: boolean) => {
      set((state) => ({
        fields: {
          ...state.fields,
          [name]: {
            ...state.fields[name],
            touched
          }
        }
      }));
    },
    
    getFieldValue: (name: string) => {
      return get().fields[name]?.value;
    },
    
    getFieldError: (name: string) => {
      return get().fields[name]?.error;
    },
    
    isFieldTouched: (name: string) => {
      return get().fields[name]?.touched || false;
    },
    
    resetForm: () => {
      set({ fields: {} });
    }
  }));
};