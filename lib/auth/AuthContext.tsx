"use client"

import { createContext, useContext, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { User, UserRole } from "../types"
import { useToast } from "@/components/ui/use-toast"
import { signIn, signOut, useSession } from "next-auth/react"

interface AuthContextType {
  user: User | null
  isLoading: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => Promise<void>
  register: (userData: any) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: true,
  login: async () => false,
  logout: async () => {},
  register: async () => false,
})

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { data: session, status } = useSession()
  const user = session?.user ? {
    id: session.user.id || '',
    createdAt: '',
    name: session.user.name,
    firstName: session.user.name?.split(' ')[0] || '',
    lastName: session.user.name?.split(' ')[1] || '',
    gender: 'Non spécifié',
    email: session.user.email || '',
    birthDate: '',
    contact: '',
    isEnabled: session.user.isEnabled,
    is2FAEnabled: session.user.is2FAEnabled || false,
    is2FAVerified: session.user.is2FAVerified || false,
    role: (session.user as any).role as UserRole
  } as User : null;
  const isLoading = status === "loading"

  const router = useRouter()
  const { toast } = useToast()

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const result = await signIn('credentials', {
        redirect: false,
        email,
        password,
      });

      if (result?.error) {
        toast({
          title: "Erreur de connexion",
          description: result.error || "Identifiants invalides",
          variant: "destructive",
        });
        return false;
      }

      // Si la connexion (next-auth ou simulée côté login page) réussit, rediriger vers la page de vérification 2FA
      // On passe l'email en paramètre pour déterminer le rôle sur la page de vérification (temporaire pour la démo)
      router.push(`/verify-2fa?email=${encodeURIComponent(email)}`);

      return true; // Indiquer que la première étape de login est réussie

    } catch (error) {
      console.error("Erreur de connexion inattendue:", error);
      toast({
        title: "Erreur de connexion",
        description: "Une erreur inattendue est survenue lors de la connexion.",
        variant: "destructive",
      });
      return false;
    }
  }

  const logout = async (): Promise<void> => {
    await signOut({ redirect: false });
    router.push("/login");
  }

  const register = async (userData: any): Promise<boolean> => {
    console.warn("La fonction register dans useAuth utilise toujours l'ancienne logique API.");

    toast({
      title: "Inscription non implémentée",
      description: "La fonction d'inscription utilise toujours l'ancienne logique API non connectée à NextAuth.js.",
      variant: "destructive",
    });
    return Promise.resolve(false);
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
