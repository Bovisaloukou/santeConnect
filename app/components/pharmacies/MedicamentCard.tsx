import { MedicamentComponent } from "@/lib/api/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface MedicamentCardProps {
  medicament: MedicamentComponent
}

export function MedicamentCard({ medicament }: MedicamentCardProps) {
  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <div className="flex justify-between items-start">
          <CardTitle className="text-lg">{medicament.nom}</CardTitle>
          <Badge variant={medicament.necessiteOrdonnance ? "destructive" : "default"}>
            {medicament.necessiteOrdonnance ? "Ordonnance requise" : "Sans ordonnance"}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground mb-4">{medicament.description}</p>
        <div className="flex justify-between items-center">
          <span className="text-lg font-bold">{medicament.prix.toFixed(0)} FCFA</span>
          <span className={`text-sm ${medicament.stock > 0 ? "text-green-600" : "text-red-600"}`}>
            {medicament.stock > 0 ? "Disponible" : "Indisponible"}
          </span>
        </div>
      </CardContent>
    </Card>
  )
} 