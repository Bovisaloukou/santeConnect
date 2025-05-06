import { type NextRequest, NextResponse } from "next/server"
import { getAuthUser } from "@/lib/auth"

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthUser()

    if (!user) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    return NextResponse.json({ user })
  } catch (error) {
    console.error("Erreur lors de la récupération de l'utilisateur:", error)
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 })
  }
}
