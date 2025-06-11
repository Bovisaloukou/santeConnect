import { pharmacyApi } from "@/lib/api/pharmacy"
import { notFound } from "next/navigation"
import { MedicamentCard } from "@/app/components/pharmacies/MedicamentCard"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { Badge } from "@/components/ui/badge"
import { MapPin, Phone, Clock, ArrowLeft } from "lucide-react"
import Link from "next/link"
import { Pharmacie, Medicament } from "@/lib/api/types"

interface PharmaciePageProps {
  params: {
    id: string
  }
}

export default async function PharmaciePage({ params }: PharmaciePageProps) {
  try {
    const response = await pharmacyApi.getById(params.id)
    const pharmacie = response.data

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
                  <h1 className="text-3xl font-bold mb-2">{pharmacie.name}</h1>
                  <div className="flex flex-wrap gap-2 mb-4">
                    {pharmacie.services.map((service: string, index: number) => (
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
                      <p className="font-medium text-lg">{pharmacie.adress}</p>
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
                        {pharmacie.horaires.map((horaire: string, index: number) => (
                          <p key={index}>{horaire}</p>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold mb-6">
                Médicaments disponibles ({pharmacie.medicaments.length})
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {pharmacie.medicaments.map((medicament: Medicament) => (
                  <MedicamentCard 
                    key={medicament.uuid} 
                    medicament={{
                      id: medicament.uuid,
                      nom: medicament.name,
                      description: medicament.description,
                      prix: medicament.prix,
                      necessiteOrdonnance: medicament.surOrdonnance,
                      stock: 0,
                      image: "",
                      categorie: "",
                      pharmacies: [pharmacie.uuid]
                    }} 
                  />
                ))}
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </>
    )
  } catch (error) {
    notFound()
  }
} 