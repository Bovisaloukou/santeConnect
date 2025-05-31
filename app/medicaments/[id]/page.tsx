import { medicaments, pharmacies } from "@/app/data/pharmacies"
import { notFound } from "next/navigation"
import { PharmacieCard } from "@/app/components/pharmacies/PharmacieCard"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Upload, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface MedicamentPageProps {
  params: {
    id: string
  }
}

export default function MedicamentPage({ params }: MedicamentPageProps) {
  const medicament = medicaments.find((m) => m.id === params.id)
  
  if (!medicament) {
    notFound()
  }

  // Filtrer les pharmacies qui ont ce médicament en stock
  const pharmaciesDisponibles = pharmacies.filter((pharmacie) => 
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
            <div className="flex justify-between items-start mb-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{medicament.nom}</h1>
                <Badge variant={medicament.necessiteOrdonnance ? "destructive" : "default"} className="mb-4">
                  {medicament.necessiteOrdonnance ? "Ordonnance requise" : "Sans ordonnance"}
                </Badge>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">{medicament.prix.toFixed(0)} FCFA</p>
                <p className="text-sm text-muted-foreground">Stock disponible : {medicament.stock}</p>
              </div>
            </div>

            <p className="text-lg mb-6">{medicament.description}</p>

            <div className="flex gap-4">
              <Link href="/pharmacies">
                <Button variant="outline" size="lg">
                  Retour aux pharmacies
                </Button>
              </Link>
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6">
              Disponible dans {pharmaciesDisponibles.length} pharmacie{pharmaciesDisponibles.length > 1 ? 's' : ''}
            </h2>
            <div className="grid grid-cols-1 gap-4">
              {pharmaciesDisponibles.map((pharmacie) => (
                <PharmacieCard key={pharmacie.id} pharmacie={pharmacie} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
} 