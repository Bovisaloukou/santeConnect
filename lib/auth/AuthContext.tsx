"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { useRouter } from "next/navigation"
import type { User, UserRole } from "../types"
import api from "../api"
import { useToast } from "@/components/ui/use-toast"

// Données fictives pour les utilisateurs de démonstration
const MOCK_USERS = {
  patient: {
    id: "user-1",
    email: "patient@example.com",
    name: "Jean Dupont",
    role: "patient" as UserRole,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  healthcare: {
    id: "user-2",
    email: "doctor@example.com",
    name: "Dr. Marie Koné",
    role: "healthcare" as UserRole,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  pharmacy: {
    id: "user-3",
    email: "pharmacy@example.com",
    name: "Pharmacie Centrale",
    role: "pharmacy" as UserRole,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
}

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
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { toast } = useToast()

  // Vérifier l'authentification au chargement
  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Vérifier d'abord si nous avons un utilisateur dans le localStorage
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
          setIsLoading(false)
          return
        }

        // En développement, ne pas essayer de récupérer l'utilisateur depuis l'API
        // si nous n'avons pas d'utilisateur dans le localStorage
        if (process.env.NODE_ENV === "development") {
          setIsLoading(false)
          return
        }

        // Sinon, essayer de récupérer l'utilisateur depuis l'API
        console.log("Appel API checkAuth")
        const response = await api.checkAuth()
        console.log("Réponse API checkAuth:", response)

        if (response.data) {
          setUser(response.data.user)
          localStorage.setItem("user", JSON.stringify(response.data.user))
        }
      } catch (error) {
        console.error("Erreur d'authentification:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      setIsLoading(true)

      // En développement, utiliser des données fictives
      if (process.env.NODE_ENV === "development") {
        // Simuler un délai réseau
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Vérifier les identifiants
        if (
          (email === "patient@example.com" ||
            email === "doctor@example.com" ||
            email === "pharmacy@example.com" ||
            email === "demo") &&
          (password === "password123" || password === "demo")
        ) {
          let mockUser: User

          if (email === "demo" || email === "patient@example.com") {
            mockUser = MOCK_USERS.patient
          } else if (email === "doctor@example.com") {
            mockUser = MOCK_USERS.healthcare
          } else {
            mockUser = MOCK_USERS.pharmacy
          }

          // Stocker l'utilisateur et le token
          setUser(mockUser)
          localStorage.setItem("user", JSON.stringify(mockUser))
          localStorage.setItem("auth_token", "mock-jwt-token")

          toast({
            title: "Connexion réussie",
            description: `Bienvenue, ${mockUser.name}!`,
          })

          return true
        } else {
          toast({
            title: "Erreur de connexion",
            description: "Identifiants incorrects. Veuillez réessayer.",
            variant: "destructive",
          })
          return false
        }
      }

      // En production, appeler l'API réelle
      const response = await api.login(email, password)

      if (response.error) {
        toast({
          title: "Erreur de connexion",
          description: response.error,
          variant: "destructive",
        })
        return false
      }

      if (response.data) {
        setUser(response.data.user)
        localStorage.setItem("user", JSON.stringify(response.data.user))
        localStorage.setItem("auth_token", response.data.token)

        toast({
          title: "Connexion réussie",
          description: `Bienvenue, ${response.data.user.name}!`,
        })

        return true
      }

      return false
    } catch (error) {
      console.error("Erreur de connexion:", error)
      toast({
        title: "Erreur de connexion",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  const logout = async (): Promise<void> => {
    try {
      setIsLoading(true)
      await api.logout()
      setUser(null)
      localStorage.removeItem("user")
      localStorage.removeItem("auth_token")
      router.push("/login")
    } catch (error) {
      console.error("Erreur de déconnexion:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const register = async (userData: any): Promise<boolean> => {
    try {
      setIsLoading(true)
      const response = await api.register(userData)

      if (response.error) {
        toast({
          title: "Erreur d'inscription",
          description: response.error,
          variant: "destructive",
        })
        return false
      }

      if (response.data) {
        setUser(response.data.user)
        localStorage.setItem("user", JSON.stringify(response.data.user))
        localStorage.setItem("auth_token", response.data.token)

        toast({
          title: "Inscription réussie",
          description: "Votre compte a été créé avec succès.",
        })

        return true
      }

      return false
    } catch (error) {
      console.error("Erreur d'inscription:", error)
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur est survenue. Veuillez réessayer.",
        variant: "destructive",
      })
      return false
    } finally {
      setIsLoading(false)
    }
  }

  return <AuthContext.Provider value={{ user, isLoading, login, logout, register }}>{children}</AuthContext.Provider>
}

export const useAuth = () => useContext(AuthContext)
