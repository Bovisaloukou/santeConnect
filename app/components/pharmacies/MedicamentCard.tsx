import { MedicamentComponent } from "@/lib/api/types"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Upload, Info } from "lucide-react"
import Link from "next/link"

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
      <CardFooter className="flex gap-2">
        <Link href={`/medicaments/${medicament.id}`} className="w-full">
          <Button variant="outline" className="w-full">
            <Info className="w-4 h-4 mr-2" />
            Voir les détails
          </Button>
        </Link>
      </CardFooter>
    </Card>
  )
} 