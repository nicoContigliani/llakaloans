// types/encrypt-zip.ts
export interface FileItem {
  id: string;
  file: File;
  relativePath: string;
}

export interface UploadProgress {
  id: string;
  name: string;
  status: 'idle' | 'zipping' | 'encrypting' | 'uploading' | 'done' | 'error';
  progress: number;
  error?: string;
}

export interface DownloadProgress {
  id: string;
  name: string;
  status: 'idle' | 'downloading' | 'decrypting' | 'extracting' | 'done' | 'error';
  progress: number;
  error?: string;
}

export interface FileMetadata {
  _id?: string;
  fileId: string;
  originalName: string;
  encryptedPath: string;
  iv: string;
  fileCount: number;
  totalSize: number;
  uploadedAt: Date;
  userId?: string;
  isFolder?: boolean;
  folderName?: string;
}

export interface EncryptedData {
  encrypted: string;
  iv: string;
}

// Tipos para filtros y paginación
export interface FileFilter {
  search?: string;
  fileType?: 'all' | 'folders' | 'files';
  dateRange?: {
    start: Date;
    end: Date;
  };
  minSize?: number;
  maxSize?: number;
  sortBy?: 'name' | 'size' | 'date' | 'fileCount';
  sortOrder?: 'asc' | 'desc';
}

export interface PaginationOptions {
  page: number;
  limit: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export interface FilesResponse extends PaginatedResponse<FileMetadata> {
  filters: FileFilter;
}