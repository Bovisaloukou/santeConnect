"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth/AuthContext"
import {
  Calendar,
  FileText,
  Home,
  LogOut,
  MessageSquare,
  Pill,
  Settings,
  User,
  Users,
  ShoppingBag,
  FileQuestion,
  Building2,
  ChevronDown,
} from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"
import { getNavigationItems } from "@/lib/utils/navigation"

export default function Sidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({})

  if (!user) return null

  const toggleSubMenu = (label: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }))
  }

  const navLinks = getNavigationItems()

  return (
    <aside className="hidden md:flex flex-col w-64 bg-white border-r">
      <div className="p-4 border-b">
        <Link href="/" className="flex items-center space-x-2">
          <Pill className="h-6 w-6 text-emerald-600" />
          <span className="text-xl font-bold text-emerald-600">SantéConnect</span>
        </Link>
      </div>
      <nav className="flex-1 p-4 space-y-1">
        {navLinks.map((link) => (
          <div key={link.href}>
            <div
              className={cn(
                "flex items-center justify-between px-3 py-2 rounded-md cursor-pointer",
                pathname === link.href ? "bg-emerald-50 text-emerald-600" : "text-gray-700 hover:bg-gray-100"
              )}
              onClick={() => link.subItems && toggleSubMenu(link.label)}
            >
              <Link
                href={link.href}
                className="flex items-center space-x-2 flex-1"
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
                      pathname === subItem.href
                        ? "bg-emerald-50 text-emerald-600"
                        : "text-gray-600 hover:bg-gray-100"
                    )}
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
          onClick={() => logout()}
        >
          <LogOut className="h-5 w-5 mr-2" />
          Déconnexion
        </Button>
      </div>
    </aside>
  )
}
