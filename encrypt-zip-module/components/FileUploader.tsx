// // // // // components/FileUploader.tsx
// // // // 'use client';
// // // // import { useRef, useState } from 'react';
// // // // import { getFilesFromInput, getFilesFromDrop, formatBytes } from '../utils/fileUtils';
// // // // import { useEncryptZip } from '../hooks/useEncryptZip';
// // // // import type { FileItem } from '../types/encrypt-zip';

// // // // interface Props {
// // // //   userId?: string;
// // // //   onComplete?: () => void;
// // // // }

// // // // // Extender las propiedades del input para incluir webkitdirectory
// // // // interface InputAttributes extends React.InputHTMLAttributes<HTMLInputElement> {
// // // //   webkitdirectory?: string;
// // // // }

// // // // export function FileUploader({ userId, onComplete }: Props) {
// // // //   const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);
// // // //   const [isDragging, setIsDragging] = useState(false);
// // // //   const inputRef = useRef<HTMLInputElement>(null);
// // // //   const folderInputRef = useRef<HTMLInputElement>(null);
// // // //   const { uploads, uploadFiles } = useEncryptZip(userId);

// // // //   const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
// // // //     const files = await getFilesFromInput(e.target);
// // // //     setSelectedFiles(files);
// // // //   };

// // // //   const handleDrop = async (e: React.DragEvent) => {
// // // //     e.preventDefault();
// // // //     setIsDragging(false);
// // // //     const files = await getFilesFromDrop(e.dataTransfer.items);
// // // //     setSelectedFiles(files);
// // // //   };

// // // //   const handleUpload = async () => {
// // // //     if (selectedFiles.length === 0) return;
// // // //     await uploadFiles(selectedFiles);
// // // //     setSelectedFiles([]);
// // // //     onComplete?.();
// // // //   };

// // // //   // Props para el input de carpeta con webkitdirectory
// // // //   const folderInputProps: InputAttributes = {
// // // //     type: "file",
// // // //     webkitdirectory: "",
// // // //     onChange: handleFileSelect,
// // // //     style: { display: 'none' }
// // // //   };

// // // //   return (
// // // //     <div style={{ padding: '20px', border: '1px solid #ddd' }}>
// // // //       <h3>Upload Files</h3>

// // // //       <div
// // // //         onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
// // // //         onDragLeave={() => setIsDragging(false)}
// // // //         onDrop={handleDrop}
// // // //         style={{
// // // //           border: `2px dashed ${isDragging ? '#007bff' : '#ccc'}`,
// // // //           padding: '40px',
// // // //           textAlign: 'center',
// // // //           marginBottom: '20px',
// // // //           backgroundColor: isDragging ? '#f0f8ff' : '#fff'
// // // //         }}
// // // //       >
// // // //         Drop files or folders here
// // // //       </div>

// // // //       <div style={{ marginBottom: '20px' }}>
// // // //         <button onClick={() => inputRef.current?.click()}>
// // // //           Select Files
// // // //         </button>
// // // //         <button onClick={() => folderInputRef.current?.click()} style={{ marginLeft: '10px' }}>
// // // //           Select Folder
// // // //         </button>

// // // //         <input
// // // //           ref={inputRef}
// // // //           type="file"
// // // //           multiple
// // // //           onChange={handleFileSelect}
// // // //           style={{ display: 'none' }}
// // // //         />
// // // //         <input
// // // //           ref={folderInputRef}
// // // //           {...folderInputProps}
// // // //         />
// // // //       </div>

// // // //       {selectedFiles.length > 0 && (
// // // //         <div style={{ marginBottom: '20px' }}>
// // // //           <h4>Selected: {selectedFiles.length} files</h4>
// // // //           <div style={{ maxHeight: '200px', overflow: 'auto', border: '1px solid #ddd', padding: '10px' }}>
// // // //             {selectedFiles.map(f => (
// // // //               <div key={f.id} style={{ fontSize: '12px' }}>
// // // //                 {f.relativePath} ({formatBytes(f.file.size)})
// // // //               </div>
// // // //             ))}
// // // //           </div>
// // // //           <button onClick={handleUpload} style={{ marginTop: '10px' }}>
// // // //             Upload & Encrypt
// // // //           </button>
// // // //         </div>
// // // //       )}

// // // //       {uploads.map(u => (
// // // //         <div key={u.id} style={{ marginTop: '10px', padding: '10px', border: '1px solid #ddd' }}>
// // // //           <div>{u.name} - {u.status}</div>
// // // //           <div style={{ width: '100%', backgroundColor: '#eee', height: '20px' }}>
// // // //             <div style={{ width: `${u.progress}%`, backgroundColor: u.status === 'error' ? 'red' : 'green', height: '100%' }} />
// // // //           </div>
// // // //           {u.error && <div style={{ color: 'red' }}>{u.error}</div>}
// // // //         </div>
// // // //       ))}
// // // //     </div>
// // // //   );
// // // // }



// // // // components/FileUploader.tsx
// // // 'use client';
// // // import { useRef, useState } from 'react';
// // // import { getFilesFromInput, getFilesFromDrop, formatBytes } from '../utils/fileUtils';
// // // import { useEncryptZip } from '../hooks/useEncryptZip';
// // // import type { FileItem } from '../types/encrypt-zip';

// // // interface Props {
// // //   userId?: string;
// // //   onComplete?: () => void;
// // // }

// // // export function FileUploader({ userId, onComplete }: Props) {
// // //   const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);
// // //   const [isDragging, setIsDragging] = useState(false);
// // //   const inputRef = useRef<HTMLInputElement>(null);
// // //   const folderInputRef = useRef<HTMLInputElement>(null);
// // //   const { uploads, uploadFiles } = useEncryptZip(userId);

// // //   const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
// // //     const files = await getFilesFromInput(e.target);
// // //     setSelectedFiles(files);
// // //   };

// // //   const handleDrop = async (e: React.DragEvent) => {
// // //     e.preventDefault();
// // //     setIsDragging(false);
// // //     const files = await getFilesFromDrop(e.dataTransfer.items);
// // //     setSelectedFiles(files);
// // //   };

// // //   const handleUpload = async () => {
// // //     if (selectedFiles.length === 0) return;
// // //     await uploadFiles(selectedFiles);
// // //     setSelectedFiles([]);
// // //     onComplete?.();
// // //   };

// // //   const folderInputProps = {
// // //     type: "file" as const,
// // //     webkitdirectory: "",
// // //     onChange: handleFileSelect,
// // //     style: { display: 'none' }
// // //   };

// // //   return (
// // //     <div style={{ padding: '20px', border: '1px solid #ddd' }}>
// // //       <h3>Upload Files</h3>

// // //       <div
// // //         onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
// // //         onDragLeave={() => setIsDragging(false)}
// // //         onDrop={handleDrop}
// // //         style={{
// // //           border: `2px dashed ${isDragging ? '#007bff' : '#ccc'}`,
// // //           padding: '40px',
// // //           textAlign: 'center',
// // //           marginBottom: '20px',
// // //           backgroundColor: isDragging ? '#f0f8ff' : '#fff'
// // //         }}
// // //       >
// // //         Drop files or folders here
// // //       </div>

// // //       <div style={{ marginBottom: '20px' }}>
// // //         <button onClick={() => inputRef.current?.click()}>
// // //           Select Files
// // //         </button>
// // //         <button onClick={() => folderInputRef.current?.click()} style={{ marginLeft: '10px' }}>
// // //           Select Folder
// // //         </button>

// // //         <input
// // //           ref={inputRef}
// // //           type="file"
// // //           multiple
// // //           onChange={handleFileSelect}
// // //           style={{ display: 'none' }}
// // //         />
// // //         <input
// // //           ref={folderInputRef}
// // //           {...folderInputProps}
// // //         />
// // //       </div>

// // //       {selectedFiles.length > 0 && (
// // //         <div style={{ marginBottom: '20px' }}>
// // //           <h4>Selected: {selectedFiles.length} files</h4>
// // //           <div style={{ maxHeight: '200px', overflow: 'auto', border: '1px solid #ddd', padding: '10px' }}>
// // //             {selectedFiles.map(f => (
// // //               <div key={f.id} style={{ fontSize: '12px' }}>
// // //                 {f.relativePath} ({formatBytes(f.file.size)})
// // //               </div>
// // //             ))}
// // //           </div>
// // //           <button onClick={handleUpload} style={{ marginTop: '10px' }}>
// // //             Upload & Encrypt
// // //           </button>
// // //         </div>
// // //       )}

// // //       {uploads.map(u => (
// // //         <div key={u.id} style={{ marginTop: '10px', padding: '10px', border: '1px solid #ddd' }}>
// // //           <div>{u.name} - {u.status}</div>
// // //           <div style={{ width: '100%', backgroundColor: '#eee', height: '20px' }}>
// // //             <div style={{ width: `${u.progress}%`, backgroundColor: u.status === 'error' ? 'red' : 'green', height: '100%' }} />
// // //           </div>
// // //           {u.error && <div style={{ color: 'red' }}>{u.error}</div>}
// // //         </div>
// // //       ))}
// // //     </div>
// // //   );
// // // }




// // // components/FileUploader.tsx
// // 'use client';
// // import { useRef, useState } from 'react';
// // import { getFilesFromInput, getFilesFromDrop, formatBytes } from '../utils/fileUtils';
// // import { useEncryptZip } from '../hooks/useEncryptZip';
// // import type { FileItem } from '../types/encrypt-zip';

// // interface Props {
// //   userId?: string;
// //   onComplete?: () => void;
// // }

// // export function FileUploader({ userId, onComplete }: Props) {
// //   const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);
// //   const [isDragging, setIsDragging] = useState(false);
// //   const inputRef = useRef<HTMLInputElement>(null);
// //   const folderInputRef = useRef<HTMLInputElement>(null);
// //   const { uploads, uploadFiles } = useEncryptZip(userId);

// //   const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
// //     const files = await getFilesFromInput(e.target);
// //     setSelectedFiles(files);
// //   };

// //   const handleDrop = async (e: React.DragEvent) => {
// //     e.preventDefault();
// //     setIsDragging(false);
// //     const files = await getFilesFromDrop(e.dataTransfer.items);
// //     setSelectedFiles(files);
// //   };

// //   const handleUpload = async () => {
// //     if (selectedFiles.length === 0) return;
// //     await uploadFiles(selectedFiles);
// //     setSelectedFiles([]);
// //     onComplete?.();
// //   };

// //   const folderInputProps = {
// //     type: "file" as const,
// //     webkitdirectory: "",
// //     onChange: handleFileSelect,
// //     style: { display: 'none' }
// //   };

// //   return (
// //     <div style={{ padding: '20px', border: '1px solid #ddd' }}>
// //       <h3>Upload Files</h3>

// //       <div
// //         onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
// //         onDragLeave={() => setIsDragging(false)}
// //         onDrop={handleDrop}
// //         style={{
// //           border: `2px dashed ${isDragging ? '#007bff' : '#ccc'}`,
// //           padding: '40px',
// //           textAlign: 'center',
// //           marginBottom: '20px',
// //           backgroundColor: isDragging ? '#f0f8ff' : '#fff'
// //         }}
// //       >
// //         Drop files or folders here
// //       </div>

// //       <div style={{ marginBottom: '20px' }}>
// //         <button onClick={() => inputRef.current?.click()}>
// //           Select Files
// //         </button>
// //         <button onClick={() => folderInputRef.current?.click()} style={{ marginLeft: '10px' }}>
// //           Select Folder
// //         </button>

// //         <input
// //           ref={inputRef}
// //           type="file"
// //           multiple
// //           onChange={handleFileSelect}
// //           style={{ display: 'none' }}
// //         />
// //         <input
// //           ref={folderInputRef}
// //           {...folderInputProps}
// //         />
// //       </div>

// //       {selectedFiles.length > 0 && (
// //         <div style={{ marginBottom: '20px' }}>
// //           <h4>Selected: {selectedFiles.length} files</h4>
// //           <div style={{ maxHeight: '200px', overflow: 'auto', border: '1px solid #ddd', padding: '10px' }}>
// //             {selectedFiles.map(f => (
// //               <div key={f.id} style={{ fontSize: '12px' }}>
// //                 {f.relativePath} ({formatBytes(f.file.size)})
// //               </div>
// //             ))}
// //           </div>
// //           <button onClick={handleUpload} style={{ marginTop: '10px' }}>
// //             Upload & Encrypt
// //           </button>
// //         </div>
// //       )}

// //       {uploads.map(u => (
// //         <div key={u.id} style={{ marginTop: '10px', padding: '10px', border: '1px solid #ddd' }}>
// //           <div>{u.name} - {u.status}</div>
// //           <div style={{ width: '100%', backgroundColor: '#eee', height: '20px' }}>
// //             <div style={{ width: `${u.progress}%`, backgroundColor: u.status === 'error' ? 'red' : 'green', height: '100%' }} />
// //           </div>
// //           {u.error && <div style={{ color: 'red' }}>{u.error}</div>}
// //         </div>
// //       ))}
// //     </div>
// //   );
// // }



// // components/FileUploader.tsx
// 'use client';
// import { useRef, useState } from 'react';
// import { getFilesFromInput, getFilesFromDrop, formatBytes } from '../utils/fileUtils';
// import { useEncryptZip } from '../hooks/useEncryptZip';
// import type { FileItem } from '../types/encrypt-zip';

// interface Props {
//   userId?: string;
//   onComplete?: () => void;
// }

// export function FileUploader({ userId, onComplete }: Props) {
//   const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);
//   const [isDragging, setIsDragging] = useState(false);
//   const [isUploading, setIsUploading] = useState(false);
//   const inputRef = useRef<HTMLInputElement>(null);
//   const folderInputRef = useRef<HTMLInputElement>(null);
//   const { uploads, uploadFiles } = useEncryptZip(userId);

//   const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     try {
//       const files = await getFilesFromInput(e.target);
//       setSelectedFiles(files);
//       console.log('📁 Archivos seleccionados:', files.length);
//     } catch (error) {
//       console.error('Error selecting files:', error);
//       alert('Error selecting files: ' + (error as Error).message);
//     }
//   };

//   const handleDrop = async (e: React.DragEvent) => {
//     e.preventDefault();
//     setIsDragging(false);
//     try {
//       const files = await getFilesFromDrop(e.dataTransfer.items);
//       setSelectedFiles(files);
//       console.log('📁 Archivos arrastrados:', files.length);
//     } catch (error) {
//       console.error('Error processing dropped files:', error);
//       alert('Error processing dropped files: ' + (error as Error).message);
//     }
//   };

//   const handleUpload = async () => {
//     if (selectedFiles.length === 0) {
//       alert('Please select files first');
//       return;
//     }

//     setIsUploading(true);
//     try {
//       console.log('🔄 Iniciando upload...');
//       await uploadFiles(selectedFiles);
//       setSelectedFiles([]);
//       onComplete?.();
//       console.log('✅ Upload completado');
//     } catch (error) {
//       console.error('❌ Upload failed:', error);
//       alert('Upload failed: ' + (error as Error).message);
//     } finally {
//       setIsUploading(false);
//     }
//   };

//   const clearSelectedFiles = () => {
//     setSelectedFiles([]);
//     if (inputRef.current) inputRef.current.value = '';
//     if (folderInputRef.current) folderInputRef.current.value = '';
//   };

//   const folderInputProps = {
//     type: "file" as const,
//     webkitdirectory: "",
//     onChange: handleFileSelect,
//     style: { display: 'none' }
//   };

//   const totalSize = selectedFiles.reduce((sum, file) => sum + file.file.size, 0);

//   return (
//     <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
//       <h3 style={{ marginBottom: '20px', color: '#333' }}>Upload Files</h3>

//       {/* Drag & Drop Area */}
//       <div
//         onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
//         onDragLeave={() => setIsDragging(false)}
//         onDrop={handleDrop}
//         style={{
//           border: `2px dashed ${isDragging ? '#007bff' : '#ccc'}`,
//           padding: '40px',
//           textAlign: 'center',
//           marginBottom: '20px',
//           backgroundColor: isDragging ? '#f0f8ff' : '#fafafa',
//           borderRadius: '8px',
//           cursor: 'pointer',
//           transition: 'all 0.3s ease'
//         }}
//         onClick={() => inputRef.current?.click()}
//       >
//         <div style={{ fontSize: '48px', marginBottom: '10px' }}>📁</div>
//         <p style={{ margin: 0, fontSize: '16px', color: '#666' }}>
//           <strong>Drop files or folders here</strong>
//         </p>
//         <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#999' }}>
//           or click to select files
//         </p>
//       </div>

//       {/* Action Buttons */}
//       <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
//         <button 
//           onClick={() => inputRef.current?.click()}
//           style={{
//             padding: '10px 16px',
//             backgroundColor: '#007bff',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer'
//           }}
//         >
//           📄 Select Files
//         </button>
//         <button 
//           onClick={() => folderInputRef.current?.click()}
//           style={{
//             padding: '10px 16px',
//             backgroundColor: '#28a745',
//             color: 'white',
//             border: 'none',
//             borderRadius: '4px',
//             cursor: 'pointer'
//           }}
//         >
//           📁 Select Folder
//         </button>
        
//         <input
//           ref={inputRef}
//           type="file"
//           multiple
//           onChange={handleFileSelect}
//           style={{ display: 'none' }}
//         />
//         <input
//           ref={folderInputRef}
//           {...folderInputProps}
//         />
//       </div>

//       {/* Selected Files */}
//       {selectedFiles.length > 0 && (
//         <div style={{ 
//           marginBottom: '20px', 
//           padding: '16px', 
//           border: '1px solid #ddd',
//           borderRadius: '8px',
//           backgroundColor: '#f8f9fa'
//         }}>
//           <div style={{ 
//             display: 'flex', 
//             justifyContent: 'space-between', 
//             alignItems: 'center',
//             marginBottom: '10px'
//           }}>
//             <h4 style={{ margin: 0 }}>
//               Selected: {selectedFiles.length} files ({formatBytes(totalSize)})
//             </h4>
//             <button 
//               onClick={clearSelectedFiles}
//               style={{
//                 padding: '4px 8px',
//                 backgroundColor: '#dc3545',
//                 color: 'white',
//                 border: 'none',
//                 borderRadius: '4px',
//                 cursor: 'pointer',
//                 fontSize: '12px'
//               }}
//             >
//               Clear
//             </button>
//           </div>
          
//           <div style={{ 
//             maxHeight: '200px', 
//             overflow: 'auto', 
//             border: '1px solid #eee', 
//             padding: '10px',
//             backgroundColor: 'white',
//             borderRadius: '4px'
//           }}>
//             {selectedFiles.map(f => (
//               <div key={f.id} style={{ 
//                 fontSize: '12px', 
//                 padding: '4px 0',
//                 borderBottom: '1px solid #f0f0f0'
//               }}>
//                 📄 {f.relativePath} <span style={{ color: '#666' }}>({formatBytes(f.file.size)})</span>
//               </div>
//             ))}
//           </div>
          
//           <button 
//             onClick={handleUpload} 
//             disabled={isUploading}
//             style={{
//               marginTop: '15px',
//               padding: '12px 24px',
//               backgroundColor: isUploading ? '#6c757d' : '#007bff',
//               color: 'white',
//               border: 'none',
//               borderRadius: '4px',
//               cursor: isUploading ? 'not-allowed' : 'pointer',
//               fontSize: '16px',
//               width: '100%'
//             }}
//           >
//             {isUploading ? '🔄 Uploading...' : '🔒 Upload & Encrypt'}
//           </button>
//         </div>
//       )}

//       {/* Upload Progress */}
//       {uploads.map(u => (
//         <div key={u.id} style={{ 
//           marginTop: '10px', 
//           padding: '15px', 
//           border: '1px solid #ddd',
//           borderRadius: '8px',
//           backgroundColor: u.status === 'error' ? '#fff5f5' : '#f8f9fa'
//         }}>
//           <div style={{ 
//             display: 'flex', 
//             justifyContent: 'space-between',
//             alignItems: 'center',
//             marginBottom: '8px'
//           }}>
//             <strong>{u.name}</strong>
//             <span style={{
//               padding: '4px 8px',
//               borderRadius: '12px',
//               fontSize: '12px',
//               fontWeight: 'bold',
//               backgroundColor: 
//                 u.status === 'done' ? '#d4edda' :
//                 u.status === 'error' ? '#f8d7da' :
//                 u.status === 'uploading' ? '#cce7ff' :
//                 u.status === 'encrypting' ? '#fff3cd' :
//                 u.status === 'zipping' ? '#e2e3e5' : '#e2e3e5',
//               color: 
//                 u.status === 'done' ? '#155724' :
//                 u.status === 'error' ? '#721c24' :
//                 u.status === 'uploading' ? '#004085' :
//                 u.status === 'encrypting' ? '#856404' :
//                 u.status === 'zipping' ? '#383d41' : '#383d41'
//             }}>
//               {u.status.toUpperCase()}
//             </span>
//           </div>
          
//           <div style={{ 
//             width: '100%', 
//             backgroundColor: '#e9ecef', 
//             height: '20px',
//             borderRadius: '10px',
//             overflow: 'hidden'
//           }}>
//             <div style={{ 
//               width: `${u.progress}%`, 
//               backgroundColor: 
//                 u.status === 'error' ? '#dc3545' :
//                 u.status === 'done' ? '#28a745' :
//                 '#007bff', 
//               height: '100%',
//               transition: 'width 0.3s ease',
//               display: 'flex',
//               alignItems: 'center',
//               justifyContent: 'center',
//               fontSize: '12px',
//               color: u.progress > 50 ? 'white' : 'transparent',
//               fontWeight: 'bold'
//             }}>
//               {u.progress}%
//             </div>
//           </div>
          
//           {u.error && (
//             <div style={{ 
//               color: '#dc3545', 
//               fontSize: '14px',
//               marginTop: '8px',
//               padding: '8px',
//               backgroundColor: '#f8d7da',
//               borderRadius: '4px',
//               border: '1px solid #f5c6cb'
//             }}>
//               ❌ {u.error}
//             </div>
//           )}
//         </div>
//       ))}
//     </div>
//   );
// }



// components/FileUploader.tsx
'use client';
import { useRef, useState } from 'react';
import { getFilesFromInput, getFilesFromDrop, formatBytes, isFolder, getFolderName } from '../utils/fileUtils';
import { useEncryptZip } from '../hooks/useEncryptZip';
import type { FileItem } from '../types/encrypt-zip';

interface Props {
  userId?: string;
  onComplete?: () => void;
}

export function FileUploader({ userId, onComplete }: Props) {
  const [selectedFiles, setSelectedFiles] = useState<FileItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);
  const { uploads, uploadFiles } = useEncryptZip(userId);

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      const files = await getFilesFromInput(e.target);
      setSelectedFiles(files);
      console.log('📁 Archivos seleccionados:', files.length);
      if (isFolder(files)) {
        console.log('📂 Es una carpeta:', getFolderName(files));
      }
    } catch (error) {
      console.error('Error selecting files:', error);
      alert('Error selecting files: ' + (error as Error).message);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    try {
      const files = await getFilesFromDrop(e.dataTransfer.items);
      setSelectedFiles(files);
      console.log('📁 Archivos arrastrados:', files.length);
      if (isFolder(files)) {
        console.log('📂 Es una carpeta:', getFolderName(files));
      }
    } catch (error) {
      console.error('Error processing dropped files:', error);
      alert('Error processing dropped files: ' + (error as Error).message);
    }
  };

  const handleUpload = async () => {
    if (selectedFiles.length === 0) {
      alert('Please select files first');
      return;
    }

    setIsUploading(true);
    try {
      console.log('🔄 Iniciando upload...');
      await uploadFiles(selectedFiles);
      setSelectedFiles([]);
      onComplete?.();
      console.log('✅ Upload completado');
    } catch (error) {
      console.error('❌ Upload failed:', error);
      alert('Upload failed: ' + (error as Error).message);
    } finally {
      setIsUploading(false);
    }
  };

  const clearSelectedFiles = () => {
    setSelectedFiles([]);
    if (inputRef.current) inputRef.current.value = '';
    if (folderInputRef.current) folderInputRef.current.value = '';
  };

  const folderInputProps = {
    type: "file" as const,
    webkitdirectory: "",
    onChange: handleFileSelect,
    style: { display: 'none' }
  };

  const totalSize = selectedFiles.reduce((sum, file) => sum + file.file.size, 0);
  const isFolderUpload = isFolder(selectedFiles);
  const folderName = getFolderName(selectedFiles);

  return (
    <div style={{ padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
      <h3 style={{ marginBottom: '20px', color: '#333' }}>Upload Files</h3>

      {/* Drag & Drop Area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        style={{
          border: `2px dashed ${isDragging ? '#007bff' : '#ccc'}`,
          padding: '40px',
          textAlign: 'center',
          marginBottom: '20px',
          backgroundColor: isDragging ? '#f0f8ff' : '#fafafa',
          borderRadius: '8px',
          cursor: 'pointer',
          transition: 'all 0.3s ease'
        }}
        onClick={() => inputRef.current?.click()}
      >
        <div style={{ fontSize: '48px', marginBottom: '10px' }}>📁</div>
        <p style={{ margin: 0, fontSize: '16px', color: '#666' }}>
          <strong>Drop files or folders here</strong>
        </p>
        <p style={{ margin: '10px 0 0 0', fontSize: '14px', color: '#999' }}>
          or click to select files
        </p>
      </div>

      {/* Action Buttons */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        <button 
          onClick={() => inputRef.current?.click()}
          style={{
            padding: '10px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          📄 Select Files
        </button>
        <button 
          onClick={() => folderInputRef.current?.click()}
          style={{
            padding: '10px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer'
          }}
        >
          📁 Select Folder
        </button>
        
        <input
          ref={inputRef}
          type="file"
          multiple
          onChange={handleFileSelect}
          style={{ display: 'none' }}
        />
        <input
          ref={folderInputRef}
          {...folderInputProps}
        />
      </div>

      {/* Selected Files */}
      {selectedFiles.length > 0 && (
        <div style={{ 
          marginBottom: '20px', 
          padding: '16px', 
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: '#f8f9fa'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center',
            marginBottom: '10px'
          }}>
            <h4 style={{ margin: 0 }}>
              {isFolderUpload ? (
                <>
                  📂 Folder: {folderName} ({selectedFiles.length} files, {formatBytes(totalSize)})
                </>
              ) : (
                <>
                  Selected: {selectedFiles.length} {selectedFiles.length === 1 ? 'file' : 'files'} ({formatBytes(totalSize)})
                </>
              )}
            </h4>
            <button 
              onClick={clearSelectedFiles}
              style={{
                padding: '4px 8px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                cursor: 'pointer',
                fontSize: '12px'
              }}
            >
              Clear
            </button>
          </div>
          
          <div style={{ 
            maxHeight: '200px', 
            overflow: 'auto', 
            border: '1px solid #eee', 
            padding: '10px',
            backgroundColor: 'white',
            borderRadius: '4px'
          }}>
            {isFolderUpload ? (
              // Mostrar solo el resumen de la carpeta
              <div style={{ padding: '8px', color: '#666' }}>
                <div style={{ marginBottom: '8px' }}>
                  <strong>📂 {folderName}</strong>
                </div>
                <div style={{ fontSize: '12px', color: '#888' }}>
                  Contains {selectedFiles.length} files
                </div>
                <div style={{ fontSize: '11px', color: '#999', marginTop: '4px' }}>
                  Files will be preserved with their folder structure
                </div>
              </div>
            ) : (
              // Mostrar archivos individuales
              selectedFiles.map(f => (
                <div key={f.id} style={{ 
                  fontSize: '12px', 
                  padding: '4px 0',
                  borderBottom: '1px solid #f0f0f0'
                }}>
                  📄 {f.relativePath} <span style={{ color: '#666' }}>({formatBytes(f.file.size)})</span>
                </div>
              ))
            )}
          </div>
          
          <button 
            onClick={handleUpload} 
            disabled={isUploading}
            style={{
              marginTop: '15px',
              padding: '12px 24px',
              backgroundColor: isUploading ? '#6c757d' : '#007bff',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: isUploading ? 'not-allowed' : 'pointer',
              fontSize: '16px',
              width: '100%'
            }}
          >
            {isUploading ? '🔄 Uploading...' : '🔒 Upload & Encrypt'}
          </button>
        </div>
      )}

      {/* Upload Progress */}
      {uploads.map(u => (
        <div key={u.id} style={{ 
          marginTop: '10px', 
          padding: '15px', 
          border: '1px solid #ddd',
          borderRadius: '8px',
          backgroundColor: u.status === 'error' ? '#fff5f5' : '#f8f9fa'
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '8px'
          }}>
            <strong>{u.name}</strong>
            <span style={{
              padding: '4px 8px',
              borderRadius: '12px',
              fontSize: '12px',
              fontWeight: 'bold',
              backgroundColor: 
                u.status === 'done' ? '#d4edda' :
                u.status === 'error' ? '#f8d7da' :
                u.status === 'uploading' ? '#cce7ff' :
                u.status === 'encrypting' ? '#fff3cd' :
                u.status === 'zipping' ? '#e2e3e5' : '#e2e3e5',
              color: 
                u.status === 'done' ? '#155724' :
                u.status === 'error' ? '#721c24' :
                u.status === 'uploading' ? '#004085' :
                u.status === 'encrypting' ? '#856404' :
                u.status === 'zipping' ? '#383d41' : '#383d41'
            }}>
              {u.status.toUpperCase()}
            </span>
          </div>
          
          <div style={{ 
            width: '100%', 
            backgroundColor: '#e9ecef', 
            height: '20px',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div style={{ 
              width: `${u.progress}%`, 
              backgroundColor: 
                u.status === 'error' ? '#dc3545' :
                u.status === 'done' ? '#28a745' :
                '#007bff', 
              height: '100%',
              transition: 'width 0.3s ease',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '12px',
              color: u.progress > 50 ? 'white' : 'transparent',
              fontWeight: 'bold'
            }}>
              {u.progress}%
            </div>
          </div>
          
          {u.error && (
            <div style={{ 
              color: '#dc3545', 
              fontSize: '14px',
              marginTop: '8px',
              padding: '8px',
              backgroundColor: '#f8d7da',
              borderRadius: '4px',
              border: '1px solid #f5c6cb'
            }}>
              ❌ {u.error}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}