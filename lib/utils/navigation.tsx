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
  Building2,
  ChevronDown,
  List,
  Plus,
  Briefcase,
} from "lucide-react"
import type { ReactNode } from "react"

interface NavigationItem {
  href: string
  icon: ReactNode
  label: string
  subItems?: NavigationItem[]
  requiredRole?: string
}

const baseNavigationItems: NavigationItem[] = [
  {
    href: "/dashboard/patient",
    icon: <Home className="h-5 w-5" />,
    label: "Tableau de bord",
  },
  {
    href: "/dashboard/patient/profile",
    icon: <User className="h-5 w-5" />,
    label: "Profil",
  },
  {
    href: "/dashboard/patient/professional",
    icon: <Briefcase className="h-5 w-5" />,
    label: "Dossier Professionnel",
    requiredRole: "HEALTHCARE_PROFESSIONNAL"
  },
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
    href: "/dashboard/patient/pharmacy/products",
    icon: <ShoppingBag className="h-5 w-5" />,
    label: "Pharmacies",
    requiredRole: "PHARMACY_OWNER",
    subItems: [
      {
        href: "/dashboard/patient/pharmacy",
        icon: <Home className="h-4 w-4" />,
        label: "Vue d'ensemble"
      },
      {
        href: "/dashboard/patient/pharmacy/products",
        icon: <List className="h-4 w-4" />,
        label: "Liste des médicaments"
      },
      {
        href: "/dashboard/patient/pharmacy/products/add",
        icon: <Plus className="h-4 w-4" />,
        label: "Ajouter un médicament"
      }
    ]
  },
  /*{
    href: "/dashboard/patient/complaints",
    icon: <FileQuestion className="h-5 w-5" />,
    label: "Réclamations",
  },*/
  {
    href: "/dashboard/patient/health-center",
    icon: <Building2 className="h-5 w-5" />,
    label: "Centre de Santé",
    requiredRole: "HOSPITAL_OWNER",
    subItems: [
      {
        href: "/dashboard/patient/health-center",
        icon: <Home className="h-4 w-4" />,
        label: "Vue d'ensemble",
      },
      {
        href: "/dashboard/patient/health-center/doctors",
        icon: <User className="h-4 w-4" />,
        label: "Médecins",
      },
      {
        href: "/dashboard/patient/health-center/services",
        icon: <FileText className="h-4 w-4" />,
        label: "Services",
      },
      {
        href: "/dashboard/patient/health-center/patients",
        icon: <Users className="h-4 w-4" />,
        label: "Patients",
      },
    ],
  },
  {
    href: "/dashboard/patient/settings",
    icon: <Settings className="h-5 w-5" />,
    label: "Paramètres",
  },
];

export function getNavigationItems(userRoles: string[] = ['PATIENT']): NavigationItem[] {
  return baseNavigationItems.filter(item => {
    // Si l'élément n'a pas de rôle requis, il est visible pour tous
    if (!item.requiredRole) return true;
    
    // Vérifie si l'utilisateur a le rôle requis
    return userRoles.includes(item.requiredRole);
  });
}
