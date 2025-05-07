import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Pharmacies - SantéConnect",
  description: "Trouvez facilement une pharmacie partenaire de SantéConnect près de chez vous.",
}

export default function PharmaciesPage() {
  return (
    <main className="min-h-screen bg-white flex flex-col items-center justify-center p-8">
      <h1 className="text-4xl font-bold mb-6">Pharmacies</h1>
      <p className="text-lg text-muted-foreground max-w-2xl text-center mb-8">
        Accédez à la liste des pharmacies partenaires, consultez leurs horaires et disponibilités, et trouvez la pharmacie la plus proche de chez vous.
      </p>
      {/* Ajoutez ici la liste ou la carte des pharmacies */}
    </main>
  )
}
