import { Header } from '@/components/Header';
import { SignUp } from '@clerk/nextjs';

export default function Page() {
  return (
    <>
      <Header />
      <div className="flex flex-col items-center mt-10">
        <SignUp />
      </div>
    </>
  );
}
