"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LogOut, Pill, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth/AuthContext"
import { getNavigationItems } from "@/lib/utils/navigation"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"
import { userApi } from "@/lib/api/user"

interface SidebarProps {
  forMobile?: boolean
  onClose?: () => void
}

export function Sidebar({ forMobile = false, onClose }: SidebarProps) {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({})
  const [userRoles, setUserRoles] = useState<string[]>(['PATIENT'])
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchUserRoles = async () => {
      if (!user?.id) {
        setIsLoading(false)
        return
      }

      try {
        setIsLoading(true)
        const profile = await userApi.getProfile(user.id)
        
        if (!profile?.roles || !Array.isArray(profile.roles)) {
          setError('Format de rôles invalide')
          return
        }

        setUserRoles(profile.roles)
        setError(null)
      } catch (error) {
        setError('Erreur lors de la récupération des rôles')
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserRoles()
  }, [user?.id])

  if (!user) {
    return null
  }

  const toggleSubMenu = (label: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }))
  }

  const navLinks = getNavigationItems(userRoles)

  return (
    <aside className="flex flex-col h-full bg-white border-r">
      <div className="p-4 border-b">
        <Link href="/" className="flex items-center space-x-2" onClick={forMobile ? onClose : undefined}>
          <Pill className="h-6 w-6 text-primary" />
          <span className="text-xl font-bold text-primary">SantéConnect</span>
        </Link>
      </div>
      {isLoading && (
        <div className="p-4 text-sm text-gray-500">
          Chargement des rôles...
        </div>
      )}
      {error && (
        <div className="p-4 bg-red-50 text-red-600 text-sm">
          {error}
        </div>
      )}
      <nav className="flex-1 p-4 space-y-1 overflow-auto">
        {navLinks.map((link) => (
          <div key={link.href}>
            <div
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-md cursor-pointer",
                pathname === link.href.split('?')[0] ? "bg-primary/10 text-primary" : "text-gray-700 hover:bg-gray-100"
              )}
              onClick={() => link.subItems && toggleSubMenu(link.label)}
            >
              <Link
                href={link.href}
                className="flex items-center space-x-2 flex-1"
                onClick={forMobile ? onClose : undefined}
              >
                {link.icon}
                <span>{link.label}</span>
              </Link>
              {link.subItems && (
                <ChevronDown
                  className={cn(
                    "h-4 w-4 transition-transform",
                    expandedMenus[link.label] ? "transform rotate-180" : ""
                  )}
                />
              )}
            </div>
            {link.subItems && expandedMenus[link.label] && (
              <div className="ml-6 mt-1 space-y-1">
                {link.subItems.map((subItem) => (
                  <Link
                    key={subItem.href}
                    href={subItem.href}
                    className={cn(
                      "flex items-center space-x-2 px-3 py-2 rounded-md text-sm",
                      pathname === subItem.href.split('?')[0]
                        ? "bg-primary/10 text-primary"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
                    onClick={forMobile ? onClose : undefined}
                  >
                    {subItem.icon}
                    <span>{subItem.label}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
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
