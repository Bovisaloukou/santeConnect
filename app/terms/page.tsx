import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Conditions d'utilisation - SantéConnect",
  description: "Consultez les conditions générales d'utilisation de la plateforme SantéConnect.",
}

export default function TermsPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6">Conditions d'utilisation</h1>
      <p className="text-lg text-muted-foreground max-w-2xl text-center mb-8">
        Retrouvez ici les conditions générales d'utilisation de la plateforme SantéConnect.
      </p>
      {/* Ajoutez ici le texte des conditions */}
    </main>
  )
}
