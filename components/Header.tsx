'use client';
import React from 'react';
import { SignInButton, SignedIn, SignedOut, UserButton } from '@clerk/nextjs';
export const Header = () => {
  return (
    <nav className="flex justify-center p-4 bg-gray-800">
      <div className="flex items-center justify-center bg-gray-700 px-6 py-2 rounded">
        <a href="/" className="text-white mx-3">
          Home
        </a>
        <a href="#about" className="text-white mx-3">
          About
        </a>
        <a href="#history" className="text-white mx-3">
          History
        </a>
      </div>
      <div className="ml-auto">
        <SignedOut>
          <div className="flex items-center justify-center rounded bg-gray-700 text-white py-2 px-6 mx-3">
            <SignInButton />
          </div>
        </SignedOut>
        <SignedIn>
          <div className="flex px-6 py-1">
            <UserButton />
          </div>
        </SignedIn>
      </div>
    </nav>
  );
};
