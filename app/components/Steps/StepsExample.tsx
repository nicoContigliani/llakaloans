// Ejemplo de uso básico
'use client';

import { useState } from 'react';
import { Step, Steps } from './Steps';

const MyFormWithSteps = () => {
  const [currentStep, setCurrentStep] = useState(0);

  const steps: Step[] = [
    {
      id: 'personal-info',
      label: 'Información Personal',
      description: 'Completa tus datos básicos',
      completed: false
    },
    {
      id: 'contact-info',
      label: 'Contacto',
      description: 'Agrega tu información de contacto',
      completed: false
    },
    {
      id: 'preferences',
      label: 'Preferencias',
      description: 'Configura tus preferencias',
      completed: false,
      disabled: true
    },
    {
      id: 'confirmation',
      label: 'Confirmación',
      description: 'Revisa y confirma tu información',
      completed: false
    }
  ];

  return (
    <div>
      <Steps
        steps={steps}
        currentStep={currentStep}
        onStepClick={setCurrentStep}
        orientation="horizontal"
        variant="default"
        showLabels={true}
        showConnectors={true}
      />
      
      {/* Tu contenido del formulario por paso */}
      <div style={{ marginTop: '2rem' }}>
        {currentStep === 0 && <div>Formulario paso 1</div>}
        {currentStep === 1 && <div>Formulario paso 2</div>}
        {currentStep === 2 && <div>Formulario paso 3</div>}
        {currentStep === 3 && <div>Formulario paso 4</div>}
      </div>
    </div>
  );
};

export default MyFormWithSteps;



// // Ejemplo de uso básico
// 'use client';

// import { useState } from 'react';
// import { Steps, Step } from '@/components/Steps';

// const MyFormWithSteps = () => {
//   const [currentStep, setCurrentStep] = useState(0);

//   const steps: Step[] = [
//     {
//       id: 'personal-info',
//       label: 'Información Personal',
//       description: 'Completa tus datos básicos',
//       completed: false
//     },
//     {
//       id: 'contact-info',
//       label: 'Contacto',
//       description: 'Agrega tu información de contacto',
//       completed: false
//     },
//     {
//       id: 'preferences',
//       label: 'Preferencias',
//       description: 'Configura tus preferencias',
//       completed: false,
//       disabled: true
//     },
//     {
//       id: 'confirmation',
//       label: 'Confirmación',
//       description: 'Revisa y confirma tu información',
//       completed: false
//     }
//   ];

//   return (
//     <div>
//       <Steps
//         steps={steps}
//         currentStep={currentStep}
//         onStepClick={setCurrentStep}
//         orientation="horizontal"
//         variant="default"
//         showLabels={true}
//         showConnectors={true}
//       />
      
//       {/* Tu contenido del formulario por paso */}
//       <div style={{ marginTop: '2rem' }}>
//         {currentStep === 0 && <div>Formulario paso 1</div>}
//         {currentStep === 1 && <div>Formulario paso 2</div>}
//         {currentStep === 2 && <div>Formulario paso 3</div>}
//         {currentStep === 3 && <div>Formulario paso 4</div>}
//       </div>
//     </div>
//   );
// };