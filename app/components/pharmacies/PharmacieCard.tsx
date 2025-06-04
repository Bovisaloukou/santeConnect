import { PharmacieComponent } from "@/lib/api/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Phone, Clock, ShoppingCart } from "lucide-react"
import Link from "next/link"

interface PharmacieCardProps {
  pharmacie: PharmacieComponent
}

export function PharmacieCard({ pharmacie }: PharmacieCardProps) {
  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-xl mb-2">{pharmacie.nom}</CardTitle>
            <div className="flex flex-wrap gap-2 mb-2">
              {pharmacie.services.map((service, index) => (
                <Badge key={index} variant="secondary">
                  {service}
                </Badge>
              ))}
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-muted-foreground mt-1" />
            <div>
              <p className="font-medium">{pharmacie.adresse}</p>
              <p className="text-sm text-muted-foreground">
                {pharmacie.codePostal} {pharmacie.ville}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4 text-muted-foreground" />
            <p>{pharmacie.telephone}</p>
          </div>
          <div className="flex items-start gap-2">
            <Clock className="w-4 h-4 text-muted-foreground mt-1" />
            <div>
              <p className="font-medium">Horaires d'ouverture :</p>
              <div className="text-sm text-muted-foreground">
                <p>Lundi - Vendredi : {pharmacie.horaires.lundi}</p>
                <p>Samedi : {pharmacie.horaires.samedi}</p>
                <p>Dimanche : {pharmacie.horaires.dimanche}</p>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          <Link href={`/pharmacies/${pharmacie.id}`}>
            <Button>
              <ShoppingCart className="w-4 h-4 mr-2" />
              Voir les médicaments
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  )
}