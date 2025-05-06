// Service pour gérer les appels API
import { toast } from "@/components/ui/use-toast"

// Types de base pour les réponses API
interface ApiResponse<T> {
  data: T | null
  error: string | null
  status: number
}

// Configuration de base pour les requêtes
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || ""

// Fonction générique pour les appels API
async function apiRequest<T>(
  endpoint: string,
  method = "GET",
  body?: any,
  customHeaders?: Record<string, string>,
): Promise<ApiResponse<T>> {
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      ...customHeaders,
    }

    // Récupérer le token d'authentification s'il existe
    const user = localStorage.getItem("user")
    if (user) {
      const token = JSON.parse(user).token
      if (token) {
        headers["Authorization"] = `Bearer ${token}`
      }
    }

    const options: RequestInit = {
      method,
      headers,
      credentials: "include", // Pour inclure les cookies dans les requêtes
    }

    if (body && method !== "GET") {
      options.body = JSON.stringify(body)
    }

    // En développement, simuler les appels API
    if (process.env.NODE_ENV === "development" && !API_BASE_URL) {
      return await simulateApiCall<T>(endpoint, method, body)
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, options)
    const data = await response.json()

    if (!response.ok) {
      // Gérer les erreurs d'authentification
      if (response.status === 401) {
        localStorage.removeItem("user")
        window.location.href = "/login"
        return { data: null, error: "Session expirée. Veuillez vous reconnecter.", status: 401 }
      }

      return { data: null, error: data.error || "Une erreur est survenue", status: response.status }
    }

    return { data: data as T, error: null, status: response.status }
  } catch (error) {
    console.error("Erreur API:", error)
    return { data: null, error: "Erreur de connexion au serveur", status: 500 }
  }
}

// Simuler les appels API pour le développement frontend
async function simulateApiCall<T>(endpoint: string, method: string, body?: any): Promise<ApiResponse<T>> {
  console.log(`Simulation d'appel API: ${method} ${endpoint}`, body)

  // Attendre un délai aléatoire pour simuler la latence réseau
  await new Promise((resolve) => setTimeout(resolve, Math.random() * 500 + 200))

  // Simuler différentes réponses en fonction de l'endpoint
  if (endpoint.includes("/auth/me")) {
    const user = localStorage.getItem("user")
    if (user) {
      return { data: JSON.parse(user) as unknown as T, error: null, status: 200 }
    }
    return { data: null, error: "Non authentifié", status: 401 }
  }

  // Ajouter d'autres simulations selon les besoins

  // Par défaut, retourner une réponse de succès vide
  return { data: null, error: null, status: 200 }
}

// Fonctions d'aide pour les méthodes HTTP courantes
export const api = {
  get: <T>(endpoint: string, customHeaders?: Record<string, string>) =>\
    apiRequest<T>(endpoint, "GET", undefined, customHeaders),

  post: <T>(endpoint: string, data: any, customHeaders?: Record<string, string>) =>
    apiRequest<T>(endpoint, "POST", data, customHeaders),

  put: <T>(endpoint: string, data: any, customHeaders?: Record<string, string>) =>
    apiRequest<T>(endpoint, "PUT", data, customHeaders),

  delete: <T>(endpoint: string, customHeaders?: Record<string, string>) =>
    apiRequest<T>(endpoint, "DELETE", undefined, customHeaders),

  // Fonction utilitaire pour gérer les erreurs API et afficher des toasts
  handleError: (error: string | null) => {
    if (error) {
      toast({
        title: "Erreur",
        description: error,
        variant: "destructive",
      })
    }
  }
}

export default api
