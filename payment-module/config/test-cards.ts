export const TEST_CARDS = {
  ARGENTINA: {
    MASTERCARD: {
      number: '5031 7557 3453 0604',
      securityCode: '123',
      expirationDate: '11/25',
      document: '12345678'
    },
    VISA: {
      number: '4509 9535 6623 3704', 
      securityCode: '123',
      expirationDate: '11/25',
      document: '12345678'
    },
    AMERICAN_EXPRESS: {
      number: '3711 803032 57522',
      securityCode: '1234',
      expirationDate: '11/25',
      document: '12345678'
    },
    MASTERCARD_DEBITO: {
      number: '5287 3383 1025 3304',
      securityCode: '123',
      expirationDate: '11/25',
      document: '12345678'
    },
    VISA_DEBITO: {
      number: '4002 7686 9439 5619',
      securityCode: '123',
      expirationDate: '11/25',
      document: '12345678'
    }
  }
};

export const TEST_STATUS = {
  APRO: 'APRO',      // Pago aprobado
  OTHE: 'OTHE',      // Rechazado por error general
  CONT: 'CONT',      // Pendiente de pago
  CALL: 'CALL',      // Rechazado con validación para autorizar
  FUND: 'FUND',      // Rechazado por importe insuficiente
  SECU: 'SECU',      // Rechazado por código de seguridad inválido
  EXPI: 'EXPI',      // Rechazado por problema de fecha de vencimiento
  FORM: 'FORM'       // Rechazado por error de formulario
};