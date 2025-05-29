"use client"

import type React from "react"
import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import DashboardNavbar from "@/components/layout/DashboardNavbar"
import { Sidebar } from "@/components/layout/Sidebar"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const { data: session, status } = useSession()

  useEffect(() => {
    console.log("Dashboard Layout - Auth Status:", {
      status,
      hasSession: !!session,
      user: session?.user,
      is2FAEnabled: session?.user?.is2FAEnabled,
      is2FAVerified: session?.user?.is2FAVerified
    });

    if (status === "unauthenticated") {
      console.log("Dashboard Layout - Redirection vers login");
      router.push("/login")
    }
  }, [status, router, session])

  if (status === "loading") {
    console.log("Dashboard Layout - Loading state");
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  if (!session) {
    console.log("Dashboard Layout - No session");
    return null
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar pour desktop */}
      <div className="hidden md:block w-64 fixed h-screen">
        <Sidebar />
      </div>

      {/* Contenu principal */}
      <div className="flex-1 md:ml-64 flex flex-col">
        <DashboardNavbar />
        <main className="flex-1 p-4 md:p-6 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
