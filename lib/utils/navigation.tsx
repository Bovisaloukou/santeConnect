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
      href: `/dashboard/${defaultRole}`,
      icon: <Home className="h-5 w-5" />,
      label: "Tableau de bord",
    },
    {
      href: `/dashboard/${defaultRole}/profile`,
      icon: <User className="h-5 w-5" />,
      label: "Profil",
    },
  ]

  const settingsLink = {
    href: `/dashboard/${defaultRole}/settings`,
    icon: <Settings className="h-5 w-5" />,
    label: "Paramètres",
  }

  const roleSpecificLinks: Record<UserRole, NavigationItem[]> = {
    patient: [
      {
        href: "/dashboard/patient/appointments",
        icon: <Calendar className="h-5 w-5" />,
        label: "Rendez-vous",
      },
      {
        href: "/dashboard/patient/documents",
        icon: <FileText className="h-5 w-5" />,
        label: "Documents",
      },
      {
        href: "/dashboard/patient/messages",
        icon: <MessageSquare className="h-5 w-5" />,
        label: "Messages",
      },
      {
        href: "/dashboard/patient/pharmacies",
        icon: <ShoppingBag className="h-5 w-5" />,
        label: "Pharmacies",
      },
      {
        href: "/dashboard/patient/complaints",
        icon: <FileQuestion className="h-5 w-5" />,
        label: "Réclamations",
      },
    ],
    healthcare: [
      {
        href: "/dashboard/healthcare/patients",
        icon: <Users className="h-5 w-5" />,
        label: "Patients",
      },
      {
        href: "/dashboard/healthcare/appointments",
        icon: <Calendar className="h-5 w-5" />,
        label: "Rendez-vous",
      },
      {
        href: "/dashboard/healthcare/prescriptions",
        icon: <FileText className="h-5 w-5" />,
        label: "Ordonnances",
      },
      {
        href: "/dashboard/healthcare/messages",
        icon: <MessageSquare className="h-5 w-5" />,
        label: "Messages",
      },
    ],
    pharmacy: [
      {
        href: "/dashboard/pharmacy/products",
        icon: <ShoppingBag className="h-5 w-5" />,
        label: "Produits",
      },
      {
        href: "/dashboard/pharmacy/orders",
        icon: <FileText className="h-5 w-5" />,
        label: "Commandes",
      },
      {
        href: "/dashboard/pharmacy/messages",
        icon: <MessageSquare className="h-5 w-5" />,
        label: "Messages",
      },
    ],
    admin: [
      {
        href: "/dashboard/admin/users",
        icon: <Users className="h-5 w-5" />,
        label: "Utilisateurs",
      },
      {
        href: "/dashboard/admin/healthcare",
        icon: <Pill className="h-5 w-5" />,
        label: "Professionnels",
      },
      {
        href: "/dashboard/admin/pharmacies",
        icon: <ShoppingBag className="h-5 w-5" />,
        label: "Pharmacies",
      },
      {
        href: "/dashboard/admin/reports",
        icon: <FileText className="h-5 w-5" />,
        label: "Rapports",
      },
    ],
  }

  return [...topLinks, ...(roleSpecificLinks[defaultRole] || roleSpecificLinks.patient), settingsLink]
}
