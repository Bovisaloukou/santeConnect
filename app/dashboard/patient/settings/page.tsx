"use client"

import { Switch } from "@/components/ui/switch"
import { useSession } from "next-auth/react"
import { useState } from "react"
import { authApi } from "@/lib/api/auth"

export default function PatientSettingsPage() {
  const { data: session } = useSession()
  const [is2FAEnabled, setIs2FAEnabled] = useState(session?.user?.is2FAEnabled || false)
  const [isLoading, setIsLoading] = useState(false)

  const handle2FAToggle = async (checked: boolean) => {
    if (!session?.user?.id) {
      return
    }

    setIsLoading(true)
    try {
      if (checked) {
        await authApi.enable2FA(session.user.id)
      } else {
        await authApi.disable2FA(session.user.id)
      }
      setIs2FAEnabled(checked)
    } catch (error) {
      // En cas d'erreur, on revient à l'état précédent
      setIs2FAEnabled(!checked)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Paramètres du compte</h1>
      {/* Nouvelle section pour l'authentification à deux facteurs */}
      <div className="flex items-center space-x-2 mt-4">
        <Switch 
          id="two-factor" 
          checked={is2FAEnabled}
          onCheckedChange={handle2FAToggle}
          disabled={isLoading}
        />
        <label htmlFor="two-factor">
          {is2FAEnabled ? "Désactiver" : "Activer"} l'authentification à deux facteurs
        </label>
      </div>
    </div>
  );
} 