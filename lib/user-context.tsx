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
    // Vérifier l'authentification au chargement
    const checkAuth = async () => {
      try {
        // Vérifier d'abord si nous avons un utilisateur dans le localStorage
        const storedUser = localStorage.getItem("user")
        if (storedUser) {
          setUser(JSON.parse(storedUser))
          setIsLoading(false)
          return
        }

        // Sinon, essayer de récupérer l'utilisateur depuis l'API
        const response = await fetch("/api/auth/me")
        if (response.ok) {
          const data = await response.json()
          setUser(data.user)
          // Stocker l'utilisateur dans le localStorage pour la persistance
          localStorage.setItem("user", JSON.stringify(data.user))
        }
      } catch (error) {
        console.error("Erreur d'authentification:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

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
