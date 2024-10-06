'use client';
import { Header } from '@/components/Header';
import { FileUpload } from '@/components/ui/file-upload';
import { Results } from '@/components/Results';

export default function Page() {
  return (
    <>
      <Header />
      <FileUpload />
      <Results />
    </>
  );
}
