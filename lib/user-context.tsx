"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import type { UserRole } from "./types"

interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
}

interface UserContextType {
  user: User | null
  setUser: (user: User | null) => void
  isLoading: boolean
  logout: () => Promise<void>
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
  isLoading: true,
  logout: async () => {},
})

export function UserProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // Simuler un délai de chargement
        await new Promise(resolve => setTimeout(resolve, 500));

        // Fournir un utilisateur fictif puisque le backend n'est pas là
        const mockUser: User = {
          id: "user-1",
          name: "Patient Fictif",
          email: "patient@example.com",
          role: "patient",
          avatar: "/placeholder-user.jpg",
        };

        setUser(mockUser);
        setIsLoading(false);
      } catch (error) {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const logout = async () => {
    try {
      await fetch("/api/auth", {
        method: "DELETE",
      })
      setUser(null)
      localStorage.removeItem("user")
      window.location.href = "/login"
    } catch (error) {
      console.error("Erreur de déconnexion:", error)
    }
  }

  return <UserContext.Provider value={{ user, setUser, isLoading, logout }}>{children}</UserContext.Provider>
}

export const useUser = () => useContext(UserContext)
