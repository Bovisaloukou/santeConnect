"use client"

import { useRouter } from "next/navigation"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface TwoFactorAuthNotificationProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
}

export function TwoFactorAuthNotification({ isOpen, onOpenChange }: TwoFactorAuthNotificationProps) {
  const router = useRouter()

  const handleEnable2FA = () => {
    router.push("/dashboard/patient/settings")
    onOpenChange(false)
  }

  const handleLater = () => {
    router.push("/")
    onOpenChange(false)
  }

  return (
    <AlertDialog open={isOpen} onOpenChange={onOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Activez l'Authentification à Deux Facteurs</AlertDialogTitle>
          <AlertDialogDescription>
            Pour une meilleure sécurité de votre compte et la protection de vos données médicales,
            nous vous recommandons vivement d'activer l'authentification à deux facteurs (2FA).
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={handleLater}>Plus tard</AlertDialogCancel>
          <AlertDialogAction onClick={handleEnable2FA}>
            Activer maintenant
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
} 