import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Upload } from 'lucide-react';
import { useDropzone } from 'react-dropzone';
import { FileUploadProgress } from './FileUploadProgress';

interface FileUploadTabProps {
  onUploadComplete: (url: string) => void;
}

export function FileUploadTab({ onUploadComplete }: FileUploadTabProps) {
  const [uploadingFiles, setUploadingFiles] = useState<File[]>([]);

  const supportedFormats = {
    'application/pdf': ['.pdf'],
    'application/x-dwg': ['.dwg'],
    'application/x-dxf': ['.dxf'],
    'image/jpeg': ['.jpg', '.jpeg'],
    'image/png': ['.png'],
    'image/svg+xml': ['.svg']
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: supportedFormats,
    onDrop: (acceptedFiles) => {
      setUploadingFiles(prev => [...prev, ...acceptedFiles]);
    },
    multiple: true
  });

  const handleUploadComplete = (url: string) => {
    onUploadComplete(url);
    setUploadingFiles(prev => prev.slice(1)); // Remove the completed file
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Upload Floor Plan</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          {...getRootProps()}
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
            ${isDragActive ? 'border-primary bg-primary/10' : 'border-gray-300 hover:border-primary'}`}
        >
          <input {...getInputProps()} />
          <Upload className="mx-auto h-12 w-12 text-gray-400" />
          <p className="mt-2 text-sm text-gray-600">
            {isDragActive
              ? "Drop the files here"
              : "Drag and drop your floor plans, or click to select"}
          </p>
          <p className="mt-1 text-xs text-gray-500">
            Supported formats: PDF, DWG, DXF, JPG, PNG, SVG
          </p>
        </div>
        
        {uploadingFiles.map((file, index) => (
          <FileUploadProgress
            key={index}
            file={file}
            onComplete={handleUploadComplete}
          />
        ))}
      </CardContent>
    </Card>
  );
}