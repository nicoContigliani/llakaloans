export interface PDFData {
  [key: string]: any;
}

export interface PDFTemplateConfig {
  template?: 'invoice' | 'receipt' | 'report' | 'custom';
  styles?: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    fontSize?: number;
  };
  metadata?: {
    title?: string;
    author?: string;
    subject?: string;
  };
}

export interface PDFGenerationRequest {
  data: PDFData;
  config?: PDFTemplateConfig;
  options?: {
    format?: 'A4' | 'A3' | 'LETTER';
    orientation?: 'portrait' | 'landscape';
  };
}

export interface PDFGenerationResult {
  success: boolean;
  pdfBuffer?: Buffer;
  error?: string;
  metadata?: {
    generationTime: number;
    fileSize: number;
  };
}

export interface EmailConfig {
  to: string | string[];
  subject: string;
  body: string;
  cc?: string | string[];
  bcc?: string | string[];
}