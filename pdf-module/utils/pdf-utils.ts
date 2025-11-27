export class PDFUtils {
  static generateFilename(type: string, identifier: string, timestamp: Date = new Date()): string {
    const dateStr = timestamp.toISOString().split('T')[0];
    return `${type}_${identifier}_${dateStr}.pdf`;
  }

  static validatePDFBuffer(buffer: Buffer): boolean {
    // Verificar que es un PDF válido (primeros bytes)
    const header = buffer.slice(0, 4).toString();
    return header === '%PDF';
  }

  static getFileSize(buffer: Buffer): string {
    const bytes = buffer.length;
    if (bytes < 1024) return bytes + ' bytes';
    else if (bytes < 1048576) return (bytes / 1024).toFixed(2) + ' KB';
    else return (bytes / 1048576).toFixed(2) + ' MB';
  }
}