import type { Metadata } from "next"
import { PharmacieSearch } from "@/app/components/pharmacies/PharmacieSearch"
import { MedicamentCard } from "@/app/components/pharmacies/MedicamentCard"
import { PharmacieCard } from "@/app/components/pharmacies/PharmacieCard"
import { medicaments, pharmacies } from "@/app/data/pharmacies"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export const metadata: Metadata = {
  title: "Pharmacies - SantéConnect",
  description: "Trouvez facilement une pharmacie partenaire de SantéConnect près de chez vous.",
}

export default function PharmaciesPage() {
  return (
    <div className="flex flex-col min-h-screen bg-neutral-light-gray">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-blue mb-4 text-center">
            Pharmacies à Proximité
          </h1>
          <p className="text-lg text-neutral-dark-gray max-w-3xl text-center mb-8 md:mb-12 mx-auto">
            Accédez à la liste des pharmacies partenaires, consultez leurs horaires et disponibilités, et trouvez la pharmacie la plus proche de chez vous.
          </p>

          <PharmacieSearch />

          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-neutral-dark-gray">Pharmacies partenaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pharmacies.map((pharmacie) => (
                <PharmacieCard key={pharmacie.id} pharmacie={pharmacie} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-neutral-dark-gray">Tous les médicaments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicaments.map((medicament) => (
                <MedicamentCard key={medicament.id} medicament={medicament} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
