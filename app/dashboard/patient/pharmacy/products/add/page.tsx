"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { medicamentsApi } from "@/lib/api/medicaments"
import { useSession } from "next-auth/react"
import { toast } from "sonner"

export default function AddProductPage() {
  const router = useRouter()
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated() {
      router.push('/auth/login')
    },
  })
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    prix: "",
    surOrdonnance: false
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user?.pharmacyUuid) {
      toast.error("ID de la pharmacie manquant")
      return
    }

    setLoading(true)
    
    try {
      await medicamentsApi.create({
        ...formData,
        prix: parseFloat(formData.prix),
        pharmacieId: session.user.pharmacyUuid
      })
      
      toast.success("Médicament ajouté avec succès")
      router.back()
    } catch (error) {
      toast.error("Erreur lors de l'ajout du médicament")
      console.error(error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target
    setFormData(prev => ({ ...prev, [id]: value }))
  }

  if (status === "loading") {
    return (
      <div className="container mx-auto py-6">
        <div className="flex items-center justify-center h-64">
          <p>Chargement des données...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-6">
      <h1 className="text-2xl font-bold mb-6">Ajouter un médicament</h1>
      
      <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
        <div className="space-y-2">
          <Label htmlFor="name">Nom du médicament</Label>
          <Input 
            id="name" 
            value={formData.name}
            onChange={handleChange}
            required 
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="description">Description</Label>
          <Textarea 
            id="description" 
            value={formData.description}
            onChange={handleChange}
            required 
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="prix">Prix (FCFA)</Label>
            <Input 
              id="prix" 
              type="number" 
              step="0.01" 
              value={formData.prix}
              onChange={handleChange}
              required 
            />
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="surOrdonnance"
              checked={formData.surOrdonnance}
              onCheckedChange={(checked) => 
                setFormData(prev => ({ ...prev, surOrdonnance: checked }))
              }
            />
            <Label htmlFor="surOrdonnance">Sur ordonnance</Label>
          </div>
        </div>

        <div className="flex gap-4">
          <Button type="submit" disabled={loading}>
            {loading ? "Ajout en cours..." : "Ajouter le médicament"}
          </Button>
          <Button 
            type="button" 
            variant="outline" 
            onClick={() => router.back()}
          >
            Annuler
          </Button>
        </div>
      </form>
    </div>
  )
} 