'use client';
import React, { useState } from 'react';
import { FileUpload } from '@/components/ui/file-upload';
import SubmitButton from './SubmitButton';

export function FileUploadDemo() {
  const [files, setFiles] = useState<File[]>([]);
  const handleFileUpload = (files: File[]) => {
    setFiles(files);
    console.log(files);
  };

  return (
    <>
      <div className="p-52">
        <FileUpload onChange={handleFileUpload} />
      </div>
      <div className="flex justify-end mt-4">
        <SubmitButton />
      </div>
    </>
  );
}
