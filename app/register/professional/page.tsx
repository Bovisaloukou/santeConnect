"use client"

import type React from "react"

import { useState, useEffect, Suspense } from "react"
import Link from "next/link"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/components/ui/use-toast"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { medecinApi } from "@/lib/api/medecin"
import { useSession } from "next-auth/react"

import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { doctorRoles } from "./doctorRoles"
import { specialties } from "./specialties"

export default function ProfessionalRegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { data: session } = useSession()
  const [isLoading, setIsLoading] = useState(false)
  const [specialty, setSpecialty] = useState("")
  const [doctorRole, setDoctorRole] = useState("")

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const formValues = Object.fromEntries(formData.entries())
    const searchParams = new URLSearchParams(window.location.search)
    const serviceUuid = searchParams.get('serviceUuid')

    if (!serviceUuid) {
      toast({
        title: "Erreur",
        description: "L'identifiant du service est manquant",
        variant: "destructive"
      })
      setIsLoading(false)
      return
    }

    if (!session?.user?.id) {
      toast({
        title: "Erreur",
        description: "Vous devez être connecté pour effectuer cette action",
        variant: "destructive"
      })
      setIsLoading(false)
      return
    }

    const professionalData = {
      numeroOrdre: formValues.professionalOrderNumber as string,
      role: doctorRole,
      specialite: specialty,
      userUuid: session.user.id,
      serviceUuid: serviceUuid
    }

    try {
      await medecinApi.create(professionalData)
      
      toast({
        title: "Informations professionnelles enregistrées!",
        description: "Vos informations professionnelles ont été enregistrées avec succès.",
      })

      setTimeout(() => {
        router.push("/dashboard/patient")
      }, 2000)
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement des informations",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

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
                    <Input 
                      id="professionalOrderNumber" 
                      name="professionalOrderNumber" 
                      placeholder="1234-25"
                      required 
                    />
                    <p className="text-sm text-gray-500">
                      Numéro d'ordre du médecin inscrit à l'ONMB (ex: 1234-25)
                    </p>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="doctorRole">Rôle du médecin</Label>
                    <Select onValueChange={setDoctorRole} value={doctorRole} required>
                      <SelectTrigger id="doctorRole">
                        <SelectValue placeholder="Sélectionner un rôle" />
                      </SelectTrigger>
                      <SelectContent>
                        {doctorRoles.map((role) => (
                          <SelectItem key={role.value} value={role.value}>
                            {role.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
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
              </CardContent>
              <CardFooter className="flex flex-col space-y-4">
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? "Enregistrement..." : "Enregistrer les informations professionnelles"}
                </Button>
                 <p className="text-center text-sm text-gray-600">
                   <Link href="/dashboard/patient" className="text-emerald-600 hover:underline">
                     Retour au tableau de bord
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