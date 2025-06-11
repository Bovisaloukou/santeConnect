import { Suspense } from "react";
import Verify2FAClient from "./Verify2FAClient";
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function Verify2FAPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center min-h-[60vh]">
        <LoadingSpinner size="lg" />
      </div>
    }>
      <Verify2FAClient />
    </Suspense>
  );
} 