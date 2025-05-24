"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Suspense } from 'react';
import ResetPasswordForm from './ResetPasswordForm';

function LoadingFallback() {
  return (
    <div className="w-full max-w-md text-center p-8">
      <p>Chargement du formulaire de réinitialisation...</p>
    </div>
  );
}

export default function ResetPasswordPageContainer() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 mt-9">
        <Suspense fallback={<LoadingFallback />}>
          <ResetPasswordForm />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
} 