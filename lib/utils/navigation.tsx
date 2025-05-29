import {
  Calendar,
  FileText,
  Home,
  MessageSquare,
  Pill,
  Settings,
  User,
  Users,
  ShoppingBag,
  FileQuestion,
} from "lucide-react"
import type { ReactNode } from "react"
import type { UserRole } from "../types"

interface NavigationItem {
  href: string
  icon: ReactNode
  label: string
}

export function getNavigationItems(role: UserRole): NavigationItem[] {
  const defaultRole = role || 'patient'
  
  const topLinks = [
    {
      href: `/dashboard/${defaultRole}?role=${defaultRole}`,
      icon: <Home className="h-5 w-5" />,
      label: "Tableau de bord",
    },
    {
      href: `/dashboard/${defaultRole}/profile?role=${defaultRole}`,
      icon: <User className="h-5 w-5" />,
      label: "Profil",
    },
  ]

  const settingsLink = {
    href: `/dashboard/${defaultRole}/settings?role=${defaultRole}`,
    icon: <Settings className="h-5 w-5" />,
    label: "Paramètres",
  }

  const roleSpecificLinks: Partial<Record<UserRole, NavigationItem[]>> = {
    patient: [
      {
        href: `/dashboard/patient/appointments?role=${defaultRole}`,
        icon: <Calendar className="h-5 w-5" />,
        label: "Rendez-vous",
      },
      {
        href: `/dashboard/patient/documents?role=${defaultRole}`,
        icon: <FileText className="h-5 w-5" />,
        label: "Documents",
      },
      {
        href: `/dashboard/patient/messages?role=${defaultRole}`,
        icon: <MessageSquare className="h-5 w-5" />,
        label: "Messages",
      },
      {
        href: `/dashboard/patient/pharmacies?role=${defaultRole}`,
        icon: <ShoppingBag className="h-5 w-5" />,
        label: "Pharmacies",
      },
      {
        href: `/dashboard/patient/complaints?role=${defaultRole}`,
        icon: <FileQuestion className="h-5 w-5" />,
        label: "Réclamations",
      },
    ],
    healthcare: [
      {
        href: `/dashboard/healthcare/patients?role=${defaultRole}`,
        icon: <Users className="h-5 w-5" />,
        label: "Patients",
      },
      {
        href: `/dashboard/healthcare/appointments?role=${defaultRole}`,
        icon: <Calendar className="h-5 w-5" />,
        label: "Rendez-vous",
      },
      {
        href: `/dashboard/healthcare/prescriptions?role=${defaultRole}`,
        icon: <FileText className="h-5 w-5" />,
        label: "Ordonnances",
      },
      {
        href: `/dashboard/healthcare/messages?role=${defaultRole}`,
        icon: <MessageSquare className="h-5 w-5" />,
        label: "Messages",
      },
    ],
    pharmacy: [
      {
        href: `/dashboard/pharmacy/products?role=${defaultRole}`,
        icon: <ShoppingBag className="h-5 w-5" />,
        label: "Produits",
      },
      {
        href: `/dashboard/pharmacy/orders?role=${defaultRole}`,
        icon: <FileText className="h-5 w-5" />,
        label: "Commandes",
      },
      {
        href: `/dashboard/pharmacy/messages?role=${defaultRole}`,
        icon: <MessageSquare className="h-5 w-5" />,
        label: "Messages",
      },
    ],
  }

  return [...topLinks, ...(roleSpecificLinks[defaultRole] ?? roleSpecificLinks.patient ?? []), settingsLink]
}
