import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Services - SantéConnect",
  description: "Découvrez tous les services proposés par SantéConnect pour faciliter votre santé au quotidien.",
}

export default function ServicesPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6">Nos Services</h1>
      <p className="text-lg text-muted-foreground max-w-2xl text-center mb-8">
        Retrouvez ici tous les services proposés par SantéConnect pour simplifier votre parcours de soins, de la prise de rendez-vous à la gestion de vos ordonnances.
      </p>
      {/* Ajoutez ici la liste ou les cartes de services */}
    </main>
  )
}
