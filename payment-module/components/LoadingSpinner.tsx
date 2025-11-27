// components/LoadingSpinner.tsx
'use client';

export const LoadingSpinner = () => (
  <div style={{
    width: '16px',
    height: '16px',
    border: '2px solid transparent',
    borderTop: '2px solid currentColor',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite'
  }} />
);