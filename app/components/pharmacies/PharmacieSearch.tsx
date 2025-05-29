import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search } from "lucide-react"

export function PharmacieSearch() {
  return (
    <div className="w-full max-w-2xl mx-auto mb-8">
      <div className="flex gap-2">
        <Input
          type="search"
          placeholder="Rechercher un médicament..."
          className="flex-1"
        />
        <Button>
          <Search className="w-4 h-4 mr-2" />
          Rechercher
        </Button>
      </div>
      <div className="flex gap-4 mt-4">
        <Button variant="outline" size="sm">
          Sans ordonnance
        </Button>
        <Button variant="outline" size="sm">
          Avec ordonnance
        </Button>
        <Button variant="outline" size="sm">
          Livraison disponible
        </Button>
      </div>
    </div>
  )
} 