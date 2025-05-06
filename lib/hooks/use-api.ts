"use client"

import { useState, useEffect, useCallback } from "react"
import api from "@/lib/api-service"

interface UseApiOptions<T> {
  endpoint: string
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: any
  initialData?: T
  onSuccess?: (data: T) => void
  onError?: (error: string) => void
  loadOnMount?: boolean
}

export function useApi<T>({
  endpoint,
  method = "GET",
  body,
  initialData,
  onSuccess,
  onError,
  loadOnMount = true,
}: UseApiOptions<T>) {
  const [data, setData] = useState<T | null>(initialData || null)
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(loadOnMount)

  const execute = useCallback(
    async (customBody?: any) => {
      setIsLoading(true)
      setError(null)

      try {
        let response

        switch (method) {
          case "GET":
            response = await api.get<T>(endpoint)
            break
          case "POST":
            response = await api.post<T>(endpoint, customBody || body)
            break
          case "PUT":
            response = await api.put<T>(endpoint, customBody || body)
            break
          case "DELETE":
            response = await api.delete<T>(endpoint)
            break
        }

        if (response.error) {
          setError(response.error)
          onError?.(response.error)
        } else {
          setData(response.data)
          onSuccess?.(response.data as T)
        }

        return response
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue"
        setError(errorMessage)
        onError?.(errorMessage)
        return { data: null, error: errorMessage, status: 500 }
      } finally {
        setIsLoading(false)
      }
    },
    [endpoint, method, body, onSuccess, onError],
  )

  useEffect(() => {
    if (loadOnMount) {
      execute()
    }
  }, [loadOnMount, execute])

  return { data, error, isLoading, execute, setData }
}
