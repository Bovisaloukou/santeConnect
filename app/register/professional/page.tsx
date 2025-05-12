"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

import { format } from "date-fns"
import { fr } from "date-fns/locale"

export default function ProfessionalRegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [specialty, setSpecialty] = useState("")
  const [healthcareCenter, setHealthcareCenter] = useState("")

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const formValues = Object.fromEntries(formData.entries())

    const professionalData = {
      professionalOrderNumber: formValues.professionalOrderNumber as string,
      specialty: specialty,
      healthcareCenter: healthcareCenter,
    }

    console.log("Professional Registration Data:", professionalData);
    
    // Simuler une soumission (remplacez par votre logique d'API)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    toast({
      title: "Informations professionnelles enregistrées!",
      description: "Vos informations professionnelles ont été enregistrées avec succès.",
    })

    setTimeout(() => {
      router.push("/dashboard/professional") // Rediriger vers le tableau de bord professionnel
    }, 2000)
  }

  // Données de remplacement pour les listes déroulantes
  const specialties = [
    { value: "general-practitioner", label: "Médecin Généraliste" },
    { value: "cardiologist", label: "Cardiologue" },
    { value: "dermatologist", label: "Dermatologue" },
    { value: "pediatrician", label: "Pédiatre" },
    { value: "surgeon", label: "Chirurgien" },
  ];

  const healthcareCenters = [
    { value: "center-a", label: "Centre Hospitalier A" },
    { value: "clinic-b", label: "Clinique B" },
    { value: "hospital-c", label: "Hôpital C" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 py-8 md:py-12 mt-9">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-center py-4">Informations Professionnel de Santé</CardTitle>
              <CardDescription className="text-center">Veuillez compléter vos informations professionnelles.</CardDescription>
            </CardHeader>
            <form onSubmit={handleRegister}>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                    <Label htmlFor="professionalOrderNumber">Numéro d'ordre professionnel</Label>
                    <Input id="professionalOrderNumber" name="professionalOrderNumber" required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="specialty">Spécialité</Label>
                    <Select onValueChange={setSpecialty} value={specialty} required>
                      <SelectTrigger id="specialty">
                        <SelectValue placeholder="Sélectionner une spécialité" />
                      </SelectTrigger>
                      <SelectContent>
                        {specialties.map((s) => (
                          <SelectItem key={s.value} value={s.value}>
                            {s.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="healthcareCenter">Centre de santé</Label>
                    <Select onValueChange={setHealthcareCenter} value={healthcareCenter} required>
                      <SelectTrigger id="healthcareCenter">
                        <SelectValue placeholder="Sélectionner un centre de santé" />
                      </SelectTrigger>
                      <SelectContent>
                        {healthcareCenters.map((c) => (
                          <SelectItem key={c.value} value={c.value}>
                            {c.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Enregistrement..." : "Enregistrer les informations professionnelles"}
                </Button>
                 <p className="text-center text-sm text-gray-600">
                   <Link href="/dashboard/patient" className="text-emerald-600 hover:underline">
                     Retour au tableau de bord patient
                   </Link>
                 </p>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  )
} 