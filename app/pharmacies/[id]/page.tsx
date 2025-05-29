import { medicaments, pharmacies } from "@/app/data/pharmacies"
import { notFound } from "next/navigation"
import { MedicamentCard } from "@/app/components/pharmacies/MedicamentCard"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface PharmaciePageProps {
  params: {
    id: string
  }
}

export default function PharmaciePage({ params }: PharmaciePageProps) {
  const pharmacie = pharmacies.find((p) => p.id === params.id)
  
  if (!pharmacie) {
    notFound()
  }

  // Filtrer les médicaments disponibles dans cette pharmacie
  const medicamentsDisponibles = medicaments.filter((medicament) => 
    medicament.pharmacies.includes(pharmacie.id)
  )

  return (
    <>
      <Header />
      <main className="min-h-screen bg-white p-8">
        <div className="max-w-7xl mx-auto">
          <Link href="/pharmacies" className="inline-flex items-center text-muted-foreground hover:text-foreground mb-6">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Retour aux pharmacies
          </Link>

          <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
            <div className="flex justify-between items-start mb-6">
              <div>
                <h1 className="text-3xl font-bold mb-2">{pharmacie.nom}</h1>
                <div className="flex flex-wrap gap-2 mb-4">
                  {pharmacie.services.map((service, index) => (
                    <Badge key={index} variant="secondary">
                      {service}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <MapPin className="w-5 h-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium text-lg">{pharmacie.adresse}</p>
                    <p className="text-muted-foreground">
                      {pharmacie.codePostal} {pharmacie.ville}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Phone className="w-5 h-5 text-muted-foreground" />
                  <p className="text-lg">{pharmacie.telephone}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-start gap-2">
                  <Clock className="w-5 h-5 text-muted-foreground mt-1" />
                  <div>
                    <p className="font-medium text-lg mb-2">Horaires d'ouverture</p>
                    <div className="space-y-1">
                      <p>Lundi - Vendredi : {pharmacie.horaires.lundi}</p>
                      <p>Samedi : {pharmacie.horaires.samedi}</p>
                      <p>Dimanche : {pharmacie.horaires.dimanche}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6">
              Médicaments disponibles ({medicamentsDisponibles.length})
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicamentsDisponibles.map((medicament) => (
                <MedicamentCard key={medicament.id} medicament={medicament} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
} 