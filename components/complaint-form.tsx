"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"

interface ComplaintFormProps {
  onSubmitSuccess: (complaint: any) => void
}

export function ComplaintForm({ onSubmitSuccess }: ComplaintFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      // Simuler un appel API
      await new Promise((resolve) => setTimeout(resolve, 1500))

      const newComplaint = {
        id: `complaint-${Date.now()}`,
        title: formData.title,
        description: formData.description,
        status: "pending" as const,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      toast({
        title: "Plainte soumise",
        description: "Votre plainte a été soumise avec succès. Nous l'examinerons dans les plus brefs délais.",
      })

      // Réinitialiser le formulaire
      setFormData({ title: "", description: "" })

      // Notifier le parent
      onSubmitSuccess(newComplaint)
    } catch (error) {
      console.error("Erreur lors de la soumission de la plainte:", error)
      toast({
        title: "Erreur",
        description: "Impossible de soumettre votre plainte. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Soumettre une plainte</CardTitle>
        <CardDescription>
          Si vous avez rencontré un problème avec nos services, veuillez nous en informer.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Titre</Label>
            <Input
              id="title"
              name="title"
              placeholder="Résumé du problème"
              value={formData.title}
              onChange={handleChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="Décrivez le problème en détail"
              rows={5}
              value={formData.description}
              onChange={handleChange}
              required
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Soumission en cours..." : "Soumettre la plainte"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}
