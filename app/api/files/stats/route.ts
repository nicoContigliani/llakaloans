// app/api/files/stats/route.ts
import { mongoService } from '@/encrypt-zip-module/services/mongoService';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    const stats = await mongoService.getFileStats(userId || undefined);
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching file stats:', error);
    return NextResponse.json({ error: 'Failed to fetch file stats' }, { status: 500 });
  }
}