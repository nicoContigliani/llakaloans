// // // services/zipService.ts
// // import { BlobWriter, ZipWriter, BlobReader, ZipReader } from '@zip.js/zip.js';
// // import type { FileItem } from '../types/encrypt-zip';

// // export class ZipService {
// //   async createZip(files: FileItem[]): Promise<Blob> {
// //     const zipWriter = new ZipWriter(new BlobWriter('application/zip'));

// //     for (const item of files) {
// //       const reader = new BlobReader(item.file);
// //       await zipWriter.add(item.relativePath, reader);
// //     }

// //     const blob = await zipWriter.close();
// //     return blob;
// //   }

// //   async extractZip(zipBlob: Blob): Promise<File[]> {
// //     const reader = new ZipReader(new BlobReader(zipBlob));
// //     const entries = await reader.getEntries();
// //     const files: File[] = [];

// //     for (const entry of entries) {
// //       if (!entry.directory && entry.getData) {
// //         const blob = await entry.getData(new BlobWriter());
// //         const file = new File([blob], entry.filename, { type: blob.type });
// //         files.push(file);
// //       }
// //     }

// //     await reader.close();
// //     return files;
// //   }
// // }

// // export const zipService = new ZipService();

// // services/zipService.ts
// import { BlobWriter, ZipWriter, BlobReader, ZipReader } from '@zip.js/zip.js';
// import type { FileItem } from '../types/encrypt-zip';

// export class ZipService {
//   async createZip(files: FileItem[]): Promise<Blob> {
//     console.log('Creando ZIP con', files.length, 'archivos');
    
//     const zipWriter = new ZipWriter(new BlobWriter('application/zip'));

//     for (const item of files) {
//       console.log('Añadiendo archivo al ZIP:', item.relativePath);
//       const reader = new BlobReader(item.file);
//       await zipWriter.add(item.relativePath, reader);
//     }

//     const blob = await zipWriter.close();
//     console.log('ZIP creado exitosamente, tamaño:', blob.size, 'bytes');
//     return blob;
//   }

//   async extractZip(zipBlob: Blob): Promise<File[]> {
//     console.log('Extrayendo ZIP, tamaño:', zipBlob.size, 'bytes');
    
//     const reader = new ZipReader(new BlobReader(zipBlob));
//     const entries = await reader.getEntries();
//     const files: File[] = [];

//     console.log('Encontradas', entries.length, 'entradas en el ZIP');

//     for (const entry of entries) {
//       if (!entry.directory && entry.getData) {
//         console.log('Extrayendo:', entry.filename);
//         const blob = await entry.getData(new BlobWriter());
//         const file = new File([blob], entry.filename, { 
//           type: blob.type || 'application/octet-stream' 
//         });
//         files.push(file);
//       }
//     }

//     await reader.close();
//     console.log('Extraídos', files.length, 'archivos');
//     return files;
//   }
// }

// export const zipService = new ZipService();




// services/zipService.ts
import { BlobWriter, ZipWriter, BlobReader, ZipReader } from '@zip.js/zip.js';
import type { FileItem } from '../types/encrypt-zip';

export class ZipService {
  async createZip(files: FileItem[]): Promise<Blob> {
    console.log('📦 Creando ZIP con', files.length, 'archivos');
    
    const zipWriter = new ZipWriter(new BlobWriter('application/zip'));

    for (const item of files) {
      console.log('📁 Añadiendo archivo al ZIP:', item.relativePath);
      try {
        const reader = new BlobReader(item.file);
        await zipWriter.add(item.relativePath, reader);
      } catch (error) {
        console.error('❌ Error añadiendo archivo al ZIP:', item.relativePath, error);
        throw new Error(`Failed to add file ${item.relativePath} to ZIP`);
      }
    }

    const blob = await zipWriter.close();
    console.log('✅ ZIP creado exitosamente, tamaño:', blob.size, 'bytes');
    return blob;
  }

  async extractZip(zipBlob: Blob): Promise<File[]> {
    console.log('📤 Extrayendo ZIP, tamaño:', zipBlob.size, 'bytes');
    
    const reader = new ZipReader(new BlobReader(zipBlob));
    const entries = await reader.getEntries();
    const files: File[] = [];

    console.log('📂 Encontradas', entries.length, 'entradas en el ZIP');

    for (const entry of entries) {
      if (!entry.directory && entry.getData) {
        console.log('📄 Extrayendo:', entry.filename);
        try {
          const blob = await entry.getData(new BlobWriter());
          const file = new File([blob], entry.filename, { 
            type: blob.type || 'application/octet-stream',
            lastModified: Date.now()
          });
          files.push(file);
          console.log('✅ Extraído:', entry.filename, 'tamaño:', blob.size, 'bytes');
        } catch (error) {
          console.error('❌ Error extrayendo archivo:', entry.filename, error);
          throw new Error(`Failed to extract file ${entry.filename} from ZIP`);
        }
      } else if (entry.directory) {
        console.log('📁 Directorio encontrado:', entry.filename);
      }
    }

    await reader.close();
    console.log('🎉 Extracción completada:', files.length, 'archivos extraídos');
    return files;
  }

  // Método adicional para verificar el contenido del ZIP
  async listZipContents(zipBlob: Blob): Promise<string[]> {
    const reader = new ZipReader(new BlobReader(zipBlob));
    const entries = await reader.getEntries();
    const fileNames = entries.filter(entry => !entry.directory).map(entry => entry.filename);
    await reader.close();
    return fileNames;
  }
}

export const zipService = new ZipService();