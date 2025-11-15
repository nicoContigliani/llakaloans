// app/api/files/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { mongoService } from '@/encrypt-zip-module/services/mongoService';
import { FileFilter, PaginationOptions } from '@/encrypt-zip-module/types/encrypt-zip';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    // Parámetros de paginación
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    
    // Construir filtros
    const filter: FileFilter = {
      search: searchParams.get('search') || undefined,
      fileType: (searchParams.get('fileType') as 'all' | 'folders' | 'files') || 'all',
      sortBy: (searchParams.get('sortBy') as 'name' | 'size' | 'date' | 'fileCount') || 'date',
      sortOrder: (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc'
    };
    
    // Filtro por rango de fecha
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    if (startDate && endDate) {
      filter.dateRange = {
        start: new Date(startDate),
        end: new Date(endDate)
      };
    }
    
    // Filtro por tamaño
    const minSize = searchParams.get('minSize');
    const maxSize = searchParams.get('maxSize');
    if (minSize) filter.minSize = parseInt(minSize);
    if (maxSize) filter.maxSize = parseInt(maxSize);
    
    const pagination: PaginationOptions = {
      page: Math.max(1, page),
      limit: Math.min(Math.max(1, limit), 100) // Límite máximo de 100
    };
    
    const result = await mongoService.listMetadata(userId || undefined, filter, pagination);
    
    return NextResponse.json({
      ...result,
      filters: filter
    });
  } catch (error) {
    console.error('Error fetching files:', error);
    return NextResponse.json({ error: 'Failed to fetch files' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const fileId = await mongoService.saveMetadata(body);
    return NextResponse.json({ fileId });
  } catch (error) {
    console.error('Error saving file:', error);
    return NextResponse.json({ error: 'Failed to save file' }, { status: 500 });
  }
}