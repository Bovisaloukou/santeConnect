"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import { Pill } from "lucide-react"

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      // Simuler l'enregistrement
      await new Promise((resolve) => setTimeout(resolve, 1500))

      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.",
      })

      router.push("/login")
    } catch (error) {
      toast({
        title: "Erreur d'inscription",
        description: "Une erreur est survenue lors de l'inscription. Veuillez réessayer.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex flex-col">
      <header className="bg-white border-b py-4">
        <div className="container mx-auto px-4">
          <Link href="/" className="flex items-center space-x-2">
            <Pill className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold text-emerald-600">SantéConnect</span>
          </Link>
        </div>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 py-8">
        <div className="w-full max-w-md">
          <Tabs defaultValue="patient" className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="patient">Patient</TabsTrigger>
              <TabsTrigger value="healthcare">Professionnel de santé</TabsTrigger>
            </TabsList>
            <TabsContent value="patient">
              <Card>
                <CardHeader>
                  <CardTitle>Inscription Patient</CardTitle>
                  <CardDescription>Créez votre compte patient pour accéder à nos services de santé.</CardDescription>
                </CardHeader>
                <form onSubmit={handleRegister}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">Prénom</Label>
                        <Input id="first-name" name="firstName" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Nom</Label>
                        <Input id="last-name" name="lastName" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" name="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <Input id="phone" name="phone" type="tel" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birthdate">Date de naissance</Label>
                      <Input id="birthdate" name="birthdate" type="date" required />
                    </div>
                    <div className="space-y-2">
                      <Label>Genre</Label>
                      <RadioGroup defaultValue="male">
                        <div className="flex space-x-4">
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="male" id="male" />
                            <Label htmlFor="male">Homme</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="female" id="female" />
                            <Label htmlFor="female">Femme</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="other" id="other" />
                            <Label htmlFor="other">Autre</Label>
                          </div>
                        </div>
                      </RadioGroup>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Mot de passe</Label>
                      <Input id="password" name="password" type="password" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                      <Input id="confirm-password" name="confirmPassword" type="password" required />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Inscription en cours..." : "S'inscrire"}
                    </Button>
                    <p className="text-center text-sm text-gray-600">
                      Déjà inscrit?{" "}
                      <Link href="/login" className="text-emerald-600 hover:underline">
                        Se connecter
                      </Link>
                    </p>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
            <TabsContent value="healthcare">
              <Card>
                <CardHeader>
                  <CardTitle>Inscription Professionnel de Santé</CardTitle>
                  <CardDescription>
                    Créez votre compte professionnel pour rejoindre notre réseau de santé.
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleRegister}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="pro-first-name">Prénom</Label>
                        <Input id="pro-first-name" name="firstName" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="pro-last-name">Nom</Label>
                        <Input id="pro-last-name" name="lastName" required />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pro-email">Email</Label>
                      <Input id="pro-email" name="email" type="email" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pro-phone">Téléphone</Label>
                      <Input id="pro-phone" name="phone" type="tel" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="speciality">Spécialité</Label>
                      <Select name="speciality" required>
                        <SelectTrigger>
                          <SelectValue placeholder="Sélectionnez votre spécialité" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">Médecine générale</SelectItem>
                          <SelectItem value="cardiology">Cardiologie</SelectItem>
                          <SelectItem value="dermatology">Dermatologie</SelectItem>
                          <SelectItem value="pediatrics">Pédiatrie</SelectItem>
                          <SelectItem value="gynecology">Gynécologie</SelectItem>
                          <SelectItem value="ophthalmology">Ophtalmologie</SelectItem>
                          <SelectItem value="dentistry">Dentisterie</SelectItem>
                          <SelectItem value="pharmacy">Pharmacie</SelectItem>
                          <SelectItem value="other">Autre</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="license">Numéro de licence</Label>
                      <Input id="license" name="license" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="facility">Établissement</Label>
                      <Input id="facility" name="facility" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pro-password">Mot de passe</Label>
                      <Input id="pro-password" name="password" type="password" required />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="pro-confirm-password">Confirmer le mot de passe</Label>
                      <Input id="pro-confirm-password" name="confirmPassword" type="password" required />
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Inscription en cours..." : "S'inscrire"}
                    </Button>
                    <p className="text-center text-sm text-gray-600">
                      Déjà inscrit?{" "}
                      <Link href="/login" className="text-emerald-600 hover:underline">
                        Se connecter
                      </Link>
                    </p>
                  </CardFooter>
                </form>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <footer className="bg-gray-100 py-4 text-center text-gray-600 text-sm">
        <div className="container mx-auto px-4">
          <p>&copy; {new Date().getFullYear()} SantéConnect. Tous droits réservés.</p>
        </div>
      </footer>
    </div>
  )
}
