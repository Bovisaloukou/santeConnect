"use client";

import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Suspense } from 'react';
import ResetPasswordForm from './ResetPasswordForm';
import LoadingSpinner from "@/components/ui/loading-spinner"

function LoadingFallback() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <LoadingSpinner size="lg" />
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