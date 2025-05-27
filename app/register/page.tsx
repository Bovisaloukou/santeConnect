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

import { Eye, EyeOff } from "lucide-react"
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"
import PhoneInput from 'react-phone-input-2'
import type { CountryData } from 'react-phone-input-2'
import 'react-phone-input-2/lib/style.css'
import { authApi } from "@/lib/apiClient"
import {
  validateFirstName,
  validateLastName,
  validateEmail,
  validatePhone,
  validateBirthdate,
  validateGenre,
  validatePassword,
  validateConfirmPassword
} from "../utils/validations/registerValidations"

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
  const [isBirthdateTouched, setIsBirthdateTouched] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error', text: string } | null>(null)

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

  // Fonction de formatage personnalisée pour le numéro de téléphone
  const formatPhoneNumber = (value: string, countryData: CountryData | null) => {
    if (!value) return value;
    
    if (countryData && countryData.countryCode === 'bj') {
      const digitsOnly = value.replace(/\D/g, '');
      const dialCode = countryData.dialCode;
      const nationalNumber = digitsOnly.substring(dialCode.length);
      
      if (nationalNumber.length >= 2) {
        const firstPart = nationalNumber.substring(0, 2);
        const secondPart = nationalNumber.substring(2, 4);
        const thirdPart = nationalNumber.substring(4, 6);
        const fourthPart = nationalNumber.substring(6, 8);
        const fifthPart = nationalNumber.substring(8, 10);
        
        return `${dialCode} ${firstPart} ${secondPart} ${thirdPart} ${fourthPart} ${fifthPart}`.trim();
      }
    }
    
    return value;
  };

  const handlePhoneChange = (
    value: string,
    data: CountryData,
    event: React.ChangeEvent<HTMLInputElement>,
    formattedValue: string
  ) => {
    setPhone(value);
    setSelectedCountryData(data);
    const result = validatePhone({ value, countryData: data });
    setPhoneError(result.errorMessage);
  };

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    const formData = new FormData(e.currentTarget)
    const formValues = Object.fromEntries(formData.entries())

    // Validation de tous les champs
    const firstNameResult = validateFirstName(formValues.firstName as string)
    const lastNameResult = validateLastName(formValues.lastName as string)
    const emailResult = validateEmail(formValues.email as string)
    const phoneResult = validatePhone({ value: phone, countryData: selectedCountryData })
    const birthdateResult = validateBirthdate({ 
      day: selectedDay, 
      month: selectedMonth, 
      year: selectedYear, 
      isTouched: isBirthdateTouched 
    })
    const genreResult = validateGenre(formValues.genre as string | undefined)
    const passwordResult = validatePassword(formValues.password as string)
    const confirmPasswordResult = validateConfirmPassword({ 
      password: formValues.password as string, 
      confirmPassword: formValues.confirmPassword as string 
    })

    // Mise à jour des messages d'erreur
    setFirstNameError(firstNameResult.errorMessage)
    setLastNameError(lastNameResult.errorMessage)
    setEmailError(emailResult.errorMessage)
    setPhoneError(phoneResult.errorMessage)
    setBirthdateError(birthdateResult.errorMessage)
    setGenreError(genreResult.errorMessage)
    setPasswordError(passwordResult.errorMessage)
    setConfirmPasswordError(confirmPasswordResult.errorMessage)

    // Vérification si tous les champs sont valides
    if (!firstNameResult.isValid || 
        !lastNameResult.isValid || 
        !emailResult.isValid || 
        !phoneResult.isValid || 
        !birthdateResult.isValid || 
        !genreResult.isValid || 
        !passwordResult.isValid || 
        !confirmPasswordResult.isValid) {
      return
    }

    setIsLoading(true)

    const userData = {
      firstName: formValues.firstName as string,
      lastName: formValues.lastName as string,
      gender: formValues.genre as string,
      email: formValues.email as string,
      password: formValues.password as string,
      birthDate: new Date(Date.UTC(parseInt(selectedYear, 10), parseInt(selectedMonth, 10) - 1, parseInt(selectedDay, 10))).toISOString(),
      contact: phone,
    }

    try {
      const response = await authApi.signup(userData)
      
      if (response) {
        setMessage({
          type: 'success',
          text: "Votre inscription a été effectuée avec succès ! Un email de confirmation a été envoyé à votre adresse email. Veuillez cliquer sur le lien dans cet email pour activer votre compte. Vous serez redirigé vers la page de connexion dans quelques instants."
        })
        setTimeout(() => {
          router.push("/login")
        }, 20000)
      }
    } catch (error: any) {
      console.error("Erreur lors de l'inscription:", error)
      setMessage({
        type: 'error',
        text: error.response?.data?.message || "Une erreur est survenue lors de l'inscription. Veuillez réessayer."
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
                  {message && (
                    <div className={`p-4 mb-4 rounded-md ${
                      message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                    }`}>
                      {message.text}
                    </div>
                  )}
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
                          onBlur={(e) => {
                            const result = validateFirstName(e.target.value);
                            setFirstNameError(result.errorMessage);
                          }}
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
                          onBlur={(e) => {
                            const result = validateLastName(e.target.value);
                            setLastNameError(result.errorMessage);
                          }}
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
                        onBlur={(e) => {
                          const result = validateEmail(e.target.value);
                          setEmailError(result.errorMessage);
                        }}
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
                          onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                            const result = validatePhone({ value: e.target.value, countryData: selectedCountryData });
                            setPhoneError(result.errorMessage);
                          },
                          value: formatPhoneNumber(phone, selectedCountryData)
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
                          setIsBirthdateTouched(true);
                          setSelectedDay(value);
                          const result = validateBirthdate({ 
                            day: value, 
                            month: selectedMonth, 
                            year: selectedYear, 
                            isTouched: true 
                          });
                          setBirthdateError(result.errorMessage);
                        }} value={selectedDay} disabled={isLoading}>
                          <SelectTrigger id="day" className={birthdateError && isBirthdateTouched ? 'border-red-500' : ''}>
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
                          setIsBirthdateTouched(true);
                          setSelectedMonth(value);
                          const result = validateBirthdate({ 
                            day: selectedDay, 
                            month: value, 
                            year: selectedYear, 
                            isTouched: true 
                          });
                          setBirthdateError(result.errorMessage);
                        }} value={selectedMonth} disabled={isLoading}>
                          <SelectTrigger id="month" className={birthdateError && isBirthdateTouched ? 'border-red-500' : ''}>
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
                          setIsBirthdateTouched(true);
                          setSelectedYear(value);
                          const result = validateBirthdate({ 
                            day: selectedDay, 
                            month: selectedMonth, 
                            year: value, 
                            isTouched: true 
                          });
                          setBirthdateError(result.errorMessage);
                        }} value={selectedYear} disabled={isLoading}>
                          <SelectTrigger id="year" className={birthdateError && isBirthdateTouched ? 'border-red-500' : ''}>
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
                          <input type="radio" id="male" name="genre" value="male" onChange={(e) => {
                            const result = validateGenre(e.target.value);
                            setGenreError(result.errorMessage);
                          }} />
                          <Label htmlFor="male">Homme</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="female" name="genre" value="female" onChange={(e) => {
                            const result = validateGenre(e.target.value);
                            setGenreError(result.errorMessage);
                          }} />
                          <Label htmlFor="female">Femme</Label>
                        </div>
                        <div className="flex items-center space-x-2">
                          <input type="radio" id="other" name="genre" value="other" onChange={(e) => {
                            const result = validateGenre(e.target.value);
                            setGenreError(result.errorMessage);
                          }} />
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
                          onBlur={(e) => {
                            const result = validatePassword(e.target.value);
                            setPasswordError(result.errorMessage);
                          }}
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
                      {/*<p className="text-sm text-gray-500 mt-1">
                        Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial.
                      </p>*/}
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
                          onBlur={(e) => {
                            const result = validateConfirmPassword({
                              password: (document.getElementById('password') as HTMLInputElement).value,
                              confirmPassword: e.target.value
                            });
                            setConfirmPasswordError(result.errorMessage);
                          }}
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

