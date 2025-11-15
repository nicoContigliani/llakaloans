// utils/fileUtils.ts
import type { FileItem } from '../types/encrypt-zip';

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export async function getFilesFromInput(input: HTMLInputElement): Promise<FileItem[]> {
  const files: FileItem[] = [];
  
  if (!input.files) return files;

  for (let i = 0; i < input.files.length; i++) {
    const file = input.files[i];
    const relativePath = file.webkitRelativePath || file.name;
    
    files.push({
      id: generateId(),
      file,
      relativePath
    });
  }

  return files;
}

export async function getFilesFromDrop(items: DataTransferItemList): Promise<FileItem[]> {
  const files: FileItem[] = [];

  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    if (item.kind === 'file') {
      const entry = item.webkitGetAsEntry();
      if (entry) {
        await traverseEntry(entry, '', files);
      }
    }
  }

  return files;
}

async function traverseEntry(entry: any, path: string, files: FileItem[]): Promise<void> {
  if (entry.isFile) {
    const file = await new Promise<File>((resolve) => entry.file(resolve));
    files.push({
      id: generateId(),
      file,
      relativePath: path + entry.name
    });
  } else if (entry.isDirectory) {
    const reader = entry.createReader();
    const entries = await new Promise<any[]>((resolve) => reader.readEntries(resolve));
    
    for (const childEntry of entries) {
      await traverseEntry(childEntry, path + entry.name + '/', files);
    }
  }
}

export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

// Nueva función para determinar si es carpeta
export function isFolder(files: FileItem[]): boolean {
  if (files.length === 0) return false;
  
  // Si hay múltiples archivos con la misma ruta base, es una carpeta
  const basePaths = files.map(f => f.relativePath.split('/')[0]);
  const uniqueBasePaths = [...new Set(basePaths)];
  
  return uniqueBasePaths.length === 1 && files.length > 1;
}

// Obtener nombre de carpeta
export function getFolderName(files: FileItem[]): string {
  if (files.length === 0) return '';
  
  if (isFolder(files)) {
    return files[0].relativePath.split('/')[0];
  }
  
  // Si es un solo archivo, usar el nombre del archivo
  return files[0].file.name;
}