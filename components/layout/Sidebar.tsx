"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, Pill } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth/AuthContext"
import { getNavigationItems } from "@/lib/utils/navigation"

interface SidebarProps {
  forMobile?: boolean
  onClose?: () => void
}

export function Sidebar({ forMobile = false, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  if (!user) return null

  const navLinks = getNavigationItems(user.role)

  return (
    <aside className="flex flex-col h-full bg-white border-r">
      <div className="p-4 border-b">
        <Link href="/" className="flex items-center space-x-2" onClick={forMobile ? onClose : undefined}>
          <Pill className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-primary">SantéConnect</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1 overflow-auto">
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
              pathname === link.href ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-100"
            }`}
            onClick={forMobile ? onClose : undefined}
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
            if (forMobile && onClose) onClose()
          }}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Déconnexion
        </Button>
      </div>
    </aside>
  )
}
