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
          // Ajouter une assertion de type pour informer TypeScript de la structure de response.data
          const authData = response.data as { user: User };
          setUser(authData.user)
          localStorage.setItem("user", JSON.stringify(authData.user))
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

      // Vérifier si les identifiants correspondent aux utilisateurs de démonstration
      const isDemoUser = (
        (email === "patient@example.com" ||
          email === "doctor@example.com" ||
          email === "pharmacy@example.com" ||
          email === "demo") &&
        (password === "password123" || password === "demo")
      )

      if (isDemoUser) {
        console.log(`[AuthContext Login DEMO] Attempting login for demo user: ${email}`);
        let mockUser: User

        if (email === "demo" || email === "patient@example.com") {
          console.log("[AuthContext Login DEMO] Assigning MOCK_USERS.patient");
          mockUser = MOCK_USERS.patient
        } else if (email === "doctor@example.com") {
          console.log("[AuthContext Login DEMO] Assigning MOCK_USERS.healthcare");
          mockUser = MOCK_USERS.healthcare
        } else { // Implies pharmacy@example.com
          console.log("[AuthContext Login DEMO] Assigning MOCK_USERS.pharmacy");
          mockUser = MOCK_USERS.pharmacy
        }

        // Simuler un délai réseau
        await new Promise((resolve) => setTimeout(resolve, 800))

        // Stocker l'utilisateur et le token fictifs
        setUser(mockUser)
        localStorage.setItem("user", JSON.stringify(mockUser))
        localStorage.setItem("auth_token", "mock-jwt-token")

        toast({
          title: "Connexion réussie (Démo)",
          description: `Bienvenue, ${mockUser.name}! (Mode Démo)`,
        })

        console.log("[AuthContext Login DEMO] Demo login successful.");
        return true // Connexion réussie avec les identifiants de démo
      } else {
        // Sinon, tenter de se connecter via l'API réelle
        console.log(`[AuthContext Login API] Attempting login via API for email: ${email}`);
        const response = await api.login(email, password)
        console.log("[AuthContext Login API] API response:", response);

        if (response.error) {
          console.log("[AuthContext Login API] API returned error. Triggering toast.");
          toast({
            title: "Erreur de connexion",
            description: response.error, // Utiliser l'erreur retournée par l'API
            variant: "destructive",
          })
          return false
        }

        // Assurer que response.data et response.data.user existent avant d'y accéder
        if (response.data && response.data.user) {
          console.log("[AuthContext Login API] API returned success. Setting user.");
          setUser(response.data.user as User) // Assurer le type correct
          localStorage.setItem("user", JSON.stringify(response.data.user))
          localStorage.setItem("auth_token", response.data.token)

          toast({
            title: "Connexion réussie",
            description: `Bienvenue, ${response.data.user.name}!`,
          })

          return true
        } else {
             // Gérer le cas où l'API ne renvoie pas les données attendues même sans erreur
             console.log("[AuthContext Login API] API response missing expected data. Triggering toast.");
             toast({
                title: "Erreur de connexion",
                description: "Réponse API inattendue.",
                variant: "destructive",
             });
             return false;
        }
      }
    } catch (error) {
      console.error("Erreur de connexion inattendue:", error)
      toast({
        title: "Erreur de connexion",
        description: "Une erreur inattendue est survenue lors de la connexion.",
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
