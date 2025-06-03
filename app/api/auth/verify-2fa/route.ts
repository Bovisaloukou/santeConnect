import { NextResponse } from "next/server";
import { auth } from "../[...nextauth]/route";
import { getToken } from "next-auth/jwt";

export async function POST(request: Request) {
  try {
    const session = await auth();
    const token = await getToken({ 
      req: request as any,
      secret: process.env.AUTH_SECRET 
    });

    if (!session?.user?.id) {
      return NextResponse.json(
        { message: "Non autorisé" },
        { status: 401 }
      );
    }

    const { code } = await request.json();

    if (!code) {
      return NextResponse.json(
        { message: "Code 2FA requis" },
        { status: 400 }
      );
    }

    // Ajouter l'accessToken aux headers de la requête
    const headers = new Headers(request.headers);
    if (token && (token as any).accessToken) {
      headers.set('Authorization', `Bearer ${(token as any).accessToken}`);
    }
    
    // Vérifier le code 2FA via l'API existante avec les headers modifiés
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/2fa/verify/${session.user.id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${(token as any).accessToken}`
      },
      body: JSON.stringify({ otp: code })
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || "Erreur lors de la vérification du code 2FA");
    }

    // Mettre à jour le token JWT
    const updatedSession = {
      ...session,
      user: {
        ...session.user,
        is2FAVerified: true
      }
    };

    // Renvoyer la session mise à jour
    return NextResponse.json({
      success: true,
      session: updatedSession
    });

  } catch (error: any) {
    return NextResponse.json(
      { 
        message: error.response?.data?.message || "Erreur lors de la vérification du code 2FA" 
      },
      { status: 400 }
    );
  }
} 