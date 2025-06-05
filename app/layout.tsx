import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import "./globals.css"
import { SessionProvider } from "next-auth/react"
import { AuthProvider } from "@/lib/auth/AuthContext"
import { UserProvider } from "@/lib/user-context"
import { Toaster as ReactHotToastToaster } from "react-hot-toast"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "SantéConnect - Plateforme d'Accès aux Soins de Santé",
  description: "Facilitez et accélérez votre prise en charge médicale",
    generator: 'v0.dev',
    icons: {
      icon: [
        { url: '/favicon.png', type: 'image/png' },
        //{ url: '/favicon.ico', sizes: 'any' },
        //{ url: '/logo.svg', type: 'image/svg+xml' },
      ],
    },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <SessionProvider>
      <html lang="fr" suppressHydrationWarning>
        <body className={inter.className} suppressHydrationWarning>
          <ThemeProvider attribute="class" defaultTheme="light">
            <AuthProvider>
              <UserProvider>
                {children}
              </UserProvider>
            </AuthProvider>
            <Toaster />
            <ReactHotToastToaster position="top-right" />
          </ThemeProvider>
        </body>
      </html>
    </SessionProvider>
  )
}
