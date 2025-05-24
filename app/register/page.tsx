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
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [phone, setPhone] = useState("")
  const [selectedCountryData, setSelectedCountryData] = useState<CountryData | null>(null)
  const [selectedDay, setSelectedDay] = useState<string>("")
  const [selectedMonth, setSelectedMonth] = useState<string>("")
  const [selectedYear, setSelectedYear] = useState<string>("")

  // State variables for errors
  const [firstNameError, setFirstNameError] = useState<string>("")
  const [lastNameError, setLastNameError] = useState<string>("")
  const [emailError, setEmailError] = useState<string>("")
  const [phoneError, setPhoneError] = useState<string>("")
  const [birthdateError, setBirthdateError] = useState<string>("")
  const [genreError, setGenreError] = useState<string>("")
  const [passwordError, setPasswordError] = useState<string>("")
  const [confirmPasswordError, setConfirmPasswordError] = useState<string>("")

  useEffect(() => {
    setSelectedCountryData({ countryCode: 'bj', dialCode: '229' } as CountryData)
  }, [])

  // Validation functions
  const validateFirstName = (value: string): string => {
    if (!value) {
      return "Le prénom est requis."
    }
    setFirstNameError("")
    return ""
  }

  const validateLastName = (value: string): string => {
    if (!value) {
      return "Le nom est requis."
    }
    setLastNameError("")
    return ""
  }

  const validateEmail = (value: string): string => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!value) {
      return "L'email est requis."
    }
    if (!emailRegex.test(value)) {
      return "Veuillez entrer une adresse email valide."
    }
    setEmailError("")
    return ""
  }

  const validatePhone = (value: string, countryData: CountryData | null): string => {
    const digitsOnlyPhone = value.replace(/\D/g, '')

    if (!value) {
      return "Le numéro de téléphone est requis."
    }

    // Validation spécifique pour le Bénin (+229)
    if (countryData && countryData.countryCode === 'bj') {
      const dialCode = countryData.dialCode.replace(/\D/g, '') // Assurez-vous que l'indicatif est en chiffres
      const expectedTotalLength = dialCode.length + 10 // 3 chiffres pour +229 + 10 chiffres locaux

      if (digitsOnlyPhone.length !== expectedTotalLength) {
          return `Le numéro de téléphone doit comporter exactement ${expectedTotalLength} chiffres pour le Bénin (incluant l'indicatif).`
      }

      const nationalNumber = digitsOnlyPhone.substring(dialCode.length); // Partie locale après l'indicatif

      if (!nationalNumber.startsWith("01")) {
        return "Pour le Bénin, le numéro de téléphone doit commencer par '01' après l'indicatif (+229)."
      }
    } else {
        // Vous pourriez ajouter une validation générique pour d'autres pays ici si nécessaire
        // Pour l'instant, nous nous concentrons sur le Bénin
         if (digitsOnlyPhone.length < 10) { // Exemple de validation minimale pour d'autres pays
             return "Veuillez entrer un numéro de téléphone valide."
         }
    }

    setPhoneError("")
    return ""
  }

  const validateBirthdate = (day: string, month: string, year: string): string => {
    if (!day || !month || !year) {
      return "Veuillez sélectionner votre date de naissance complète."
    }

    const dayInt = parseInt(day, 10)
    const monthInt = parseInt(month, 10)
    const yearInt = parseInt(year, 10)

    if (isNaN(dayInt) || isNaN(monthInt) || isNaN(yearInt) || dayInt < 1 || dayInt > 31 || monthInt < 1 || monthInt > 12 || yearInt < 1900 || yearInt > new Date().getFullYear()) {
      return "Veuillez sélectionner une date de naissance valide (jour, mois, année)."
    }

    const birthDate = new Date(Date.UTC(yearInt, monthInt - 1, dayInt))
    if (birthDate.getUTCFullYear() !== yearInt || birthDate.getUTCMonth() !== monthInt - 1 || birthDate.getUTCDate() !== dayInt) {
      return "La date que vous avez sélectionnée n'est pas valide."
    }

    const today = new Date()
    const birthDateComparison = new Date(yearInt, monthInt - 1, dayInt)

    if (birthDateComparison > today) {
      return "La date de naissance ne peut pas être dans le futur."
    }
    setBirthdateError("")
    return ""
  }

  const validateGenre = (value: string | undefined): string => {
    if (!value) {
      return "Veuillez sélectionner votre genre."
    }
    setGenreError("")
    return ""
  }

  const validatePassword = (value: string): string => {
    if (!value) {
      return "Le mot de passe est requis."
    }
    // Add more password complexity rules if needed
    setPasswordError("")
    return ""
  }

  const validateConfirmPassword = (password: string, confirmPassword: string): string => {
    if (!confirmPassword) {
      return "La confirmation du mot de passe est requise."
    }
    if (password !== confirmPassword) {
      return "Les mots de passe ne correspondent pas."
    }
    setConfirmPasswordError("")
    return ""
  }

  const handlePhoneChange = (
    value: string,
    data: CountryData,
    event: React.ChangeEvent<HTMLInputElement>,
    formattedValue: string
  ) => {
    setPhone(value);
    setSelectedCountryData(data);
    setPhoneError("");
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    // Validate all fields before submitting
    const formData = new FormData(e.currentTarget)
    const formValues = Object.fromEntries(formData.entries())

    const isFirstNameValid = !validateFirstName(formValues.firstName as string)
    const isLastNameValid = !validateLastName(formValues.lastName as string)
    const isEmailValid = !validateEmail(formValues.email as string)
    const isPhoneValid = !validatePhone(phone, selectedCountryData)
    const isBirthdateValid = !validateBirthdate(selectedDay, selectedMonth, selectedYear)
    const isGenreValid = !validateGenre(formValues.genre as string | undefined)
    const isPasswordValid = !validatePassword(formValues.password as string)
    const isConfirmPasswordValid = !validateConfirmPassword(formValues.password as string, formValues.confirmPassword as string)

    if (!isFirstNameValid || !isLastNameValid || !isEmailValid || !isPhoneValid || !isBirthdateValid || !isGenreValid || !isPasswordValid || !isConfirmPasswordValid) {
      // If any field is invalid, update the error states to display messages
      setFirstNameError(validateFirstName(formValues.firstName as string))
      setLastNameError(validateLastName(formValues.lastName as string))
      setEmailError(validateEmail(formValues.email as string))
      setPhoneError(validatePhone(phone, selectedCountryData))
      setBirthdateError(validateBirthdate(selectedDay, selectedMonth, selectedYear))
      setGenreError(validateGenre(formValues.genre as string | undefined))
      setPasswordError(validatePassword(formValues.password as string))
      setConfirmPasswordError(validateConfirmPassword(formValues.password as string, formValues.confirmPassword as string))

      // Stop the submission if there are errors
      return
    }

    setIsLoading(true)

    const userData = {
      firstName: formValues.firstName as string,
      lastName: formValues.lastName as string,
      gender: formValues.genre as string,
      email: formValues.email as string,
      password: formValues.password as string,
      // Format the birthDate to ISO 8601 string
      birthDate: new Date(Date.UTC(parseInt(selectedYear, 10), parseInt(selectedMonth, 10) - 1, parseInt(selectedDay, 10))).toISOString(),
      contact: phone,
    }

    try {
      const response = await fetch("https://med-api-exy6.onrender.com/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      })

      const result = await response.json()

      if (response.ok) { // Status codes 200-299
        toast({
          title: "Inscription réussie!",
          description: result.message || "Vous allez être redirigé vers la page de connexion.",
        })
        setTimeout(() => {
          router.push("/login")
        }, 2000)
      } else {
        // Handle API errors (e.g., validation errors, user already exists)
        toast({
          title: "Erreur d'inscription",
          description: result.message || "Une erreur est survenue. Veuillez réessayer.",
          variant: "destructive",
        })
      }
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error)
      toast({
        title: "Erreur réseau",
        description: "Impossible de se connecter au serveur. Veuillez vérifier votre connexion.",
        variant: "destructive",
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
          <Tabs defaultValue="patient" className="w-full">
            <TabsContent value="patient">
              <Card>
                <CardHeader>
                  <CardTitle className="text-center py-4">Inscription</CardTitle>
                  <CardDescription className="text-center">Créez votre compte pour accéder à nos services de santé.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <GoogleSignInButton text="S'inscrire avec Google" />
                  <form onSubmit={handleRegister} id="register-form">
                    <div className="relative">
                      <div className="absolute inset-0 flex items-center">
                        <span className="w-full border-t" />
                      </div>
                      <div className="relative flex justify-center text-xs uppercase">
                        <span className="bg-background px-2 text-muted-foreground">Ou</span>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">Prénom</Label>
                        <Input
                          id="first-name"
                          name="firstName"
                          required
                          onBlur={(e) => setFirstNameError(validateFirstName(e.target.value))}
                          onChange={() => setFirstNameError("")}
                          className={firstNameError ? 'border-red-500' : ''}
                        />
                        {firstNameError && <p className="text-red-500 text-sm">{firstNameError}</p>}
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Nom</Label>
                        <Input
                          id="last-name"
                          name="lastName"
                          required
                          onBlur={(e) => setLastNameError(validateLastName(e.target.value))}
                          onChange={() => setLastNameError("")}
                          className={lastNameError ? 'border-red-500' : ''}
                        />
                        {lastNameError && <p className="text-red-500 text-sm">{lastNameError}</p>}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        required
                        onBlur={(e) => setEmailError(validateEmail(e.target.value))}
                        onChange={() => setEmailError("")}
                        className={emailError ? 'border-red-500' : ''}
                      />
                      {emailError && <p className="text-red-500 text-sm">{emailError}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="phone">Téléphone</Label>
                      <PhoneInput
                        country={'bj'}
                        value={phone}
                        onChange={handlePhoneChange}
                        inputProps={{
                          required: true,
                          id: 'phone',
                          onBlur: (e: React.FocusEvent<HTMLInputElement>) => setPhoneError(validatePhone(e.target.value, selectedCountryData)),
                        }}
                        containerClass={`w-full ${phoneError ? 'border-red-500 rounded-md' : ''}`}
                        inputClass="flex !h-10 !w-full rounded-md border !border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 !rounded-r-md"
                        buttonClass="!rounded-l-md !border-r-0 !border-input !bg-background hover:!bg-accent"
                        dropdownClass="!bg-popover !border-border"
                        searchClass="!bg-popover !text-popover-foreground"
                      />
                      {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="birthdate">Date de naissance</Label>
                      <div className={`flex space-x-4 ${birthdateError ? 'border border-red-500 rounded-md p-2' : ''}`}>
                        <Select onValueChange={(value) => {
                          setBirthdateError("");
                          setSelectedDay(value);
                          setBirthdateError(validateBirthdate(value, selectedMonth, selectedYear));
                        }} value={selectedDay} disabled={isLoading}>
                          <SelectTrigger id="day" className={birthdateError ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Jour" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px] overflow-y-auto">
                            {[...Array(31)].map((_, i) => (
                              <SelectItem key={i + 1} value={String(i + 1)}>
                                {i + 1}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select onValueChange={(value) => {
                          setBirthdateError("");
                          setSelectedMonth(value);
                          setBirthdateError(validateBirthdate(selectedDay, value, selectedYear));
                        }} value={selectedMonth} disabled={isLoading}>
                          <SelectTrigger id="month" className={birthdateError ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Mois" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px] overflow-y-auto">
                            {[...Array(12)].map((_, i) => {
                              const monthNames = ["Janvier", "Février", "Mars", "Avril", "Mai", "Juin", "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"];
                              const monthValue = String(i + 1);
                              const monthName = monthNames[i];
                              return (
                                <SelectItem key={monthValue} value={monthValue}>
                                  {monthName}
                                </SelectItem>
                              );
                            })}
                          </SelectContent>
                        </Select>

                        <Select onValueChange={(value) => {
                          setBirthdateError("");
                          setSelectedYear(value);
                          setBirthdateError(validateBirthdate(selectedDay, selectedMonth, value));
                        }} value={selectedYear} disabled={isLoading}>
                          <SelectTrigger id="year" className={birthdateError ? 'border-red-500' : ''}>
                            <SelectValue placeholder="Année" />
                          </SelectTrigger>
                          <SelectContent className="max-h-[200px] overflow-y-auto">
                            {Array.from({ length: new Date().getFullYear() - 1900 + 1 }, (_, i) => 1900 + i).map((year) => (
                              <SelectItem key={year} value={String(year)}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      {birthdateError && <p className="text-red-500 text-sm">{birthdateError}</p>}
                    </div>
                    <div className="space-y-2">
                      <Label>Genre</Label>
                      <div className={`flex space-x-4 ${genreError ? 'border border-red-500 rounded-md p-2' : ''}`}>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="male" name="genre" value="male" onChange={(e) => setGenreError(validateGenre(e.target.value))} />
                          <Label htmlFor="male">Homme</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="female" name="genre" value="female" onChange={(e) => setGenreError(validateGenre(e.target.value))} />
                          <Label htmlFor="female">Femme</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="other" name="genre" value="other" onChange={(e) => setGenreError(validateGenre(e.target.value))} />
                          <Label htmlFor="other">Autre</Label>
                        </div>
                      </div>
                      {genreError && <p className="text-red-500 text-sm">{genreError}</p>}
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
                          onBlur={(e) => setPasswordError(validatePassword(e.target.value))}
                          onChange={() => setPasswordError("")}
                          className={passwordError ? 'border-red-500' : ''}
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
                      {passwordError && <p className="text-red-500 text-sm">{passwordError}</p>}
                    </div>
                    <div className="space-y-2 mb-4">
                      <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                      <div className="relative">
                        <Input
                          id="confirm-password"
                          name="confirmPassword"
                          type={showConfirmPassword ? "text" : "password"}
                          required
                          disabled={isLoading}
                          onBlur={(e) => setConfirmPasswordError(validateConfirmPassword((document.getElementById('password') as HTMLInputElement).value, e.target.value))}
                          onChange={() => setConfirmPasswordError("")}
                          className={confirmPasswordError ? 'border-red-500' : ''}
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
                      {confirmPasswordError && <p className="text-red-500 text-sm">{confirmPasswordError}</p>}
                    </div>
                    <CardFooter className="flex flex-col space-y-4 px-0 pb-0">
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
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      <Footer />
    </div>
  )
}

