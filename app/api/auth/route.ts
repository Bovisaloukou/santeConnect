import { type NextRequest, NextResponse } from "next/server"
import { createToken, hashPassword, setAuthCookie, verifyPassword } from "@/lib/auth"
import type { UserRole } from "@/lib/types"

// Simuler une base de données d'utilisateurs avec mots de passe hachés
// Dans une application réelle, ces données seraient dans une base de données
const users = [
  {
    id: "user-1",
    email: "patient@example.com",
    // Le mot de passe serait haché dans une vraie application
    password: "$2a$10$8r5tFBr5M1VVj84bpU6QR.Y1YhVE4mHnbcqRL9Oty/9qJGTQV2Ope", // "password123" haché
    name: "Jean Dupont",
    role: "patient" as UserRole,
  },
  {
    id: "user-2",
    email: "doctor@example.com",
    password: "$2a$10$8r5tFBr5M1VVj84bpU6QR.Y1YhVE4mHnbcqRL9Oty/9qJGTQV2Ope", // "password123" haché
    name: "Dr. Marie Koné",
    role: "healthcare" as UserRole,
  },
  {
    id: "user-3",
    email: "pharmacy@example.com",
    password: "$2a$10$8r5tFBr5M1VVj84bpU6QR.Y1YhVE4mHnbcqRL9Oty/9qJGTQV2Ope", // "password123" haché
    name: "Pharmacie Centrale",
    role: "pharmacy" as UserRole,
  },
  {
    id: "user-4",
    email: "admin@example.com",
    password: "$2a$10$8r5tFBr5M1VVj84bpU6QR.Y1YhVE4mHnbcqRL9Oty/9qJGTQV2Ope", // "password123" haché
    name: "Admin",
    role: "admin" as UserRole,
  },
]

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Vérifier si l'email existe
    const user = users.find((u) => u.email === email)

    if (!user) {
      return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 })
    }

    // Vérifier le mot de passe
    const passwordValid = await verifyPassword(password, user.password)

    if (!passwordValid) {
      return NextResponse.json({ error: "Identifiants invalides" }, { status: 401 })
    }

    // Créer un token JWT
    const token = await createToken({
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
    })

    // Créer la réponse
    const response = NextResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
      message: "Connexion réussie",
    })

    // Définir le cookie d'authentification
    return setAuthCookie(response, token)
  } catch (error) {
    console.error("Erreur d'authentification:", error)
    return NextResponse.json({ error: "Erreur lors de l'authentification" }, { status: 500 })
  }
}

// Route pour l'inscription
export async function PUT(request: NextRequest) {
  try {
    const userData = await request.json()

    // Validation des données
    if (!userData.email || !userData.password || !userData.name || !userData.role) {
      return NextResponse.json({ error: "Données utilisateur incomplètes" }, { status: 400 })
    }

    // Vérifier si l'email existe déjà
    const existingUser = users.find((u) => u.email === userData.email)
    if (existingUser) {
      return NextResponse.json({ error: "Cet email est déjà utilisé" }, { status: 409 })
    }

    // Hacher le mot de passe
    const hashedPassword = await hashPassword(userData.password)

    // Créer un nouvel utilisateur
    const newUser = {
      id: `user-${users.length + 1}`,
      email: userData.email,
      password: hashedPassword,
      name: userData.name,
      role: userData.role as UserRole,
    }

    // Dans une application réelle, nous ajouterions l'utilisateur à la base de données
    users.push(newUser)

    // Créer un token JWT
    const token = await createToken({
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
    })

    // Créer la réponse
    const response = NextResponse.json({
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
      },
      message: "Inscription réussie",
    })

    // Définir le cookie d'authentification
    return setAuthCookie(response, token)
  } catch (error) {
    console.error("Erreur d'inscription:", error)
    return NextResponse.json({ error: "Erreur lors de l'inscription" }, { status: 500 })
  }
}

// Route pour la déconnexion
export async function DELETE() {
  const response = NextResponse.json({ message: "Déconnexion réussie" })
  response.cookies.delete("auth_token")
  return response
}
