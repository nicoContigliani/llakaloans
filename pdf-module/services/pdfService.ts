import { PDFGenerationRequest, PDFGenerationResult, PDFData } from '../types/dynamic';
import { DynamicTemplate } from '../templates/DynamicTemplate';

export class PDFService {
  async generatePDF(request: PDFGenerationRequest): Promise<PDFGenerationResult> {
    const startTime = Date.now();
    
    try {
      if (!request.data || Object.keys(request.data).length === 0) {
        return {
          success: false,
          error: 'No data provided for PDF generation',
        };
      }

      const pdfBuffer = await DynamicTemplate.generatePDF(request.data, request.config);
      const generationTime = Date.now() - startTime;

      return {
        success: true,
        pdfBuffer,
        metadata: {
          generationTime,
          fileSize: pdfBuffer.length,
        },
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        metadata: {
          generationTime: Date.now() - startTime,
          fileSize: 0
        },
      };
    }
  }

  async generateMultiple(requests: PDFGenerationRequest[]): Promise<PDFGenerationResult[]> {
    return Promise.all(requests.map(request => this.generatePDF(request)));
  }
}

export const pdfService = new PDFService();