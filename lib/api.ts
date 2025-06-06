// Service API centralisé pour gérer les appels au backend
import type { ApiResponse } from "./types"

// Configuration de base
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

// Fonction utilitaire pour construire les options de requête
const buildRequestOptions = (method: string, data?: any, token?: string): RequestInit => {
  const options: RequestInit = {
    method,
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include",
  }

  if (token) {
    options.headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
    }
  }

  if (data && method !== "GET") {
    options.body = JSON.stringify(data)
  }

  return options
}

// Fonction générique pour les appels API
async function fetchApi<T>(endpoint: string, options: RequestInit, mockData?: T): Promise<ApiResponse<T>> {
  // Si nous sommes en développement et que des données fictives sont fournies, les utiliser
  if (process.env.NODE_ENV === "development" && mockData) {
    // Simuler un délai réseau
    await new Promise((resolve) => setTimeout(resolve, 500))
    return { data: mockData, status: 200 }
  }

  try {
    const response = await fetch(API_BASE_URL + endpoint, options)

    // Vérifier le type de contenu avant de parser comme JSON
    const contentType = response.headers.get("content-type")

    // Si la réponse n'est pas du JSON, gérer l'erreur
    if (!contentType || !contentType.includes("application/json")) {
      const responseText = await response.text().catch(() => "Impossible de lire la réponse")
      return {
        error: "Le serveur a renvoyé une réponse non-JSON",
        status: response.status,
      }
    }

    const data = await response.json().catch((error) => {
      return { error: "Format de réponse invalide" }
    })

    if (!response.ok) {
      // Gérer les erreurs d'authentification
      if (response.status === 401) {
        // Rediriger vers la page de connexion si le token est expiré
        if (typeof window !== "undefined") {
          localStorage.removeItem("auth_token")
          window.location.href = "/login"
        }
      }

      return {
        error: data.error || "Une erreur est survenue",
        status: response.status,
      }
    }

    return { data: data as T, status: response.status }
  } catch (error) {
    return {
      error: "Erreur de connexion au serveur",
      status: 500,
    }
  }
}

// Fonction pour récupérer le token d'authentification
const getAuthToken = (): string | undefined => {
  if (typeof window !== "undefined") {
    return localStorage.getItem("auth_token") || undefined
  }
  return undefined
}

// API Service
const api = {
  // Méthodes HTTP génériques
  get: <T,>(endpoint: string, mockData?: T): Promise<ApiResponse<T>> => {
    const token = getAuthToken()
    const options = buildRequestOptions("GET", undefined, token)
    return fetchApi<T>(endpoint, options, mockData)
  },

  post: <T,>(endpoint: string, data: any, mockData?: T): Promise<ApiResponse<T>> => {
    const token = getAuthToken()
    const options = buildRequestOptions("POST", data, token)
    return fetchApi<T>(endpoint, options, mockData)
  },

  put: <T,>(endpoint: string, data: any, mockData?: T): Promise<ApiResponse<T>> => {
    const token = getAuthToken()
    const options = buildRequestOptions("PUT", data, token)
    return fetchApi<T>(endpoint, options, mockData)
  },

  delete: <T,>(endpoint: string, mockData?: T): Promise<ApiResponse<T>> => {
    const token = getAuthToken()
    const options = buildRequestOptions("DELETE", undefined, token)
    return fetchApi<T>(endpoint, options, mockData)
  },

  // Méthodes spécifiques pour l'authentification
  register: (userData: any) => api.post<{ user: any; token: string }>("/auth/register", userData),

  logout: async () => {
    const token = getAuthToken()
    if (token) {
      await api.post("/auth/logout", {})
      if (typeof window !== "undefined") {
        localStorage.removeItem("auth_token")
      }
    }
  },

  checkAuth: () => api.get("/auth/me"),
}

export default api
