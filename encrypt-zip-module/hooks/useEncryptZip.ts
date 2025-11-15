// // // // // // // // // hooks/useEncryptZip.ts
// // // // // // // // import { useState } from 'react';
// // // // // // // // import { zipService } from '../services/zipService';
// // // // // // // // import { encryptionService } from '../services/encryptionService';
// // // // // // // // import { supabaseService } from '../services/supabaseService';
// // // // // // // // import { mongoService } from '../services/mongoService';
// // // // // // // // import { generateId } from '../utils/fileUtils';
// // // // // // // // import type { FileItem, UploadProgress, FileMetadata } from '../types/encrypt-zip';

// // // // // // // // export function useEncryptZip(userId?: string) {
// // // // // // // //   const [uploads, setUploads] = useState<UploadProgress[]>([]);

// // // // // // // //   const uploadFiles = async (files: FileItem[]) => {
// // // // // // // //     const uploadId = generateId();
// // // // // // // //     const fileName = files.length === 1 ? files[0].file.name : `archive-${Date.now()}.zip`;

// // // // // // // //     const progress: UploadProgress = {
// // // // // // // //       id: uploadId,
// // // // // // // //       name: fileName,
// // // // // // // //       status: 'idle',
// // // // // // // //       progress: 0
// // // // // // // //     };

// // // // // // // //     setUploads(prev => [...prev, progress]);

// // // // // // // //     try {
// // // // // // // //       // 1. Crear ZIP
// // // // // // // //       setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'zipping', progress: 25 } : u));
// // // // // // // //       const zipBlob = await zipService.createZip(files);

// // // // // // // //       // 2. Encriptar
// // // // // // // //       setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'encrypting', progress: 50 } : u));
// // // // // // // //       const { encrypted, iv } = await encryptionService.encryptBlob(zipBlob);

// // // // // // // //       // 3. Subir a Supabase
// // // // // // // //       setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'uploading', progress: 75 } : u));
// // // // // // // //       const path = await supabaseService.uploadFile(encrypted, fileName);

// // // // // // // //       // 4. Guardar metadata en MongoDB
// // // // // // // //       const metadata: FileMetadata = {
// // // // // // // //         fileId: uploadId,
// // // // // // // //         originalName: fileName,
// // // // // // // //         encryptedPath: path,
// // // // // // // //         iv,
// // // // // // // //         fileCount: files.length,
// // // // // // // //         totalSize: zipBlob.size,
// // // // // // // //         uploadedAt: new Date(),
// // // // // // // //         userId
// // // // // // // //       };

// // // // // // // //       await mongoService.saveMetadata(metadata);

// // // // // // // //       setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'done', progress: 100 } : u));

// // // // // // // //       return uploadId;
// // // // // // // //     } catch (error) {
// // // // // // // //       setUploads(prev => prev.map(u => 
// // // // // // // //         u.id === uploadId ? { ...u, status: 'error', error: (error as Error).message } : u
// // // // // // // //       ));
// // // // // // // //       throw error;
// // // // // // // //     }
// // // // // // // //   };

// // // // // // // //   const clearUploads = () => setUploads([]);

// // // // // // // //   return { uploads, uploadFiles, clearUploads };
// // // // // // // // }



// // // // // // // // hooks/useEncryptZip.ts
// // // // // // // import { useState } from 'react';
// // // // // // // import { zipService } from '../services/zipService';
// // // // // // // import { encryptionService } from '../services/encryptionService';
// // // // // // // import { supabaseService } from '../services/supabaseService';
// // // // // // // import { mongoService } from '../services/mongoService';
// // // // // // // import { generateId } from '../utils/fileUtils';
// // // // // // // import type { FileItem, UploadProgress, FileMetadata } from '../types/encrypt-zip';

// // // // // // // export function useEncryptZip(userId?: string) {
// // // // // // //   const [uploads, setUploads] = useState<UploadProgress[]>([]);

// // // // // // //   const uploadFiles = async (files: FileItem[]) => {
// // // // // // //     const uploadId = generateId();
// // // // // // //     const fileName = files.length === 1 ? files[0].file.name : `archive-${Date.now()}.zip`;

// // // // // // //     const progress: UploadProgress = {
// // // // // // //       id: uploadId,
// // // // // // //       name: fileName,
// // // // // // //       status: 'idle',
// // // // // // //       progress: 0
// // // // // // //     };

// // // // // // //     setUploads(prev => [...prev, progress]);

// // // // // // //     try {
// // // // // // //       // 1. Crear ZIP
// // // // // // //       setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'zipping', progress: 25 } : u));
// // // // // // //       const zipBlob = await zipService.createZip(files);

// // // // // // //       // 2. Encriptar
// // // // // // //       setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'encrypting', progress: 50 } : u));
// // // // // // //       const { encrypted, iv } = await encryptionService.encryptBlob(zipBlob);

// // // // // // //       // 3. Subir a Supabase
// // // // // // //       setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'uploading', progress: 75 } : u));
// // // // // // //       const path = await supabaseService.uploadFile(encrypted, fileName);

// // // // // // //       // 4. Guardar metadata en MongoDB
// // // // // // //       const metadata: FileMetadata = {
// // // // // // //         fileId: uploadId,
// // // // // // //         originalName: fileName,
// // // // // // //         encryptedPath: path,
// // // // // // //         iv,
// // // // // // //         fileCount: files.length,
// // // // // // //         totalSize: zipBlob.size,
// // // // // // //         uploadedAt: new Date(),
// // // // // // //         userId
// // // // // // //       };

// // // // // // //       await mongoService.saveMetadata(metadata);

// // // // // // //       setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'done', progress: 100 } : u));

// // // // // // //       return uploadId;
// // // // // // //     } catch (error) {
// // // // // // //       setUploads(prev => prev.map(u => 
// // // // // // //         u.id === uploadId ? { ...u, status: 'error', error: (error as Error).message } : u
// // // // // // //       ));
// // // // // // //       throw error;
// // // // // // //     }
// // // // // // //   };

// // // // // // //   const clearUploads = () => setUploads([]);

// // // // // // //   return { uploads, uploadFiles, clearUploads };
// // // // // // // }



// // // // // // // hooks/useEncryptZip.ts
// // // // // // import { useState } from 'react';
// // // // // // import { zipService } from '../services/zipService';
// // // // // // import { encryptionService } from '../services/encryptionService';
// // // // // // import { supabaseService } from '../services/supabaseService';
// // // // // // import { mongoService } from '../services/mongoService';
// // // // // // import { generateId } from '../utils/fileUtils';
// // // // // // import type { FileItem, UploadProgress, FileMetadata } from '../types/encrypt-zip';

// // // // // // export function useEncryptZip(userId?: string) {
// // // // // //   const [uploads, setUploads] = useState<UploadProgress[]>([]);

// // // // // //   const uploadFiles = async (files: FileItem[]) => {
// // // // // //     const uploadId = generateId();
// // // // // //     const fileName = files.length === 1 ? files[0].file.name : `archive-${Date.now()}.zip`;

// // // // // //     const progress: UploadProgress = {
// // // // // //       id: uploadId,
// // // // // //       name: fileName,
// // // // // //       status: 'idle',
// // // // // //       progress: 0
// // // // // //     };

// // // // // //     setUploads(prev => [...prev, progress]);

// // // // // //     try {
// // // // // //       // 1. Crear ZIP
// // // // // //       setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'zipping', progress: 25 } : u));
// // // // // //       const zipBlob = await zipService.createZip(files);

// // // // // //       // 2. Encriptar
// // // // // //       setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'encrypting', progress: 50 } : u));
// // // // // //       const { encrypted, iv } = await encryptionService.encryptBlob(zipBlob);

// // // // // //       // 3. Subir a Supabase
// // // // // //       setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'uploading', progress: 75 } : u));
// // // // // //       const path = await supabaseService.uploadFile(encrypted, fileName);

// // // // // //       // 4. Guardar metadata en MongoDB
// // // // // //       const metadata: FileMetadata = {
// // // // // //         fileId: uploadId,
// // // // // //         originalName: fileName,
// // // // // //         encryptedPath: path,
// // // // // //         iv,
// // // // // //         fileCount: files.length,
// // // // // //         totalSize: zipBlob.size,
// // // // // //         uploadedAt: new Date(),
// // // // // //         userId
// // // // // //       };

// // // // // //       await mongoService.saveMetadata(metadata);

// // // // // //       setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'done', progress: 100 } : u));

// // // // // //       return uploadId;
// // // // // //     } catch (error) {
// // // // // //       setUploads(prev => prev.map(u => 
// // // // // //         u.id === uploadId ? { ...u, status: 'error', error: (error as Error).message } : u
// // // // // //       ));
// // // // // //       throw error;
// // // // // //     }
// // // // // //   };

// // // // // //   const clearUploads = () => setUploads([]);

// // // // // //   return { uploads, uploadFiles, clearUploads };
// // // // // // }



// // // // // // hooks/useEncryptZip.ts
// // // // // import { useState } from 'react';
// // // // // import { zipService } from '../services/zipService';
// // // // // import { encryptionService } from '../services/encryptionService';
// // // // // import { supabaseService } from '../services/supabaseService';
// // // // // import { generateId } from '../utils/fileUtils';
// // // // // import type { FileItem, UploadProgress, FileMetadata } from '../types/encrypt-zip';

// // // // // export function useEncryptZip(userId?: string) {
// // // // //   const [uploads, setUploads] = useState<UploadProgress[]>([]);

// // // // //   const uploadFiles = async (files: FileItem[]) => {
// // // // //     const uploadId = generateId();
// // // // //     const fileName = files.length === 1 ? files[0].file.name : `archive-${Date.now()}.zip`;

// // // // //     const progress: UploadProgress = {
// // // // //       id: uploadId,
// // // // //       name: fileName,
// // // // //       status: 'idle',
// // // // //       progress: 0
// // // // //     };

// // // // //     setUploads(prev => [...prev, progress]);

// // // // //     try {
// // // // //       // 1. Crear ZIP
// // // // //       setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'zipping', progress: 25 } : u));
// // // // //       const zipBlob = await zipService.createZip(files);

// // // // //       // 2. Encriptar
// // // // //       setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'encrypting', progress: 50 } : u));
// // // // //       const { encrypted, iv } = await encryptionService.encryptBlob(zipBlob);

// // // // //       // 3. Subir a Supabase
// // // // //       setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'uploading', progress: 75 } : u));
// // // // //       const path = await supabaseService.uploadFile(encrypted, fileName);

// // // // //       // 4. Guardar metadata en MongoDB via API
// // // // //       const metadata: FileMetadata = {
// // // // //         fileId: uploadId,
// // // // //         originalName: fileName,
// // // // //         encryptedPath: path,
// // // // //         iv,
// // // // //         fileCount: files.length,
// // // // //         totalSize: zipBlob.size,
// // // // //         uploadedAt: new Date(),
// // // // //         userId
// // // // //       };

// // // // //       const response = await fetch('/api/files', {
// // // // //         method: 'POST',
// // // // //         headers: {
// // // // //           'Content-Type': 'application/json',
// // // // //         },
// // // // //         body: JSON.stringify(metadata),
// // // // //       });

// // // // //       if (!response.ok) throw new Error('Failed to save metadata');

// // // // //       setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'done', progress: 100 } : u));

// // // // //       return uploadId;
// // // // //     } catch (error) {
// // // // //       setUploads(prev => prev.map(u => 
// // // // //         u.id === uploadId ? { ...u, status: 'error', error: (error as Error).message } : u
// // // // //       ));
// // // // //       throw error;
// // // // //     }
// // // // //   };

// // // // //   const clearUploads = () => setUploads([]);

// // // // //   return { uploads, uploadFiles, clearUploads };
// // // // // }



// // // // // hooks/useEncryptZip.ts
// // // // import { useState } from 'react';
// // // // import { zipService } from '../services/zipService';
// // // // import { encryptionService } from '../services/encryptionService';
// // // // import { supabaseService } from '../services/supabaseService';
// // // // import { generateId } from '../utils/fileUtils';
// // // // import type { FileItem, UploadProgress, FileMetadata } from '../types/encrypt-zip';

// // // // export function useEncryptZip(userId?: string) {
// // // //   const [uploads, setUploads] = useState<UploadProgress[]>([]);

// // // //   const uploadFiles = async (files: FileItem[]) => {
// // // //     const uploadId = generateId();
// // // //     const fileName = files.length === 1 ? files[0].file.name : `archive-${Date.now()}.zip`;

// // // //     const progress: UploadProgress = {
// // // //       id: uploadId,
// // // //       name: fileName,
// // // //       status: 'idle',
// // // //       progress: 0
// // // //     };

// // // //     setUploads(prev => [...prev, progress]);

// // // //     try {
// // // //       // 1. Crear ZIP
// // // //       setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'zipping', progress: 25 } : u));
// // // //       const zipBlob = await zipService.createZip(files);

// // // //       // 2. Encriptar
// // // //       setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'encrypting', progress: 50 } : u));
// // // //       const { encrypted, iv } = await encryptionService.encryptBlob(zipBlob);

// // // //       // 3. Subir a Supabase
// // // //       setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'uploading', progress: 75 } : u));
// // // //       const path = await supabaseService.uploadFile(encrypted, fileName);

// // // //       // 4. Guardar metadata en MongoDB via API
// // // //       const metadata: FileMetadata = {
// // // //         fileId: uploadId,
// // // //         originalName: fileName,
// // // //         encryptedPath: path,
// // // //         iv,
// // // //         fileCount: files.length,
// // // //         totalSize: zipBlob.size,
// // // //         uploadedAt: new Date(),
// // // //         userId
// // // //       };

// // // //       const response = await fetch('/api/files', {
// // // //         method: 'POST',
// // // //         headers: {
// // // //           'Content-Type': 'application/json',
// // // //         },
// // // //         body: JSON.stringify(metadata),
// // // //       });

// // // //       if (!response.ok) {
// // // //         const errorData = await response.json().catch(() => ({ error: 'Failed to save metadata' }));
// // // //         throw new Error(errorData.error);
// // // //       }

// // // //       setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'done', progress: 100 } : u));

// // // //       return uploadId;
// // // //     } catch (error) {
// // // //       console.error('Upload error:', error);
// // // //       setUploads(prev => prev.map(u => 
// // // //         u.id === uploadId ? { 
// // // //           ...u, 
// // // //           status: 'error', 
// // // //           error: error instanceof Error ? error.message : 'Upload failed' 
// // // //         } : u
// // // //       ));
// // // //       throw error;
// // // //     }
// // // //   };

// // // //   const clearUploads = () => setUploads([]);

// // // //   return { uploads, uploadFiles, clearUploads };
// // // // }



// // // // hooks/useEncryptZip.ts
// // // import { useState } from 'react';
// // // import { zipService } from '../services/zipService';
// // // import { encryptionService } from '../services/encryptionService';
// // // import { supabaseService } from '../services/supabaseService';
// // // import { generateId } from '../utils/fileUtils';
// // // import type { FileItem, UploadProgress, FileMetadata } from '../types/encrypt-zip';

// // // export function useEncryptZip(userId?: string) {
// // //   const [uploads, setUploads] = useState<UploadProgress[]>([]);

// // //   const uploadFiles = async (files: FileItem[]) => {
// // //     const uploadId = generateId();
// // //     const fileName = files.length === 1 ? 
// // //       `${files[0].file.name}.zip` : // Si es un solo archivo, igual lo comprimimos
// // //       `archive-${Date.now()}.zip`;

// // //     const progress: UploadProgress = {
// // //       id: uploadId,
// // //       name: fileName,
// // //       status: 'idle',
// // //       progress: 0
// // //     };

// // //     setUploads(prev => [...prev, progress]);

// // //     try {
// // //       console.log('1. Comenzando compresión de', files.length, 'archivos');
      
// // //       // 1. Crear ZIP
// // //       setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'zipping', progress: 25 } : u));
// // //       const zipBlob = await zipService.createZip(files);
// // //       console.log('2. ZIP creado, tamaño:', zipBlob.size, 'bytes');

// // //       // 2. Encriptar el ZIP
// // //       setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'encrypting', progress: 50 } : u));
// // //       const { encrypted: encryptedBlob, iv } = await encryptionService.encryptBlob(zipBlob);
// // //       console.log('3. ZIP encriptado, tamaño:', encryptedBlob.size, 'bytes');

// // //       // 3. Subir a Supabase
// // //       setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'uploading', progress: 75 } : u));
// // //       const path = await supabaseService.uploadFile(encryptedBlob, fileName);
// // //       console.log('4. Archivo subido a Supabase:', path);

// // //       // 4. Guardar metadata en MongoDB via API
// // //       const metadata: FileMetadata = {
// // //         fileId: uploadId,
// // //         originalName: fileName,
// // //         encryptedPath: path,
// // //         iv,
// // //         fileCount: files.length,
// // //         totalSize: zipBlob.size,
// // //         uploadedAt: new Date(),
// // //         userId
// // //       };

// // //       console.log('5. Guardando metadata...');
// // //       const response = await fetch('/api/files', {
// // //         method: 'POST',
// // //         headers: {
// // //           'Content-Type': 'application/json',
// // //         },
// // //         body: JSON.stringify(metadata),
// // //       });

// // //       if (!response.ok) {
// // //         const errorData = await response.json().catch(() => ({ error: 'Failed to save metadata' }));
// // //         throw new Error(errorData.error);
// // //       }

// // //       console.log('6. Upload completado');
// // //       setUploads(prev => prev.map(u => u.id === uploadId ? { ...u, status: 'done', progress: 100 } : u));

// // //       return uploadId;
// // //     } catch (error) {
// // //       console.error('Upload error:', error);
// // //       setUploads(prev => prev.map(u => 
// // //         u.id === uploadId ? { 
// // //           ...u, 
// // //           status: 'error', 
// // //           error: error instanceof Error ? error.message : 'Upload failed' 
// // //         } : u
// // //       ));
// // //       throw error;
// // //     }
// // //   };

// // //   const clearUploads = () => setUploads([]);

// // //   return { uploads, uploadFiles, clearUploads };
// // // }



// // // hooks/useEncryptZip.ts
// // import { useState } from 'react';
// // import { zipService } from '../services/zipService';
// // import { encryptionService } from '../services/encryptionService';
// // import { supabaseService } from '../services/supabaseService';
// // import { generateId } from '../utils/fileUtils';
// // import type { FileItem, UploadProgress, FileMetadata } from '../types/encrypt-zip';

// // export function useEncryptZip(userId?: string) {
// //   const [uploads, setUploads] = useState<UploadProgress[]>([]);

// //   const uploadFiles = async (files: FileItem[]) => {
// //     if (!files || files.length === 0) {
// //       throw new Error('No files selected');
// //     }

// //     const uploadId = generateId();
// //     const fileName = files.length === 1 ? 
// //       `${files[0].file.name}.zip` : 
// //       `archive-${Date.now()}.zip`;

// //     const progress: UploadProgress = {
// //       id: uploadId,
// //       name: fileName,
// //       status: 'idle',
// //       progress: 0
// //     };

// //     setUploads(prev => [...prev, progress]);

// //     try {
// //       console.log('🚀 Iniciando upload de', files.length, 'archivos');

// //       // 1. Crear ZIP
// //       setUploads(prev => prev.map(u => 
// //         u.id === uploadId ? { ...u, status: 'zipping', progress: 25 } : u
// //       ));
      
// //       console.log('📦 Creando ZIP...');
// //       const zipBlob = await zipService.createZip(files);
// //       console.log('✅ ZIP creado, tamaño:', zipBlob.size, 'bytes');

// //       // 2. Encriptar
// //       setUploads(prev => prev.map(u => 
// //         u.id === uploadId ? { ...u, status: 'encrypting', progress: 50 } : u
// //       ));
      
// //       console.log('🔐 Encriptando...');
// //       const { encrypted: encryptedBlob, iv } = await encryptionService.encryptBlob(zipBlob);
// //       console.log('✅ Archivo encriptado, tamaño:', encryptedBlob.size, 'bytes');

// //       // 3. Subir a Supabase
// //       setUploads(prev => prev.map(u => 
// //         u.id === uploadId ? { ...u, status: 'uploading', progress: 75 } : u
// //       ));
      
// //       console.log('☁️ Subiendo a Supabase...');
// //       const path = await supabaseService.uploadFile(encryptedBlob, fileName);
// //       console.log('✅ Subido a Supabase:', path);

// //       // 4. Guardar metadata
// //       const metadata: FileMetadata = {
// //         fileId: uploadId,
// //         originalName: fileName,
// //         encryptedPath: path,
// //         iv,
// //         fileCount: files.length,
// //         totalSize: zipBlob.size,
// //         uploadedAt: new Date(),
// //         userId
// //       };

// //       console.log('💾 Guardando metadata...');
// //       const response = await fetch('/api/files', {
// //         method: 'POST',
// //         headers: {
// //           'Content-Type': 'application/json',
// //         },
// //         body: JSON.stringify(metadata),
// //       });

// //       if (!response.ok) {
// //         const errorText = await response.text();
// //         throw new Error(`Failed to save metadata: ${errorText}`);
// //       }

// //       const result = await response.json();
// //       console.log('✅ Metadata guardada:', result);

// //       setUploads(prev => prev.map(u => 
// //         u.id === uploadId ? { ...u, status: 'done', progress: 100 } : u
// //       ));

// //       console.log('🎉 Upload completado exitosamente');
// //       return uploadId;

// //     } catch (error) {
// //       console.error('❌ Error en upload:', error);
// //       setUploads(prev => prev.map(u => 
// //         u.id === uploadId ? { 
// //           ...u, 
// //           status: 'error', 
// //           error: error instanceof Error ? error.message : 'Upload failed' 
// //         } : u
// //       ));
// //       throw error;
// //     }
// //   };

// //   const clearUploads = () => setUploads([]);

// //   return { uploads, uploadFiles, clearUploads };
// // }




// // hooks/useEncryptZip.ts
// import { useState } from 'react';
// import { zipService } from '../services/zipService';
// import { encryptionService } from '../services/encryptionService';
// import { supabaseService } from '../services/supabaseService';
// import { generateId, isFolder, getFolderName } from '../utils/fileUtils';
// import type { FileItem, UploadProgress, FileMetadata } from '../types/encrypt-zip';

// export function useEncryptZip(userId?: string) {
//   const [uploads, setUploads] = useState<UploadProgress[]>([]);

//   const uploadFiles = async (files: FileItem[]) => {
//     if (!files || files.length === 0) {
//       throw new Error('No files selected');
//     }

//     const uploadId = generateId();
//     const isFolderUpload = isFolder(files);
//     const folderName = getFolderName(files);
    
//     // Nombre del archivo basado en si es carpeta o archivos individuales
//     const fileName = isFolderUpload ? 
//       `${folderName}.zip` : 
//       files.length === 1 ? 
//         `${files[0].file.name}.zip` : 
//         `archive-${Date.now()}.zip`;

//     const progress: UploadProgress = {
//       id: uploadId,
//       name: fileName,
//       status: 'idle',
//       progress: 0
//     };

//     setUploads(prev => [...prev, progress]);

//     try {
//       console.log('🚀 Iniciando upload de', files.length, 'archivos');
//       if (isFolderUpload) {
//         console.log('📂 Es una carpeta:', folderName);
//       }

//       // 1. Crear ZIP (mantiene la estructura de carpetas)
//       setUploads(prev => prev.map(u => 
//         u.id === uploadId ? { ...u, status: 'zipping', progress: 25 } : u
//       ));
      
//       console.log('📦 Creando ZIP...');
//       const zipBlob = await zipService.createZip(files);
//       console.log('✅ ZIP creado, tamaño:', zipBlob.size, 'bytes');
//       console.log('📁 Estructura preservada para', files.length, 'archivos');

//       // 2. Encriptar
//       setUploads(prev => prev.map(u => 
//         u.id === uploadId ? { ...u, status: 'encrypting', progress: 50 } : u
//       ));
      
//       console.log('🔐 Encriptando...');
//       const { encrypted: encryptedBlob, iv } = await encryptionService.encryptBlob(zipBlob);
//       console.log('✅ Archivo encriptado, tamaño:', encryptedBlob.size, 'bytes');

//       // 3. Subir a Supabase
//       setUploads(prev => prev.map(u => 
//         u.id === uploadId ? { ...u, status: 'uploading', progress: 75 } : u
//       ));
      
//       console.log('☁️ Subiendo a Supabase...');
//       const path = await supabaseService.uploadFile(encryptedBlob, fileName);
//       console.log('✅ Subido a Supabase:', path);

//       // 4. Guardar metadata
//       const metadata: FileMetadata = {
//         fileId: uploadId,
//         originalName: fileName,
//         encryptedPath: path,
//         iv,
//         fileCount: files.length,
//         totalSize: zipBlob.size,
//         uploadedAt: new Date(),
//         userId,
//         isFolder: isFolderUpload,
//         folderName: isFolderUpload ? folderName : undefined
//       };

//       console.log('💾 Guardando metadata...');
//       const response = await fetch('/api/files', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(metadata),
//       });

//       if (!response.ok) {
//         const errorText = await response.text();
//         throw new Error(`Failed to save metadata: ${errorText}`);
//       }

//       const result = await response.json();
//       console.log('✅ Metadata guardada:', result);

//       setUploads(prev => prev.map(u => 
//         u.id === uploadId ? { ...u, status: 'done', progress: 100 } : u
//       ));

//       console.log('🎉 Upload completado exitosamente');
//       return uploadId;

//     } catch (error) {
//       console.error('❌ Error en upload:', error);
//       setUploads(prev => prev.map(u => 
//         u.id === uploadId ? { 
//           ...u, 
//           status: 'error', 
//           error: error instanceof Error ? error.message : 'Upload failed' 
//         } : u
//       ));
//       throw error;
//     }
//   };

//   const clearUploads = () => setUploads([]);

//   return { uploads, uploadFiles, clearUploads };
// }




// hooks/useEncryptZip.ts
import { useState } from 'react';
import { zipService } from '../services/zipService';
import { encryptionService } from '../services/encryptionService';
import { supabaseService } from '../services/supabaseService';
import { generateId, isFolder, getFolderName, formatBytes } from '../utils/fileUtils';
import type { FileItem, UploadProgress, FileMetadata } from '../types/encrypt-zip';

export function useEncryptZip(userId?: string) {
  const [uploads, setUploads] = useState<UploadProgress[]>([]);

  const uploadFiles = async (files: FileItem[]) => {
    if (!files || files.length === 0) {
      throw new Error('No files selected');
    }

    const uploadId = generateId();
    const isFolderUpload = isFolder(files);
    const folderName = getFolderName(files);
    
    // Nombre del archivo basado en si es carpeta o archivos individuales
    const fileName = isFolderUpload ? 
      `${folderName}.zip` : 
      files.length === 1 ? 
        `${files[0].file.name}.zip` : 
        `archive-${Date.now()}.zip`;

    const progress: UploadProgress = {
      id: uploadId,
      name: fileName,
      status: 'idle',
      progress: 0
    };

    setUploads(prev => [...prev, progress]);

    try {
      console.log('🚀 Iniciando upload de', files.length, 'archivos');
      if (isFolderUpload) {
        console.log('📂 Es una carpeta:', folderName);
        console.log('📁 Estructura de archivos:');
        files.forEach((file, index) => {
          console.log(`   ${index + 1}. ${file.relativePath} (${formatBytes(file.file.size)})`);
        });
      } else {
        files.forEach((file, index) => {
          console.log(`   ${index + 1}. ${file.relativePath} (${formatBytes(file.file.size)})`);
        });
      }

      // 1. Crear ZIP (mantiene la estructura de carpetas)
      setUploads(prev => prev.map(u => 
        u.id === uploadId ? { ...u, status: 'zipping', progress: 25 } : u
      ));
      
      console.log('📦 Creando ZIP...');
      const zipBlob = await zipService.createZip(files);
      console.log('✅ ZIP creado, tamaño:', zipBlob.size, 'bytes');
      
      // Verificar contenido del ZIP si es una carpeta
      if (isFolderUpload) {
        try {
          const zipContents = await zipService.listZipContents(zipBlob);
          console.log('📂 Contenido del ZIP:', zipContents.length, 'archivos');
          zipContents.forEach((file, index) => {
            console.log(`   ${index + 1}. ${file}`);
          });
        } catch (error) {
          console.warn('⚠️ No se pudo verificar el contenido del ZIP:', error);
        }
      }

      // 2. Encriptar
      setUploads(prev => prev.map(u => 
        u.id === uploadId ? { ...u, status: 'encrypting', progress: 50 } : u
      ));
      
      console.log('🔐 Encriptando...');
      const { encrypted: encryptedBlob, iv } = await encryptionService.encryptBlob(zipBlob);
      console.log('✅ Archivo encriptado, tamaño:', encryptedBlob.size, 'bytes');

      // 3. Subir a Supabase
      setUploads(prev => prev.map(u => 
        u.id === uploadId ? { ...u, status: 'uploading', progress: 75 } : u
      ));
      
      console.log('☁️ Subiendo a Supabase...');
      const path = await supabaseService.uploadFile(encryptedBlob, fileName);
      console.log('✅ Subido a Supabase:', path);

      // 4. Guardar metadata
      const metadata: FileMetadata = {
        fileId: uploadId,
        originalName: fileName,
        encryptedPath: path,
        iv,
        fileCount: files.length,
        totalSize: zipBlob.size,
        uploadedAt: new Date(),
        userId,
        isFolder: isFolderUpload,
        folderName: isFolderUpload ? folderName : undefined
      };

      console.log('💾 Guardando metadata...');
      const response = await fetch('/api/files', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(metadata),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to save metadata: ${errorText}`);
      }

      const result = await response.json();
      console.log('✅ Metadata guardada:', result);

      setUploads(prev => prev.map(u => 
        u.id === uploadId ? { ...u, status: 'done', progress: 100 } : u
      ));

      console.log('🎉 Upload completado exitosamente');
      return uploadId;

    } catch (error) {
      console.error('❌ Error en upload:', error);
      setUploads(prev => prev.map(u => 
        u.id === uploadId ? { 
          ...u, 
          status: 'error', 
          error: error instanceof Error ? error.message : 'Upload failed' 
        } : u
      ));
      throw error;
    }
  };

  const clearUploads = () => setUploads([]);

  return { uploads, uploadFiles, clearUploads };
}