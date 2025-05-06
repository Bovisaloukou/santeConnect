"use client"

import { useState, useEffect, useCallback } from "react"
import type { ApiResponse } from "../types"
import api from "../api"

interface UseApiOptions<T> {
  endpoint: string
  method?: "GET" | "POST" | "PUT" | "DELETE"
  body?: any
  mockData?: T
  dependencies?: any[]
  onSuccess?: (data: T) => void
  onError?: (error: string) => void
  loadOnMount?: boolean
}

export function useApi<T>({
  endpoint,
  method = "GET",
  body,
  mockData,
  dependencies = [],
  onSuccess,
  onError,
  loadOnMount = true,
}: UseApiOptions<T>) {
  const [data, setData] = useState<T | undefined>(undefined)
  const [error, setError] = useState<string | undefined>(undefined)
  const [isLoading, setIsLoading] = useState<boolean>(loadOnMount)

  const execute = useCallback(
    async (customBody?: any) => {
      setIsLoading(true)
      setError(undefined)

      try {
        let response: ApiResponse<T>

        switch (method) {
          case "GET":
            response = await api.get<T>(endpoint, mockData)
            break
          case "POST":
            response = await api.post<T>(endpoint, customBody || body, mockData)
            break
          case "PUT":
            response = await api.put<T>(endpoint, customBody || body, mockData)
            break
          case "DELETE":
            response = await api.delete<T>(endpoint, mockData)
            break
          default:
            throw new Error(`Méthode HTTP non supportée: ${method}`)
        }

        if (response.error) {
          setError(response.error)
          onError?.(response.error)
        } else if (response.data) {
          setData(response.data)
          onSuccess?.(response.data)
        }

        return response
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue"
        setError(errorMessage)
        onError?.(errorMessage)
        return { error: errorMessage, status: 500 } as ApiResponse<T>
      } finally {
        setIsLoading(false)
      }
    },
    [endpoint, method, body, mockData, onSuccess, onError, ...dependencies],
  )

  useEffect(() => {
    if (loadOnMount) {
      execute()
    }
  }, [loadOnMount, execute])

  return { data, error, isLoading, execute, setData }
}

export default useApi
