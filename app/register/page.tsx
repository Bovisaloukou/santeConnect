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
import { Tabs, TabsContent } from "@/components/ui/tabs"
import { useToast } from "@/components/ui/use-toast"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

import { CalendarIcon, Eye, EyeOff } from "lucide-react"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { cn } from "@/lib/utils"
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"
import PhoneInput from 'react-phone-input-2'
import type { CountryData } from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'

export default function RegisterPage() {
  const router = useRouter()
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [birthDate, setBirthDate] = useState<Date | undefined>(undefined)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [phone, setPhone] = useState("")
  const [selectedCountryData, setSelectedCountryData] = useState<CountryData | null>(null)

  useEffect(() => {
    setSelectedCountryData({ countryCode: 'bj', dialCode: '229' } as CountryData);
  }, [])

  const handlePhoneChange = (value: string, data: CountryData, event: React.ChangeEvent<HTMLInputElement>, formattedValue: string) => {
    let newPhoneValue = value;
    if (data.countryCode === 'bj') {
      const dialCode = data.dialCode; 
      const nationalNumber = value.startsWith(dialCode) ? value.substring(dialCode.length) : "";

      if (value === dialCode || nationalNumber === "" || nationalNumber === "0") {
        newPhoneValue = dialCode + "01";
      }
    }
    setPhone(newPhoneValue);
    setSelectedCountryData(data);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsLoading(true)

    const formData = new FormData(e.currentTarget)
    const formValues = Object.fromEntries(formData.entries())

    const phoneNumber = phone;

    if (selectedCountryData && selectedCountryData.countryCode === 'bj') {
      const dialCode = selectedCountryData.dialCode;
      const nationalNumber = phoneNumber.startsWith(dialCode) ? phoneNumber.substring(dialCode.length) : phoneNumber;
      if (!nationalNumber.startsWith("01")) {
        toast({
          title: "Numéro de téléphone invalide",
          description: "Pour le Bénin, le numéro de téléphone doit commencer par '01' après l'indicatif (+229).",
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }
    }

    console.log("Form Data:", { ...formValues, phone: phoneNumber }); 
    await new Promise((resolve) => setTimeout(resolve, 2000))

    if (formValues.password !== formValues.confirmPassword) {
      toast({
        title: "Erreur d'inscription",
        description: "Les mots de passe ne correspondent pas.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    toast({
      title: "Inscription réussie!",
      description: "Vous allez être redirigé vers la page de connexion.",
    })

    setTimeout(() => {
      router.push("/login")
    }, 2000)
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 py-8 md:py-12 mt-9">
        <div className="w-full max-w-md">
          <Tabs defaultValue="patient" className="w-full">
            <TabsContent value="patient">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center py-4">Inscription</CardTitle>
                  <CardDescription className="text-center">Créez votre compte pour accéder à nos services de santé.</CardDescription>
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
                      <PhoneInput
                        country={'bj'}
                        value={phone}
                        onChange={handlePhoneChange}
                        inputProps={{
                          required: true,
                          id: 'phone'
                        }}
                        containerClass="w-full"
                        inputClass="flex !h-10 !w-full rounded-md border !border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 !rounded-r-md"
                        buttonClass="!rounded-l-md !border-r-0 !border-input !bg-background hover:!bg-accent"
                        dropdownClass="!bg-popover !border-border"
                        searchClass="!bg-popover !text-popover-foreground"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birthdate">Date de naissance</Label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button
                            variant={"outline"}
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !birthDate && "text-muted-foreground"
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {birthDate ? format(birthDate, "PPP", { locale: fr }) : <span>Sélectionner une date</span>}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={birthDate}
                            onSelect={setBirthDate}
                            initialFocus
                            locale={fr}
                          />
                        </PopoverContent>
                      </Popover>
                    </div>
                    <div className="space-y-2">
                      <Label>Genre</Label>
                      <div className="flex space-x-4">
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="male" name="genre" value="male" />
                          <Label htmlFor="male">Homme</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="female" name="genre" value="female" />
                          <Label htmlFor="female">Femme</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="other" name="genre" value="other" />
                          <Label htmlFor="other">Autre</Label>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="password">Mot de passe</Label>
                      <div className="relative">
                        <Input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          required
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                          aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                        >
                          {showPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                        </button>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          disabled={isLoading}
                        />
                        <button
                          type="button"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                          className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                          aria-label={showConfirmPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                        >
                          {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
                        </button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex flex-col space-y-4">
                    <Button type="submit" className="w-full" disabled={isLoading}>
                      {isLoading ? "Inscription en cours..." : "S'inscrire"}
                    </Button>
                    <GoogleSignInButton text="S'inscrire avec Google" />
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
      <Footer />
    </div>
  )
}
