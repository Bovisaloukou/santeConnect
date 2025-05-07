import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Politique de cookies - SantéConnect",
  description: "Consultez la politique de gestion des cookies de SantéConnect.",
}

export default function CookiesPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6">Politique de cookies</h1>
      <p className="text-lg text-muted-foreground max-w-2xl text-center mb-8">
        Retrouvez ici la politique de gestion des cookies utilisée par SantéConnect.
      </p>
      {/* Ajoutez ici le texte de la politique de cookies */}
    </main>
  )
}
