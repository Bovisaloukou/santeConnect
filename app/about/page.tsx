import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "À propos - SantéConnect",
  description: "En savoir plus sur la mission et l'équipe de SantéConnect.",
}

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6">À propos</h1>
      <p className="text-lg text-muted-foreground max-w-2xl text-center mb-8">
        SantéConnect est une plateforme innovante dédiée à la simplification de l'accès aux soins de santé. Notre mission : connecter patients, professionnels et pharmacies pour un parcours de santé plus fluide.
      </p>
      {/* Ajoutez ici des informations sur l'équipe, la mission, etc. */}
    </main>
  )
}
