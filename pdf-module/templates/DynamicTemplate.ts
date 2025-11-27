import { PDFData, PDFTemplateConfig } from '../types/dynamic';

export class DynamicTemplate {
  static async generatePDF(data: PDFData, config?: PDFTemplateConfig): Promise<Buffer> {
    const { PDFDocument, rgb, StandardFonts } = await import('pdf-lib');
    
    const pdfDoc = await PDFDocument.create();
    let page = pdfDoc.addPage([595.28, 841.89]); // A4
    const { width, height } = page.getSize();
    
    const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    
    const styles = {
      primaryColor: config?.styles?.primaryColor || '#2563eb',
      secondaryColor: config?.styles?.secondaryColor || '#64748b',
      fontFamily: config?.styles?.fontFamily || 'Helvetica',
      fontSize: config?.styles?.fontSize || 10,
    };

    // Convertir color hex a RGB
    const hexToRgb = (hex: string) => {
      const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
      return result ? {
        r: parseInt(result[1], 16) / 255,
        g: parseInt(result[2], 16) / 255,
        b: parseInt(result[3], 16) / 255,
      } : { r: 0.2, g: 0.2, b: 0.6 };
    };

    const primaryRgb = hexToRgb(styles.primaryColor);
    const secondaryRgb = hexToRgb(styles.secondaryColor);

    let yPosition = 50;
    const lineHeight = 20;
    const margin = 50;

    // Helper para dibujar texto
    const drawText = (text: string, x: number, y: number, options: any = {}) => {
      page.drawText(text, {
        x,
        y: height - y,
        size: options.size || styles.fontSize,
        color: options.color || rgb(0, 0, 0),
        font: options.bold ? boldFont : font,
        maxWidth: width - (2 * margin),
      });
    };

    // Título del documento
    if (config?.metadata?.title) {
      drawText(config.metadata.title, margin, yPosition, {
        size: 18,
        bold: true,
        color: rgb(primaryRgb.r, primaryRgb.g, primaryRgb.b),
      });
      yPosition += 40;
    }

    // Generar contenido dinámico basado en los datos
    const generateContent = (obj: any, depth: number = 0) => {
      for (const [key, value] of Object.entries(obj)) {
        if (value === null || value === undefined) continue;

        const indent = depth * 20;
        const xPosition = margin + indent;

        if (typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
          // Encabezado de sección
          if (yPosition > height - 100) {
            // Nueva página si nos quedamos sin espacio
            const newPage = pdfDoc.addPage([595.28, 841.89]);
            page = newPage;
            yPosition = 50;
          }

          drawText(this.formatKey(key), xPosition, yPosition, {
            size: styles.fontSize + 2,
            bold: true,
            color: rgb(primaryRgb.r, primaryRgb.g, primaryRgb.b),
          });
          yPosition += lineHeight;
          
          generateContent(value, depth + 1);
        } else {
          // Item regular
          const displayValue = this.formatValue(value);
          const label = this.formatKey(key);
          
          drawText(`${label}:`, xPosition, yPosition, { bold: true });
          
          const textWidth = font.widthOfTextAtSize(`${label}: `, styles.fontSize);
          drawText(displayValue, xPosition + textWidth + 5, yPosition);
          
          yPosition += lineHeight;

          if (yPosition > height - 50) {
            // Nueva página si nos quedamos sin espacio
            const newPage = pdfDoc.addPage([595.28, 841.89]);
            page = newPage;
            yPosition = 50;
          }
        }
      }
    };

    generateContent(data);

    // Pie de página
    const footerText = `Generado el ${new Date().toLocaleDateString()}`;
    drawText(footerText, margin, height - 30, {
      size: 8,
      color: rgb(secondaryRgb.r, secondaryRgb.g, secondaryRgb.b),
    });

    const pdfBytes = await pdfDoc.save();
    return Buffer.from(pdfBytes);
  }

  private static formatKey(key: string): string {
    return key
      .replace(/([A-Z])/g, ' $1')
      .replace(/^./, str => str.toUpperCase())
      .replace(/_/g, ' ');
  }

  private static formatValue(value: any): string {
    if (value instanceof Date) {
      return value.toLocaleDateString();
    }
    if (typeof value === 'number') {
      // Intentar detectar si es moneda
      if (value.toFixed(2) === value.toString()) {
        return new Intl.NumberFormat('en-US', {
          style: 'currency',
          currency: 'USD'
        }).format(value);
      }
      return value.toString();
    }
    if (Array.isArray(value)) {
      return value.join(', ');
    }
    return String(value);
  }
}