import { Medicament, Pharmacie } from "@/app/data/pharmacies"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin } from "lucide-react"

interface MedicamentListProps {
  medicament: Medicament
  pharmacies: Pharmacie[]
}

export function MedicamentList({ medicament, pharmacies }: MedicamentListProps) {
  const pharmaciesWithMedicament = pharmacies.filter(pharma => 
    medicament.pharmacies.includes(pharma.id)
  )

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-2">{medicament.nom}</CardTitle>
            <p className="text-sm text-muted-foreground mb-2">{medicament.description}</p>
            <div className="flex items-center gap-4">
              <span className="text-lg font-bold">{medicament.prix.toFixed(0)} FCFA</span>
              <Badge variant={medicament.necessiteOrdonnance ? "destructive" : "default"}>
                {medicament.necessiteOrdonnance ? "Ordonnance requise" : "Sans ordonnance"}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <h3 className="text-lg font-semibold mb-4">Disponible dans {pharmaciesWithMedicament.length} pharmacies</h3>
        <div className="space-y-4">
          {pharmaciesWithMedicament.map((pharmacie) => (
            <div key={pharmacie.id} className="flex justify-between items-center p-4 border rounded-lg">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-muted-foreground" />
                <div>
                  <p className="font-medium">{pharmacie.nom}</p>
                  <p className="text-sm text-muted-foreground">
                    {pharmacie.adresse}, {pharmacie.codePostal} {pharmacie.ville}
                  </p>
                </div>
              </div>
              <Button>Commander</Button>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
} 