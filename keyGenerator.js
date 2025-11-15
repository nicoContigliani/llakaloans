// keyGenerator.js

/**
 * Genera una clave AES-256 de 32 caracteres/bytes
 * @returns {string} Clave aleatoria de 32 caracteres
 */
const generateAES256Key = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    let key = '';
    
    for (let i = 0; i < 32; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      key += characters[randomIndex];
    }
    
    return key;
  };
  
  // Versión más segura
  const generateSecureAES256Key = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
    const array = new Uint32Array(32);
    
    // Para navegador y entornos modernos
    if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
      crypto.getRandomValues(array);
    }
    
    let key = '';
    for (let i = 0; i < 32; i++) {
      if (array[i] !== undefined) {
        key += characters[array[i] % characters.length];
      } else {
        // Fallback si crypto no está disponible
        key += characters[Math.floor(Math.random() * characters.length)];
      }
    }
    
    return key;
  };
  
  // Uso
  console.log('Clave AES-256 básica:', generateAES256Key());
  console.log('Clave AES-256 segura:', generateSecureAES256Key());
  console.log('Longitud:', generateAES256Key().length);