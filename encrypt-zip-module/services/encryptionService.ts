// services/encryptionService.ts
import CryptoJS from 'crypto-js';
import type { EncryptedData } from '../types/encrypt-zip';

export class EncryptionService {
  private key: string;

  constructor(key?: string) {
    this.key = key || process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'default-key-change-me';
  }

  async encryptBlob(blob: Blob): Promise<{ encrypted: Blob; iv: string }> {
    // Convertir Blob a ArrayBuffer
    const arrayBuffer = await blob.arrayBuffer();
    
    // Crear IV (Initialization Vector)
    const iv = CryptoJS.lib.WordArray.random(16);
    
    // Convertir ArrayBuffer a WordArray de CryptoJS
    const wordArray = CryptoJS.lib.WordArray.create(new Uint8Array(arrayBuffer));
    
    // Encriptar
    const encrypted = CryptoJS.AES.encrypt(wordArray, CryptoJS.enc.Utf8.parse(this.key), {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    // Convertir resultado encriptado a Blob
    const encryptedWordArray = CryptoJS.enc.Base64.parse(encrypted.toString());
    const encryptedArray:any = this.wordArrayToUint8Array(encryptedWordArray);
    
    // Solución: Crear ArrayBuffer desde Uint8Array para evitar problemas de tipos
    const encryptedBlob = new Blob([encryptedArray.buffer]);

    return {
      encrypted: encryptedBlob,
      iv: CryptoJS.enc.Base64.stringify(iv)
    };
  }

  async decryptToBlob(encryptedBlob: Blob, iv: string): Promise<Blob> {
    // Convertir Blob encriptado a ArrayBuffer
    const arrayBuffer = await encryptedBlob.arrayBuffer();
    
    // Convertir ArrayBuffer a WordArray
    const encryptedWordArray = CryptoJS.lib.WordArray.create(new Uint8Array(arrayBuffer));
    
    // Convertir a Base64 string para CryptoJS
    const encryptedBase64 = CryptoJS.enc.Base64.stringify(encryptedWordArray);
    
    // Desencriptar
    const decrypted = CryptoJS.AES.decrypt(encryptedBase64, CryptoJS.enc.Utf8.parse(this.key), {
      iv: CryptoJS.enc.Base64.parse(iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });

    // Convertir resultado a Blob
    const decryptedArray:any = this.wordArrayToUint8Array(decrypted);
    
    // Solución: Usar ArrayBuffer en lugar de Uint8Array directamente
    return new Blob([decryptedArray.buffer]);
  }

  private wordArrayToUint8Array(wordArray: CryptoJS.lib.WordArray): Uint8Array {
    const words = wordArray.words;
    const sigBytes = wordArray.sigBytes;
    const u8 = new Uint8Array(sigBytes);
    
    for (let i = 0; i < sigBytes; i++) {
      u8[i] = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
    }
    
    return u8;
  }
}

export const encryptionService = new EncryptionService();