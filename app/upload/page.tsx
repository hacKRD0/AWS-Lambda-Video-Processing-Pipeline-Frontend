'use client';
import { Header } from '@/components/Header';
import SubmitButton from '@/components/SubmitButton';
import { FileUpload } from '@/components/ui/file-upload';

export default function Page() {
  return (
    <>
      <Header />
      <FileUpload />
      {/* <SubmitButton /> */}
    </>
  );
}
