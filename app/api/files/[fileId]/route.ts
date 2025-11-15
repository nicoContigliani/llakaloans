// app/api/files/[fileId]/route.ts
import { mongoService } from '@/encrypt-zip-module/services/mongoService';
import { supabaseService } from '@/encrypt-zip-module/services/supabaseService';
import { NextRequest, NextResponse } from 'next/server';


export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await params;
    const metadata = await mongoService.getMetadata(fileId);

    if (!metadata) {
      return NextResponse.json({ error: 'File not found' }, { status: 404 });
    }

    return NextResponse.json(metadata);
  } catch (error) {
    console.error('Error fetching file:', error);
    return NextResponse.json({ error: 'Failed to fetch file' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ fileId: string }> }
) {
  try {
    const { fileId } = await params;
    const body = await request.json().catch(() => ({}));
    const { encryptedPath } = body;

    console.log('🗑️ API: Eliminando archivo:', fileId);
    console.log('📁 Ruta en Supabase:', encryptedPath);

    // 1. Obtener metadata para verificar que existe
    const metadata = await mongoService.getMetadata(fileId);
    if (!metadata) {
      return NextResponse.json({ error: 'File not found in database' }, { status: 404 });
    }

    // 2. Eliminar de Supabase usando la ruta de la metadata o la proporcionada
    const pathToDelete = encryptedPath || metadata.encryptedPath;

    if (pathToDelete) {
      console.log('☁️ Eliminando de Supabase:', pathToDelete);
      await supabaseService.deleteFile(pathToDelete);
      console.log('✅ Eliminado de Supabase');
    } else {
      console.warn('⚠️ No hay ruta de Supabase para eliminar');
    }

    // 3. Eliminar de MongoDB
    console.log('🗄️ Eliminando de MongoDB:', fileId);
    await mongoService.deleteMetadata(fileId);
    console.log('✅ Eliminado de MongoDB');

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully from both storage and database'
    });

  } catch (error) {
    console.error('❌ Error deleting file:', error);
    return NextResponse.json({
      error: error instanceof Error ? error.message : 'Failed to delete file'
    }, { status: 500 });
  }
}