"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/lib/auth/AuthContext"
import {
  Calendar,
  FileText,
  Home,
  LogOut,
  Menu,
  MessageSquare,
  Pill,
  Settings,
  User,
  Users,
  ShoppingBag,
  FileQuestion,
} from "lucide-react"

export default function MobileNav() {
  const [open, setOpen] = useState(false)
  const pathname = usePathname()
  const { user, logout } = useAuth()

  if (!user) return null

  const navLinks = [
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
    {
      href: "/dashboard/patient/settings",
      icon: <Settings className="h-5 w-5" />,
      label: "Paramètres",
    },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0">
        <div className="flex flex-col h-full">
          <div className="p-4 border-b">
            <Link href="/" className="flex items-center space-x-2" onClick={() => setOpen(false)}>
              <Pill className="h-6 w-6 text-emerald-600" />
              <span className="text-xl font-bold text-emerald-600">SantéConnect</span>
            </Link>
          </div>
          <nav className="flex-1 p-4 space-y-1 overflow-auto">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
                  pathname === link.href ? "bg-emerald-50 text-emerald-600" : "text-gray-700 hover:bg-gray-100"
                }`}
                onClick={() => setOpen(false)}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={() => {
                logout()
                setOpen(false)
              }}
            >
              <LogOut className="h-5 w-5 mr-2" />
              Déconnexion
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}
