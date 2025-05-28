import { NextResponse } from "next/server";
import { auth } from "../[...nextauth]/route";
import { authApi } from "@/lib/apiClient";

export async function POST(request: Request) {
  try {
    const session = await auth();

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

    // Vérifier le code 2FA via l'API existante
    await authApi.verify2FA(session.user.id, code);

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
    console.error("Erreur lors de la vérification 2FA:", error);
    return NextResponse.json(
      { 
        message: error.response?.data?.message || "Erreur lors de la vérification du code 2FA" 
      },
      { status: 400 }
    );
  }
} 