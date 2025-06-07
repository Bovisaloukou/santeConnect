import { auth } from "@/auth";
import { NextResponse } from "next/server";
import type { Session } from "next-auth";

export default auth((req) => {
  const session = req.auth as Session;
  const is2FAEnabled = session?.user?.is2FAEnabled;
  const is2FAVerified = session?.user?.is2FAVerified;
  const isAuthPage = req.nextUrl.pathname.startsWith("/login") || 
                    req.nextUrl.pathname.startsWith("/register") ||
                    req.nextUrl.pathname.startsWith("/verify-2fa");

  // Vérification de la session pour les routes protégées
  if ((req.nextUrl.pathname.startsWith("/register-center") || 
       req.nextUrl.pathname.startsWith("/register/pharmacy") ||
       req.nextUrl.pathname.startsWith("/register/professional")) && !session) {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Si l'utilisateur n'est pas sur une page d'auth et a la 2FA activée mais non vérifiée
  if (!isAuthPage && is2FAEnabled && !is2FAVerified) {
    return NextResponse.redirect(new URL("/verify-2fa", req.url));
  }

  // Si l'utilisateur est sur la page de vérification 2FA mais n'a pas besoin de 2FA
  if (req.nextUrl.pathname.startsWith("/verify-2fa") && !is2FAEnabled) {
    return NextResponse.redirect(new URL("/dashboard/patient", req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/verify-2fa",
    "/settings/:path*",
    "/profile/:path*",
    "/register-center",
    "/register/pharmacy",
    "/register/professional",
  ],
}; 