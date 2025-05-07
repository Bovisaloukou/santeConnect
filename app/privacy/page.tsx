import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Politique de confidentialité - SantéConnect",
  description: "Consultez la politique de confidentialité de SantéConnect.",
}

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6">Politique de confidentialité</h1>
      <p className="text-lg text-muted-foreground max-w-2xl text-center mb-8">
        Retrouvez ici la politique de confidentialité de SantéConnect concernant la gestion de vos données personnelles.
      </p>
      {/* Ajoutez ici le texte de la politique de confidentialité */}
    </main>
  )
}
