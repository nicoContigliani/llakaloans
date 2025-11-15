// // // // // // // // hooks/useDownload.ts
// // // // // // // import { useState } from 'react';
// // // // // // // import { zipService } from '../services/zipService';
// // // // // // // import { encryptionService } from '../services/encryptionService';
// // // // // // // import { supabaseService } from '../services/supabaseService';
// // // // // // // import { mongoService } from '../services/mongoService';
// // // // // // // import type { DownloadProgress } from '../types/encrypt-zip';

// // // // // // // export function useDownload() {
// // // // // // //   const [downloads, setDownloads] = useState<DownloadProgress[]>([]);

// // // // // // //   const downloadFile = async (fileId: string) => {
// // // // // // //     const progress: DownloadProgress = {
// // // // // // //       id: fileId,
// // // // // // //       name: '',
// // // // // // //       status: 'idle',
// // // // // // //       progress: 0
// // // // // // //     };

// // // // // // //     setDownloads(prev => [...prev, progress]);

// // // // // // //     try {
// // // // // // //       // 1. Obtener metadata
// // // // // // //       const metadata = await mongoService.getMetadata(fileId);
// // // // // // //       if (!metadata) throw new Error('Metadata not found');

// // // // // // //       setDownloads(prev => prev.map(d => 
// // // // // // //         d.id === fileId ? { ...d, name: metadata.originalName, status: 'downloading', progress: 25 } : d
// // // // // // //       ));

// // // // // // //       // 2. Descargar archivo encriptado
// // // // // // //       const encryptedBlob = await supabaseService.downloadFile(metadata.encryptedPath);
// // // // // // //       const encryptedText = await encryptedBlob.text();

// // // // // // //       // 3. Desencriptar
// // // // // // //       setDownloads(prev => prev.map(d => 
// // // // // // //         d.id === fileId ? { ...d, status: 'decrypting', progress: 50 } : d
// // // // // // //       ));
// // // // // // //       const decryptedBlob = await encryptionService.decryptToBlob(encryptedText, metadata.iv);

// // // // // // //       // 4. Extraer ZIP
// // // // // // //       setDownloads(prev => prev.map(d => 
// // // // // // //         d.id === fileId ? { ...d, status: 'extracting', progress: 75 } : d
// // // // // // //       ));
// // // // // // //       const files = await zipService.extractZip(decryptedBlob);

// // // // // // //       // 5. Descargar archivos
// // // // // // //       for (const file of files) {
// // // // // // //         const url = URL.createObjectURL(file);
// // // // // // //         const a = document.createElement('a');
// // // // // // //         a.href = url;
// // // // // // //         a.download = file.name;
// // // // // // //         a.click();
// // // // // // //         URL.revokeObjectURL(url);
// // // // // // //       }

// // // // // // //       setDownloads(prev => prev.map(d => 
// // // // // // //         d.id === fileId ? { ...d, status: 'done', progress: 100 } : d
// // // // // // //       ));
// // // // // // //     } catch (error) {
// // // // // // //       setDownloads(prev => prev.map(d => 
// // // // // // //         d.id === fileId ? { ...d, status: 'error', error: (error as Error).message } : d
// // // // // // //       ));
// // // // // // //       throw error;
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const clearDownloads = () => setDownloads([]);

// // // // // // //   return { downloads, downloadFile, clearDownloads };
// // // // // // // }



// // // // // // // hooks/useDownload.ts
// // // // // // import { useState } from 'react';
// // // // // // import { zipService } from '../services/zipService';
// // // // // // import { encryptionService } from '../services/encryptionService';
// // // // // // import { supabaseService } from '../services/supabaseService';
// // // // // // import { mongoService } from '../services/mongoService';
// // // // // // import type { DownloadProgress } from '../types/encrypt-zip';

// // // // // // export function useDownload() {
// // // // // //   const [downloads, setDownloads] = useState<DownloadProgress[]>([]);

// // // // // //   const downloadFile = async (fileId: string) => {
// // // // // //     const progressId = `${fileId}-${Date.now()}`;
// // // // // //     const progress: DownloadProgress = {
// // // // // //       id: progressId,
// // // // // //       name: '',
// // // // // //       status: 'idle',
// // // // // //       progress: 0
// // // // // //     };

// // // // // //     setDownloads(prev => [...prev, progress]);

// // // // // //     try {
// // // // // //       // 1. Obtener metadata
// // // // // //       const metadata = await mongoService.getMetadata(fileId);
// // // // // //       if (!metadata) throw new Error('Metadata not found');

// // // // // //       setDownloads(prev => prev.map(d => 
// // // // // //         d.id === progressId ? { ...d, name: metadata.originalName, status: 'downloading', progress: 25 } : d
// // // // // //       ));

// // // // // //       // 2. Descargar archivo encriptado
// // // // // //       const encryptedBlob = await supabaseService.downloadFile(metadata.encryptedPath);
      
// // // // // //       setDownloads(prev => prev.map(d => 
// // // // // //         d.id === progressId ? { ...d, status: 'decrypting', progress: 50 } : d
// // // // // //       ));
      
// // // // // //       // 3. Desencriptar
// // // // // //       const encryptedText = await encryptedBlob.text();
// // // // // //       const decryptedBlob = await encryptionService.decryptToBlob(encryptedText, metadata.iv);

// // // // // //       // 4. Extraer ZIP
// // // // // //       setDownloads(prev => prev.map(d => 
// // // // // //         d.id === progressId ? { ...d, status: 'extracting', progress: 75 } : d
// // // // // //       ));
      
// // // // // //       const files = await zipService.extractZip(decryptedBlob);

// // // // // //       // 5. Descargar archivos
// // // // // //       if (files.length === 1) {
// // // // // //         // Un solo archivo: descargar directamente
// // // // // //         const url = URL.createObjectURL(files[0]);
// // // // // //         const a = document.createElement('a');
// // // // // //         a.href = url;
// // // // // //         a.download = files[0].name;
// // // // // //         a.click();
// // // // // //         URL.revokeObjectURL(url);
// // // // // //       } else {
// // // // // //         // Múltiples archivos: descargar individualmente
// // // // // //         for (const file of files) {
// // // // // //           const url = URL.createObjectURL(file);
// // // // // //           const a = document.createElement('a');
// // // // // //           a.href = url;
// // // // // //           a.download = file.name;
// // // // // //           a.click();
// // // // // //           URL.revokeObjectURL(url);
// // // // // //         }
// // // // // //       }

// // // // // //       setDownloads(prev => prev.map(d => 
// // // // // //         d.id === progressId ? { ...d, status: 'done', progress: 100 } : d
// // // // // //       ));
// // // // // //     } catch (error) {
// // // // // //       setDownloads(prev => prev.map(d => 
// // // // // //         d.id === progressId ? { ...d, status: 'error', error: (error as Error).message } : d
// // // // // //       ));
// // // // // //       throw error;
// // // // // //     }
// // // // // //   };

// // // // // //   const clearDownloads = () => setDownloads([]);

// // // // // //   return { downloads, downloadFile, clearDownloads };
// // // // // // }

// // // // // // hooks/useDownload.ts
// // // // // import { useState } from 'react';
// // // // // import { zipService } from '../services/zipService';
// // // // // import { encryptionService } from '../services/encryptionService';
// // // // // import { supabaseService } from '../services/supabaseService';
// // // // // import { mongoService } from '../services/mongoService';
// // // // // import type { DownloadProgress } from '../types/encrypt-zip';

// // // // // export function useDownload() {
// // // // //   const [downloads, setDownloads] = useState<DownloadProgress[]>([]);

// // // // //   const downloadFile = async (fileId: string) => {
// // // // //     const progressId = `${fileId}-${Date.now()}`;
// // // // //     const progress: DownloadProgress = {
// // // // //       id: progressId,
// // // // //       name: '',
// // // // //       status: 'idle',
// // // // //       progress: 0
// // // // //     };

// // // // //     setDownloads(prev => [...prev, progress]);

// // // // //     try {
// // // // //       // 1. Obtener metadata
// // // // //       const metadata = await mongoService.getMetadata(fileId);
// // // // //       if (!metadata) throw new Error('Metadata not found');

// // // // //       setDownloads(prev => prev.map(d => 
// // // // //         d.id === progressId ? { ...d, name: metadata.originalName, status: 'downloading', progress: 25 } : d
// // // // //       ));

// // // // //       // 2. Descargar archivo encriptado
// // // // //       const encryptedBlob = await supabaseService.downloadFile(metadata.encryptedPath);
      
// // // // //       setDownloads(prev => prev.map(d => 
// // // // //         d.id === progressId ? { ...d, status: 'decrypting', progress: 50 } : d
// // // // //       ));
      
// // // // //       // 3. Desencriptar
// // // // //       const encryptedText = await encryptedBlob.text();
// // // // //       const decryptedBlob = await encryptionService.decryptToBlob(encryptedText, metadata.iv);

// // // // //       // 4. Extraer ZIP
// // // // //       setDownloads(prev => prev.map(d => 
// // // // //         d.id === progressId ? { ...d, status: 'extracting', progress: 75 } : d
// // // // //       ));
      
// // // // //       const files = await zipService.extractZip(decryptedBlob);

// // // // //       // 5. Descargar archivos
// // // // //       if (files.length === 1) {
// // // // //         // Un solo archivo: descargar directamente
// // // // //         const url = URL.createObjectURL(files[0]);
// // // // //         const a = document.createElement('a');
// // // // //         a.href = url;
// // // // //         a.download = files[0].name;
// // // // //         a.click();
// // // // //         URL.revokeObjectURL(url);
// // // // //       } else {
// // // // //         // Múltiples archivos: descargar individualmente
// // // // //         for (const file of files) {
// // // // //           const url = URL.createObjectURL(file);
// // // // //           const a = document.createElement('a');
// // // // //           a.href = url;
// // // // //           a.download = file.name;
// // // // //           a.click();
// // // // //           URL.revokeObjectURL(url);
// // // // //         }
// // // // //       }

// // // // //       setDownloads(prev => prev.map(d => 
// // // // //         d.id === progressId ? { ...d, status: 'done', progress: 100 } : d
// // // // //       ));
// // // // //     } catch (error) {
// // // // //       setDownloads(prev => prev.map(d => 
// // // // //         d.id === progressId ? { ...d, status: 'error', error: (error as Error).message } : d
// // // // //       ));
// // // // //       throw error;
// // // // //     }
// // // // //   };

// // // // //   const clearDownloads = () => setDownloads([]);

// // // // //   return { downloads, downloadFile, clearDownloads };
// // // // // }


// // // // // hooks/useDownload.ts
// // // // import { useState } from 'react';
// // // // import { zipService } from '../services/zipService';
// // // // import { encryptionService } from '../services/encryptionService';
// // // // import { supabaseService } from '../services/supabaseService';
// // // // import type { DownloadProgress } from '../types/encrypt-zip';

// // // // export function useDownload() {
// // // //   const [downloads, setDownloads] = useState<DownloadProgress[]>([]);

// // // //   const downloadFile = async (fileId: string) => {
// // // //     const progressId = `${fileId}-${Date.now()}`;
// // // //     const progress: DownloadProgress = {
// // // //       id: progressId,
// // // //       name: '',
// // // //       status: 'idle',
// // // //       progress: 0
// // // //     };

// // // //     setDownloads(prev => [...prev, progress]);

// // // //     try {
// // // //       // 1. Obtener metadata via API
// // // //       const response = await fetch(`/api/files/${fileId}`);
// // // //       if (!response.ok) throw new Error('Failed to fetch file metadata');
      
// // // //       const metadata = await response.json();
// // // //       if (!metadata) throw new Error('Metadata not found');

// // // //       setDownloads(prev => prev.map(d => 
// // // //         d.id === progressId ? { ...d, name: metadata.originalName, status: 'downloading', progress: 25 } : d
// // // //       ));

// // // //       // 2. Descargar archivo encriptado
// // // //       const encryptedBlob = await supabaseService.downloadFile(metadata.encryptedPath);
      
// // // //       setDownloads(prev => prev.map(d => 
// // // //         d.id === progressId ? { ...d, status: 'decrypting', progress: 50 } : d
// // // //       ));
      
// // // //       // 3. Desencriptar
// // // //       const encryptedText = await encryptedBlob.text();
// // // //       const decryptedBlob = await encryptionService.decryptToBlob(encryptedText, metadata.iv);

// // // //       // 4. Extraer ZIP
// // // //       setDownloads(prev => prev.map(d => 
// // // //         d.id === progressId ? { ...d, status: 'extracting', progress: 75 } : d
// // // //       ));
      
// // // //       const files = await zipService.extractZip(decryptedBlob);

// // // //       // 5. Descargar archivos
// // // //       if (files.length === 1) {
// // // //         const url = URL.createObjectURL(files[0]);
// // // //         const a = document.createElement('a');
// // // //         a.href = url;
// // // //         a.download = files[0].name;
// // // //         a.click();
// // // //         URL.revokeObjectURL(url);
// // // //       } else {
// // // //         for (const file of files) {
// // // //           const url = URL.createObjectURL(file);
// // // //           const a = document.createElement('a');
// // // //           a.href = url;
// // // //           a.download = file.name;
// // // //           a.click();
// // // //           URL.revokeObjectURL(url);
// // // //         }
// // // //       }

// // // //       setDownloads(prev => prev.map(d => 
// // // //         d.id === progressId ? { ...d, status: 'done', progress: 100 } : d
// // // //       ));
// // // //     } catch (error) {
// // // //       setDownloads(prev => prev.map(d => 
// // // //         d.id === progressId ? { ...d, status: 'error', error: (error as Error).message } : d
// // // //       ));
// // // //       throw error;
// // // //     }
// // // //   };

// // // //   const clearDownloads = () => setDownloads([]);

// // // //   return { downloads, downloadFile, clearDownloads };
// // // // }




// // // // hooks/useDownload.ts
// // // import { useState } from 'react';
// // // import { zipService } from '../services/zipService';
// // // import { encryptionService } from '../services/encryptionService';
// // // import { supabaseService } from '../services/supabaseService';
// // // import type { DownloadProgress } from '../types/encrypt-zip';

// // // export function useDownload() {
// // //   const [downloads, setDownloads] = useState<DownloadProgress[]>([]);

// // //   const downloadFile = async (fileId: string) => {
// // //     const progressId = `${fileId}-${Date.now()}`;
// // //     const progress: DownloadProgress = {
// // //       id: progressId,
// // //       name: '',
// // //       status: 'idle',
// // //       progress: 0
// // //     };

// // //     setDownloads(prev => [...prev, progress]);

// // //     try {
// // //       // 1. Obtener metadata via API
// // //       const response = await fetch(`/api/files/${fileId}`);
// // //       if (!response.ok) {
// // //         const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
// // //         throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
// // //       }
      
// // //       const metadata = await response.json();
// // //       if (!metadata || metadata.error) {
// // //         throw new Error(metadata?.error || 'Metadata not found');
// // //       }

// // //       setDownloads(prev => prev.map(d => 
// // //         d.id === progressId ? { ...d, name: metadata.originalName, status: 'downloading', progress: 25 } : d
// // //       ));

// // //       // 2. Descargar archivo encriptado de Supabase
// // //       const encryptedBlob = await supabaseService.downloadFile(metadata.encryptedPath);
      
// // //       setDownloads(prev => prev.map(d => 
// // //         d.id === progressId ? { ...d, status: 'decrypting', progress: 50 } : d
// // //       ));
      
// // //       // 3. Desencriptar
// // //       const encryptedText = await encryptedBlob.text();
// // //       const decryptedBlob = await encryptionService.decryptToBlob(encryptedText, metadata.iv);

// // //       // 4. Extraer ZIP
// // //       setDownloads(prev => prev.map(d => 
// // //         d.id === progressId ? { ...d, status: 'extracting', progress: 75 } : d
// // //       ));
      
// // //       const files = await zipService.extractZip(decryptedBlob);

// // //       // 5. Descargar archivos
// // //       if (files.length === 1) {
// // //         const url = URL.createObjectURL(files[0]);
// // //         const a = document.createElement('a');
// // //         a.href = url;
// // //         a.download = files[0].name;
// // //         document.body.appendChild(a);
// // //         a.click();
// // //         document.body.removeChild(a);
// // //         URL.revokeObjectURL(url);
// // //       } else {
// // //         for (const file of files) {
// // //           const url = URL.createObjectURL(file);
// // //           const a = document.createElement('a');
// // //           a.href = url;
// // //           a.download = file.name;
// // //           document.body.appendChild(a);
// // //           a.click();
// // //           document.body.removeChild(a);
// // //           URL.revokeObjectURL(url);
// // //         }
// // //       }

// // //       setDownloads(prev => prev.map(d => 
// // //         d.id === progressId ? { ...d, status: 'done', progress: 100 } : d
// // //       ));
// // //     } catch (error) {
// // //       console.error('Download error:', error);
// // //       setDownloads(prev => prev.map(d => 
// // //         d.id === progressId ? { 
// // //           ...d, 
// // //           status: 'error', 
// // //           error: error instanceof Error ? error.message : 'Unknown error occurred' 
// // //         } : d
// // //       ));
// // //       throw error;
// // //     }
// // //   };

// // //   const clearDownloads = () => setDownloads([]);

// // //   return { downloads, downloadFile, clearDownloads };
// // // }



// // // hooks/useDownload.ts
// // import { useState } from 'react';
// // import { zipService } from '../services/zipService';
// // import { encryptionService } from '../services/encryptionService';
// // import { supabaseService } from '../services/supabaseService';
// // import type { DownloadProgress } from '../types/encrypt-zip';

// // export function useDownload() {
// //   const [downloads, setDownloads] = useState<DownloadProgress[]>([]);

// //   const downloadFile = async (fileId: string) => {
// //     const progressId = `${fileId}-${Date.now()}`;
// //     const progress: DownloadProgress = {
// //       id: progressId,
// //       name: '',
// //       status: 'idle',
// //       progress: 0
// //     };

// //     setDownloads(prev => [...prev, progress]);

// //     try {
// //       console.log('1. Obteniendo metadata...');
      
// //       // 1. Obtener metadata via API
// //       const response = await fetch(`/api/files/${fileId}`);
// //       if (!response.ok) {
// //         const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
// //         throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
// //       }
      
// //       const metadata = await response.json();
// //       if (!metadata || metadata.error) {
// //         throw new Error(metadata?.error || 'Metadata not found');
// //       }

// //       setDownloads(prev => prev.map(d => 
// //         d.id === progressId ? { ...d, name: metadata.originalName, status: 'downloading', progress: 25 } : d
// //       ));

// //       console.log('2. Descargando archivo encriptado de Supabase...');
      
// //       // 2. Descargar archivo encriptado de Supabase (como Blob)
// //       const encryptedBlob = await supabaseService.downloadFile(metadata.encryptedPath);
// //       console.log('3. Archivo encriptado descargado, tamaño:', encryptedBlob.size, 'bytes');
      
// //       setDownloads(prev => prev.map(d => 
// //         d.id === progressId ? { ...d, status: 'decrypting', progress: 50 } : d
// //       ));
      
// //       // 3. Desencriptar (recibe Blob, retorna Blob)
// //       console.log('4. Desencriptando...');
// //       const decryptedBlob = await encryptionService.decryptToBlob(encryptedBlob, metadata.iv);
// //       console.log('5. Archivo desencriptado, tamaño:', decryptedBlob.size, 'bytes');

// //       // 4. Extraer ZIP
// //       setDownloads(prev => prev.map(d => 
// //         d.id === progressId ? { ...d, status: 'extracting', progress: 75 } : d
// //       ));
      
// //       console.log('6. Extrayendo archivos del ZIP...');
// //       const files = await zipService.extractZip(decryptedBlob);
// //       console.log('7. Extraídos', files.length, 'archivos');

// //       // 5. Descargar archivos
// //       console.log('8. Iniciando descargas...');
// //       if (files.length === 1) {
// //         // Un solo archivo
// //         const file = files[0];
// //         const url = URL.createObjectURL(file);
// //         const a = document.createElement('a');
// //         a.href = url;
// //         a.download = file.name;
// //         document.body.appendChild(a);
// //         a.click();
// //         document.body.removeChild(a);
// //         URL.revokeObjectURL(url);
// //         console.log('9. Archivo descargado:', file.name);
// //       } else {
// //         // Múltiples archivos - descargar como ZIP o individualmente
// //         // Por ahora los descargamos individualmente
// //         for (const file of files) {
// //           const url = URL.createObjectURL(file);
// //           const a = document.createElement('a');
// //           a.href = url;
// //           a.download = file.name;
// //           document.body.appendChild(a);
// //           a.click();
// //           document.body.removeChild(a);
// //           URL.revokeObjectURL(url);
// //           console.log('9. Archivo descargado:', file.name);
// //         }
// //       }

// //       setDownloads(prev => prev.map(d => 
// //         d.id === progressId ? { ...d, status: 'done', progress: 100 } : d
// //       ));
// //       console.log('10. Descarga completada');
      
// //     } catch (error) {
// //       console.error('Download error:', error);
// //       setDownloads(prev => prev.map(d => 
// //         d.id === progressId ? { 
// //           ...d, 
// //           status: 'error', 
// //           error: error instanceof Error ? error.message : 'Unknown error occurred' 
// //         } : d
// //       ));
// //       throw error;
// //     }
// //   };

// //   const clearDownloads = () => setDownloads([]);

// //   return { downloads, downloadFile, clearDownloads };
// // }




// // hooks/useDownload.ts
// import { useState } from 'react';
// import { zipService } from '../services/zipService';
// import { encryptionService } from '../services/encryptionService';
// import { supabaseService } from '../services/supabaseService';
// import type { DownloadProgress, FileItem } from '../types/encrypt-zip';

// export function useDownload() {
//   const [downloads, setDownloads] = useState<DownloadProgress[]>([]);

//   const downloadFile = async (fileId: string) => {
//     const progressId = `${fileId}-${Date.now()}`;
//     const progress: DownloadProgress = {
//       id: progressId,
//       name: '',
//       status: 'idle',
//       progress: 0
//     };

//     setDownloads(prev => [...prev, progress]);

//     try {
//       console.log('1. Obteniendo metadata...');
      
//       // 1. Obtener metadata via API
//       const response = await fetch(`/api/files/${fileId}`);
//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
//         throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
//       }
      
//       const metadata = await response.json();
//       if (!metadata || metadata.error) {
//         throw new Error(metadata?.error || 'Metadata not found');
//       }

//       setDownloads(prev => prev.map(d => 
//         d.id === progressId ? { ...d, name: metadata.originalName, status: 'downloading', progress: 25 } : d
//       ));

//       console.log('2. Descargando archivo encriptado de Supabase...');
      
//       // 2. Descargar archivo encriptado de Supabase (como Blob)
//       const encryptedBlob = await supabaseService.downloadFile(metadata.encryptedPath);
//       console.log('3. Archivo encriptado descargado, tamaño:', encryptedBlob.size, 'bytes');
      
//       setDownloads(prev => prev.map(d => 
//         d.id === progressId ? { ...d, status: 'decrypting', progress: 50 } : d
//       ));
      
//       // 3. Desencriptar (recibe Blob, retorna Blob)
//       console.log('4. Desencriptando...');
//       const decryptedBlob = await encryptionService.decryptToBlob(encryptedBlob, metadata.iv);
//       console.log('5. Archivo desencriptado, tamaño:', decryptedBlob.size, 'bytes');

//       // 4. Extraer ZIP
//       setDownloads(prev => prev.map(d => 
//         d.id === progressId ? { ...d, status: 'extracting', progress: 75 } : d
//       ));
      
//       console.log('6. Extrayendo archivos del ZIP...');
//       const files = await zipService.extractZip(decryptedBlob);
//       console.log('7. Extraídos', files.length, 'archivos');

//       // 5. Descargar el ZIP completo (no archivos individuales)
//       console.log('8. Preparando descarga del ZIP completo...');
      
//       // Crear FileItems para el zipService
//       const fileItems: FileItem[] = files.map((file, index) => ({
//         id: `file-${index}`,
//         file: file,
//         relativePath: file.name // Mantener la estructura de paths del ZIP original
//       }));

//       // Crear un nuevo ZIP que preserve la estructura completa
//       const downloadZipBlob = await zipService.createZip(fileItems);
//       console.log('9. ZIP de descarga creado, tamaño:', downloadZipBlob.size, 'bytes');

//       // Descargar el ZIP completo
//       const url = URL.createObjectURL(downloadZipBlob);
//       const a = document.createElement('a');
//       a.href = url;
      
//       // Nombre del archivo de descarga
//       let downloadName = metadata.originalName;
//       if (!downloadName.endsWith('.zip')) {
//         downloadName = downloadName.replace(/\.zip$/, '') + '.zip';
//       }
      
//       a.download = downloadName;
//       document.body.appendChild(a);
//       a.click();
//       document.body.removeChild(a);
//       URL.revokeObjectURL(url);
      
//       console.log('10. ZIP descargado:', downloadName);
//       console.log('11. Contenido:', files.length, 'archivos');

//       setDownloads(prev => prev.map(d => 
//         d.id === progressId ? { ...d, status: 'done', progress: 100 } : d
//       ));
//       console.log('12. Descarga completada exitosamente');
      
//     } catch (error) {
//       console.error('❌ Download error:', error);
//       setDownloads(prev => prev.map(d => 
//         d.id === progressId ? { 
//           ...d, 
//           status: 'error', 
//           error: error instanceof Error ? error.message : 'Unknown error occurred' 
//         } : d
//       ));
//       throw error;
//     }
//   };

//   const clearDownloads = () => setDownloads([]);

//   return { downloads, downloadFile, clearDownloads };
// }





// hooks/useDownload.ts
import { useState } from 'react';
import { zipService } from '../services/zipService';
import { encryptionService } from '../services/encryptionService';
import { supabaseService } from '../services/supabaseService';
import type { DownloadProgress, FileItem } from '../types/encrypt-zip';

export function useDownload() {
  const [downloads, setDownloads] = useState<DownloadProgress[]>([]);

  const downloadFile = async (fileId: string) => {
    const progressId = `${fileId}-${Date.now()}`;
    const progress: DownloadProgress = {
      id: progressId,
      name: '',
      status: 'idle',
      progress: 0
    };

    setDownloads(prev => [...prev, progress]);

    try {
      console.log('1. 🗂️ Obteniendo metadata...');
      
      // 1. Obtener metadata via API
      const response = await fetch(`/api/files/${fileId}`);
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
      }
      
      const metadata = await response.json();
      if (!metadata || metadata.error) {
        throw new Error(metadata?.error || 'Metadata not found');
      }

      console.log('2. 📋 Metadata obtenida:', metadata.originalName);
      console.log('   - Es carpeta:', metadata.isFolder);
      console.log('   - Número de archivos:', metadata.fileCount);

      setDownloads(prev => prev.map(d => 
        d.id === progressId ? { ...d, name: metadata.originalName, status: 'downloading', progress: 25 } : d
      ));

      console.log('3. ☁️ Descargando archivo encriptado de Supabase...');
      
      // 2. Descargar archivo encriptado de Supabase (como Blob)
      const encryptedBlob = await supabaseService.downloadFile(metadata.encryptedPath);
      console.log('4. ✅ Archivo encriptado descargado, tamaño:', encryptedBlob.size, 'bytes');
      
      setDownloads(prev => prev.map(d => 
        d.id === progressId ? { ...d, status: 'decrypting', progress: 50 } : d
      ));
      
      // 3. Desencriptar (recibe Blob, retorna Blob)
      console.log('5. 🔓 Desencriptando...');
      const decryptedBlob = await encryptionService.decryptToBlob(encryptedBlob, metadata.iv);
      console.log('6. ✅ Archivo desencriptado, tamaño:', decryptedBlob.size, 'bytes');

      // 4. Extraer ZIP
      setDownloads(prev => prev.map(d => 
        d.id === progressId ? { ...d, status: 'extracting', progress: 75 } : d
      ));
      
      console.log('7. 📤 Extrayendo archivos del ZIP...');
      const files = await zipService.extractZip(decryptedBlob);
      console.log('8. ✅ Extraídos', files.length, 'archivos');

      // 5. Verificar que se extrajeron todos los archivos
      if (files.length !== metadata.fileCount) {
        console.warn(`⚠️  Número de archivos extraídos (${files.length}) no coincide con metadata (${metadata.fileCount})`);
      }

      // 6. Descargar el ZIP completo con todos los archivos
      console.log('9. 📦 Preparando descarga del ZIP completo...');
      
      // Crear FileItems para el zipService manteniendo la estructura
      const fileItems: FileItem[] = files.map((file, index) => ({
        id: `file-${index}`,
        file: file,
        relativePath: file.name // Mantener la estructura de paths del ZIP original
      }));

      // Crear un nuevo ZIP que preserve la estructura completa
      console.log('10. 🛠️ Creando ZIP de descarga...');
      const downloadZipBlob = await zipService.createZip(fileItems);
      console.log('11. ✅ ZIP de descarga creado, tamaño:', downloadZipBlob.size, 'bytes');

      // Preparar nombre de descarga
      let downloadName = metadata.originalName;
      if (!downloadName.endsWith('.zip')) {
        downloadName += '.zip';
      }

      // Descargar el ZIP completo
      console.log('12. ⬇️ Iniciando descarga:', downloadName);
      const url = URL.createObjectURL(downloadZipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = downloadName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      console.log('13. 🎉 Descarga completada:', downloadName);
      console.log('14. 📊 Resumen:');
      console.log('   - Archivos en el ZIP:', files.length);
      console.log('   - Tamaño del ZIP:', downloadZipBlob.size, 'bytes');
      files.forEach((file, index) => {
        console.log(`   ${index + 1}. ${file.name} (${file.size} bytes)`);
      });

      setDownloads(prev => prev.map(d => 
        d.id === progressId ? { ...d, status: 'done', progress: 100 } : d
      ));
      
    } catch (error) {
      console.error('❌ Download error:', error);
      setDownloads(prev => prev.map(d => 
        d.id === progressId ? { 
          ...d, 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Unknown error occurred' 
        } : d
      ));
      throw error;
    }
  };

  const clearDownloads = () => setDownloads([]);

  return { downloads, downloadFile, clearDownloads };
}