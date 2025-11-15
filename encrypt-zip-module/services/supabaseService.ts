// // // services/supabaseService.ts
// // import { createClient } from '@supabase/supabase-js';

// // const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// // const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// // const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME || 'llakaScriptBucket';

// // export class SupabaseService {
// //   private client = createClient(supabaseUrl, supabaseKey);

// //   async uploadFile(encryptedData: string, fileName: string): Promise<string> {
// //     const blob = new Blob([encryptedData], { type: 'application/octet-stream' });
// //     const path = `encrypted/${Date.now()}-${fileName}`;
    
// //     const { error } = await this.client.storage
// //       .from(bucketName)
// //       .upload(path, blob);

// //     if (error) throw error;
// //     return path;
// //   }

// //   async downloadFile(path: string): Promise<Blob> {
// //     const { data, error } = await this.client.storage
// //       .from(bucketName)
// //       .download(path);

// //     if (error) throw error;
// //     return data;
// //   }

// //   async deleteFile(path: string): Promise<void> {
// //     const { error } = await this.client.storage
// //       .from(bucketName)
// //       .remove([path]);

// //     if (error) throw error;
// //   }

// //   async listFiles(): Promise<any[]> {
// //     const { data, error } = await this.client.storage
// //       .from(bucketName)
// //       .list('encrypted');

// //     if (error) throw error;
// //     return data || [];
// //   }
// // }

// // export const supabaseService = new SupabaseService();



// // services/supabaseService.ts
// import { createClient } from '@supabase/supabase-js';

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
// const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME || 'llakaScriptBucket';

// export class SupabaseService {
//   private client = createClient(supabaseUrl, supabaseKey);

//   async uploadFile(encryptedBlob: Blob, fileName: string): Promise<string> {
//     const path = `encrypted/${Date.now()}-${fileName}.encrypted`;
    
//     const { error } = await this.client.storage
//       .from(bucketName)
//       .upload(path, encryptedBlob, {
//         contentType: 'application/octet-stream'
//       });

//     if (error) throw error;
//     return path;
//   }

//   async downloadFile(path: string): Promise<Blob> {
//     const { data, error } = await this.client.storage
//       .from(bucketName)
//       .download(path);

//     if (error) throw error;
//     return data;
//   }

//   async deleteFile(path: string): Promise<void> {
//     const { error } = await this.client.storage
//       .from(bucketName)
//       .remove([path]);

//     if (error) throw error;
//   }

//   async listFiles(): Promise<any[]> {
//     const { data, error } = await this.client.storage
//       .from(bucketName)
//       .list('encrypted');

//     if (error) throw error;
//     return data || [];
//   }
// }

// export const supabaseService = new SupabaseService();




// services/supabaseService.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const bucketName = process.env.NEXT_PUBLIC_BUCKET_NAME || 'llakaScriptBucket';

export class SupabaseService {
  private client = createClient(supabaseUrl, supabaseKey);

  async uploadFile(encryptedBlob: Blob, fileName: string): Promise<string> {
    const path = `encrypted/${Date.now()}-${fileName}.encrypted`;
    
    console.log('☁️ Subiendo a Supabase:', path);
    const { error } = await this.client.storage
      .from(bucketName)
      .upload(path, encryptedBlob, {
        contentType: 'application/octet-stream'
      });

    if (error) {
      console.error('❌ Error subiendo a Supabase:', error);
      throw error;
    }

    console.log('✅ Subido a Supabase exitosamente');
    return path;
  }

  async downloadFile(path: string): Promise<Blob> {
    console.log('☁️ Descargando de Supabase:', path);
    const { data, error } = await this.client.storage
      .from(bucketName)
      .download(path);

    if (error) {
      console.error('❌ Error descargando de Supabase:', error);
      throw error;
    }

    console.log('✅ Descargado de Supabase exitosamente');
    return data;
  }

  async deleteFile(path: string): Promise<void> {
    console.log('☁️ Eliminando de Supabase:', path);
    const { error } = await this.client.storage
      .from(bucketName)
      .remove([path]);

    if (error) {
      console.error('❌ Error eliminando de Supabase:', error);
      throw error;
    }

    console.log('✅ Eliminado de Supabase exitosamente');
  }

  async listFiles(): Promise<any[]> {
    const { data, error } = await this.client.storage
      .from(bucketName)
      .list('encrypted');

    if (error) {
      console.error('❌ Error listando archivos de Supabase:', error);
      throw error;
    }

    return data || [];
  }
}

export const supabaseService = new SupabaseService();