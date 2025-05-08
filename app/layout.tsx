import type React from "react"
import { Inter } from "next/font/google"
import { ThemeProvider } from "@/components/theme-provider"
import { Toaster } from "@/components/ui/toaster"
import { AuthProvider } from "@/lib/auth/AuthContext"
import "./globals.css"

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
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="light">
          <AuthProvider>
            {children}
            <Toaster />
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
