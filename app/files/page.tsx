// app/files/page.tsx
'use client';
import { useUser } from '@clerk/nextjs';
import { FileList } from '../../encrypt-zip-module/components/FileList';
import { FileUploader } from '../../encrypt-zip-module/components/FileUploader';


export default function FilesPage() {
  const { user } = useUser();

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
      <h1>Encrypted File Manager</h1>

      <div style={{ marginBottom: '40px' }}>
        <FileUploader
          userId={user?.id}
          onComplete={() => console.log('Upload complete!')}
        />
      </div>

      <FileList userId={user?.id} />
    </div>
  );
}