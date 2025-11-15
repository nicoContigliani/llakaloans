// services/mongoService.ts
import clientPromise from '@/lib/mongodb';
import type { FileMetadata, FileFilter, PaginationOptions, PaginatedResponse } from '../types/encrypt-zip';
import { ObjectId } from 'mongodb';

class MongoService {
  private dbName = 'encryptedFiles';
  private collectionName = 'metadata';

  async saveMetadata(metadata: Omit<FileMetadata, '_id'>): Promise<string> {
    const client = await clientPromise;
    const db = client.db(this.dbName);
    const result = await db.collection(this.collectionName).insertOne({
      ...metadata,
      uploadedAt: new Date()
    });
    
    return metadata.fileId;
  }

  async getMetadata(fileId: string): Promise<FileMetadata | null> {
    const client = await clientPromise;
    const db = client.db(this.dbName);
    const result = await db.collection(this.collectionName).findOne({ fileId });
    
    if (!result) return null;
    
    return {
      _id: result._id.toString(),
      fileId: result.fileId,
      originalName: result.originalName,
      encryptedPath: result.encryptedPath,
      iv: result.iv,
      fileCount: result.fileCount,
      totalSize: result.totalSize,
      uploadedAt: result.uploadedAt,
      userId: result.userId,
      isFolder: result.isFolder,
      folderName: result.folderName
    } as FileMetadata;
  }

  async listMetadata(
    userId?: string, 
    filter: FileFilter = {}, 
    pagination: PaginationOptions = { page: 1, limit: 10 }
  ): Promise<PaginatedResponse<FileMetadata>> {
    const client = await clientPromise;
    const db = client.db(this.dbName);
    
    // Construir filtro base
    const baseFilter = userId ? { userId } : {};
    
    // Construir filtros adicionales
    const queryFilter: any = { ...baseFilter };
    
    // Filtro de búsqueda por nombre
    if (filter.search) {
      queryFilter.originalName = { 
        $regex: filter.search, 
        $options: 'i' 
      };
    }
    
    // Filtro por tipo (carpetas vs archivos)
    if (filter.fileType === 'folders') {
      queryFilter.isFolder = true;
    } else if (filter.fileType === 'files') {
      queryFilter.isFolder = { $ne: true };
    }
    
    // Filtro por rango de fecha
    if (filter.dateRange) {
      queryFilter.uploadedAt = {
        $gte: filter.dateRange.start,
        $lte: filter.dateRange.end
      };
    }
    
    // Filtro por tamaño
    if (filter.minSize !== undefined || filter.maxSize !== undefined) {
      queryFilter.totalSize = {};
      if (filter.minSize !== undefined) {
        queryFilter.totalSize.$gte = filter.minSize;
      }
      if (filter.maxSize !== undefined) {
        queryFilter.totalSize.$lte = filter.maxSize;
      }
    }
    
    // Configurar ordenamiento
    const sortOptions: any = {};
    switch (filter.sortBy) {
      case 'name':
        sortOptions.originalName = filter.sortOrder === 'desc' ? -1 : 1;
        break;
      case 'size':
        sortOptions.totalSize = filter.sortOrder === 'desc' ? -1 : 1;
        break;
      case 'fileCount':
        sortOptions.fileCount = filter.sortOrder === 'desc' ? -1 : 1;
        break;
      case 'date':
      default:
        sortOptions.uploadedAt = filter.sortOrder === 'desc' ? -1 : 1;
        break;
    }
    
    // Calcular paginación
    const skip = (pagination.page - 1) * pagination.limit;
    
    // Obtener total de documentos
    const total = await db.collection(this.collectionName).countDocuments(queryFilter);
    
    // Obtener datos paginados
    const results = await db.collection(this.collectionName)
      .find(queryFilter)
      .sort(sortOptions)
      .skip(skip)
      .limit(pagination.limit)
      .toArray();
    
    // Calcular información de paginación
    const totalPages = Math.ceil(total / pagination.limit);
    const hasNext = pagination.page < totalPages;
    const hasPrev = pagination.page > 1;
    
    // Mapear resultados
    const data = results.map(result => ({
      _id: result._id.toString(),
      fileId: result.fileId,
      originalName: result.originalName,
      encryptedPath: result.encryptedPath,
      iv: result.iv,
      fileCount: result.fileCount,
      totalSize: result.totalSize,
      uploadedAt: result.uploadedAt,
      userId: result.userId,
      isFolder: result.isFolder,
      folderName: result.folderName
    } as FileMetadata));
    
    return {
      data,
      pagination: {
        page: pagination.page,
        limit: pagination.limit,
        total,
        totalPages,
        hasNext,
        hasPrev
      }
    };
  }

  async deleteMetadata(fileId: string): Promise<void> {
    const client = await clientPromise;
    const db = client.db(this.dbName);
    await db.collection(this.collectionName).deleteOne({ fileId });
  }

  async getMetadataById(id: string): Promise<FileMetadata | null> {
    const client = await clientPromise;
    const db = client.db(this.dbName);
    const result = await db.collection(this.collectionName).findOne({ _id: new ObjectId(id) });
    
    if (!result) return null;
    
    return {
      _id: result._id.toString(),
      fileId: result.fileId,
      originalName: result.originalName,
      encryptedPath: result.encryptedPath,
      iv: result.iv,
      fileCount: result.fileCount,
      totalSize: result.totalSize,
      uploadedAt: result.uploadedAt,
      userId: result.userId,
      isFolder: result.isFolder,
      folderName: result.folderName
    } as FileMetadata;
  }

  // Métodos para estadísticas
  async getFileStats(userId?: string) {
    const client = await clientPromise;
    const db = client.db(this.dbName);
    
    const baseFilter = userId ? { userId } : {};
    
    const stats = await db.collection(this.collectionName).aggregate([
      { $match: baseFilter },
      {
        $group: {
          _id: null,
          totalFiles: { $sum: 1 },
          totalSize: { $sum: '$totalSize' },
          totalFolders: {
            $sum: { $cond: [{ $eq: ['$isFolder', true] }, 1, 0] }
          },
          totalIndividualFiles: {
            $sum: { $cond: [{ $ne: ['$isFolder', true] }, 1, 0] }
          }
        }
      }
    ]).toArray();
    
    return stats[0] || {
      totalFiles: 0,
      totalSize: 0,
      totalFolders: 0,
      totalIndividualFiles: 0
    };
  }
}

export const mongoService = new MongoService();