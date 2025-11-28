// components/Steps/Steps.tsx
'use client';

import React from 'react';
import styles from './Steps.module.css';

export interface Step {
  id: string;
  label: string;
  description?: string;
  completed?: boolean;
  disabled?: boolean;
}

export interface StepsProps {
  steps: Step[];
  currentStep: number;
  onStepClick?: (stepIndex: number) => void;
  orientation?: 'horizontal' | 'vertical';
  variant?: 'default' | 'compact';
  showLabels?: boolean;
  showConnectors?: boolean;
}

export const Steps: React.FC<StepsProps> = ({
  steps,
  currentStep,
  onStepClick,
  orientation = 'horizontal',
  variant = 'default',
  showLabels = true,
  showConnectors = true
}) => {
  const isStepAccessible = (index: number, step: Step) => {
    if (step.disabled) return false;
    return index <= currentStep || steps.slice(0, index).every(s => s.completed);
  };

  const handleStepClick = (index: number, step: Step) => {
    if (onStepClick && isStepAccessible(index, step)) {
      onStepClick(index);
    }
  };

  const StepIcon = ({ step, index }: { step: Step; index: number }) => {
    const isCompleted = step.completed || index < currentStep;
    const isCurrent = index === currentStep;
    const isAccessible = isStepAccessible(index, step);

    if (isCompleted) {
      return (
        <div className={`${styles.stepIcon} ${styles.stepIconCompleted}`}>
          <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
            <path d="M13.78 4.22a.75.75 0 010 1.06l-7.25 7.25a.75.75 0 01-1.06 0L2.22 9.28a.75.75 0 011.06-1.06L6 10.94l6.72-6.72a.75.75 0 011.06 0z"/>
          </svg>
        </div>
      );
    }

    return (
      <div 
        className={`${styles.stepIcon} ${
          isCurrent ? styles.stepIconCurrent : 
          isAccessible ? styles.stepIconAccessible : 
          styles.stepIconDisabled
        }`}
      >
        {index + 1}
      </div>
    );
  };

  const StepConnector = ({ isCompleted }: { isCompleted: boolean }) => (
    <div className={`${styles.stepConnector} ${isCompleted ? styles.stepConnectorCompleted : ''}`} />
  );

  return (
    <div 
      className={`${styles.stepsContainer} ${
        orientation === 'vertical' ? styles.stepsVertical : styles.stepsHorizontal
      } ${variant === 'compact' ? styles.stepsCompact : ''}`}
    >
      {steps.map((step, index) => (
        <React.Fragment key={step.id}>
          <div 
            className={`${styles.step} ${
              isStepAccessible(index, step) ? styles.stepAccessible : styles.stepDisabled
            } ${index === currentStep ? styles.stepCurrent : ''}`}
            onClick={() => handleStepClick(index, step)}
          >
            <StepIcon step={step} index={index} />
            
            {(showLabels || variant !== 'compact') && (
              <div className={styles.stepContent}>
                <span className={styles.stepLabel}>
                  {step.label}
                </span>
                {step.description && variant === 'default' && (
                  <span className={styles.stepDescription}>
                    {step.description}
                  </span>
                )}
              </div>
            )}
          </div>

          {showConnectors && index < steps.length - 1 && (
            <StepConnector isCompleted={index < currentStep} />
          )}
        </React.Fragment>
      ))}
    </div>
  );
};

export default Steps;