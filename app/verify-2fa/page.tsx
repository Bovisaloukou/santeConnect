import { Suspense } from "react";
import Verify2FAClient from "./Verify2FAClient";

export default function Verify2FAPage() {
  return (
    <Suspense fallback={<div>Chargement...</div>}>
      <Verify2FAClient />
    </Suspense>
  );
} 