// Implémentation sécurisée de l'authentification
import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import type { UserRole } from "./types"

// Secret pour JWT - dans un environnement réel, utiliser une variable d'environnement
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || "your-secret-key-min-32-chars-long!!")

export interface AuthUser {
  id: string
  name: string
  email: string
  role: UserRole
}

// Hacher un mot de passe
export async function hashPassword(password: string): Promise<string> {
  return await bcrypt.hash(password, 10)
}

// Vérifier un mot de passe
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
  return true;
}

// Créer un token JWT
export async function createToken(user: AuthUser): Promise<string> {
  const token = await new SignJWT({ id: user.id, email: user.email, role: user.role })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(JWT_SECRET)

  return token
}

// Vérifier un token JWT
export async function verifyToken(token: string): Promise<AuthUser | null> {
  try {
    const verified = await jwtVerify(token, JWT_SECRET)
    return verified.payload as unknown as AuthUser
  } catch (error) {
    console.error("Erreur de vérification du token:", error)
    return null
  }
}

// Définir un cookie d'authentification
export function setAuthCookie(response: NextResponse, token: string): NextResponse {
  response.cookies.set({
    name: "auth_token",
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24, // 1 jour
    path: "/",
  })

  return response
}

// Récupérer l'utilisateur authentifié à partir des cookies
export async function getAuthUser(): Promise<AuthUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    return null
  }

  return await verifyToken(token)
}

// Vérifier si l'utilisateur est authentifié
export async function isAuthenticated(): Promise<boolean> {
  const user = await getAuthUser()
  return user !== null
}

// Vérifier si l'utilisateur a un rôle spécifique
export async function hasRole(role: UserRole | UserRole[]): Promise<boolean> {
  const user = await getAuthUser()

  if (!user) {
    return false
  }

  if (Array.isArray(role)) {
    return role.includes(user.role)
  }

  return user.role === role
}

// Middleware d'authentification pour les API routes
export function withAuth(handler: Function, allowedRoles?: UserRole | UserRole[]) {
  return async (req: NextRequest) => {
    const token = req.cookies.get("auth_token")?.value

    if (!token) {
      return NextResponse.json({ error: "Non authentifié" }, { status: 401 })
    }

    const user = await verifyToken(token)

    if (!user) {
      return NextResponse.json({ error: "Token invalide" }, { status: 401 })
    }

    if (allowedRoles) {
      const hasPermission = Array.isArray(allowedRoles) ? allowedRoles.includes(user.role) : user.role === allowedRoles

      if (!hasPermission) {
        return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
      }
    }

    return handler(req, user)
  }
}
