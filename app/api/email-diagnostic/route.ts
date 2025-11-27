// app/api/email-diagnostic/route.ts
import { NextRequest, NextResponse } from 'next/server';
import nodemailer from 'nodemailer';

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 Iniciando diagnóstico completo de email...');
    
    const diagnostic = {
      environment: process.env.NODE_ENV,
      smtpConfig: {
        SMTP_HOST: process.env.SMTP_HOST || 'No configurado',
        SMTP_PORT: process.env.SMTP_PORT || 'No configurado',
        SMTP_USER: process.env.SMTP_USER ? '✅ Configurado' : '❌ No configurado',
        SMTP_PASS: process.env.SMTP_PASS ? '✅ Configurado' : '❌ No configurado',
        SMTP_FROM_EMAIL: process.env.SMTP_FROM_EMAIL || 'No configurado',
        SMTP_FROM_NAME: process.env.SMTP_FROM_NAME || 'No configurado',
        NEXTAUTH_URL: process.env.NEXTAUTH_URL || 'No configurado'
      },
      tests: [] as any[]
    };

    // Test 1: Configuración básica
    console.log('🧪 Test 1: Verificando configuración básica...');
    diagnostic.tests.push({
      name: 'Configuración básica',
      status: process.env.SMTP_USER && process.env.SMTP_PASS ? '✅' : '❌',
      details: 'Variables SMTP_USER y SMTP_PASS presentes'
    });

    // Test 2: Crear transporter
    console.log('🧪 Test 2: Creando transporter...');
    let transporter;
    let testAccount;
    
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        // Usar configuración real
        transporter = nodemailer.createTransport({
          host: process.env.SMTP_HOST || 'smtp.gmail.com',
          port: parseInt(process.env.SMTP_PORT || '587'),
          secure: false,
          auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
          },
          tls: {
            rejectUnauthorized: false
          }
        });
        diagnostic.tests.push({
          name: 'Transporter real',
          status: '✅',
          details: 'Transporter creado con configuración SMTP'
        });
      } catch (error: any) {
        diagnostic.tests.push({
          name: 'Transporter real',
          status: '❌',
          details: `Error: ${error.message}`
        });
      }
    } else {
      // Usar Ethereal
      try {
        testAccount = await nodemailer.createTestAccount();
        transporter = nodemailer.createTransport({
          host: 'smtp.ethereal.email',
          port: 587,
          secure: false,
          auth: {
            user: testAccount.user,
            pass: testAccount.pass,
          },
        });
        diagnostic.tests.push({
          name: 'Transporter Ethereal',
          status: '✅',
          details: `Cuenta: ${testAccount.user}`
        });
      } catch (error: any) {
        diagnostic.tests.push({
          name: 'Transporter Ethereal',
          status: '❌',
          details: `Error: ${error.message}`
        });
      }
    }

    // Test 3: Verificar conexión
    console.log('🧪 Test 3: Verificando conexión SMTP...');
    if (transporter) {
      try {
        await transporter.verify();
        diagnostic.tests.push({
          name: 'Conexión SMTP',
          status: '✅',
          details: 'Conexión verificada correctamente'
        });
      } catch (error: any) {
        diagnostic.tests.push({
          name: 'Conexión SMTP',
          status: '❌',
          details: `Error: ${error.message}`
        });
      }
    }

    // Test 4: Envío de prueba
    console.log('🧪 Test 4: Enviando email de prueba...');
    if (transporter) {
      try {
        const testEmail = {
          from: {
            name: 'Diagnóstico Sistema',
            address: process.env.SMTP_FROM_EMAIL || testAccount?.user || 'test@diagnostico.com'
          },
          to: 'test@example.com', // No importa, es solo prueba
          subject: '📧 Diagnóstico - Sistema de Organización',
          text: `Este es un email de diagnóstico enviado el ${new Date().toLocaleString()}`,
          html: `<h1>Diagnóstico</h1><p>Enviado: ${new Date().toLocaleString()}</p>`
        };

        const info = await transporter.sendMail(testEmail);
        
        let previewUrl = null;
        if (testAccount) {
          previewUrl = nodemailer.getTestMessageUrl(info);
        }

        diagnostic.tests.push({
          name: 'Envío de prueba',
          status: '✅',
          details: `Email enviado: ${info.messageId}`,
          previewUrl
        });
      } catch (error: any) {
        diagnostic.tests.push({
          name: 'Envío de prueba',
          status: '❌',
          details: `Error: ${error.message}`
        });
      }
    }

    console.log('📊 Resultado del diagnóstico:', diagnostic);
    
    return NextResponse.json(diagnostic);

  } catch (error: any) {
    console.error('❌ Error en diagnóstico:', error);
    return NextResponse.json({
      error: 'Error en diagnóstico',
      message: error.message
    }, { status: 500 });
  }
}