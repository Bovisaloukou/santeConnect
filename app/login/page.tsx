"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useAuth } from "@/lib/auth/AuthContext"
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react"
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"
import LoadingSpinner from "@/components/ui/loading-spinner";
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

export default function LoginPage() {
  const router = useRouter()
  const { login } = useAuth()
  const { toast } = useToast();
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const [activeTab, setActiveTab] = useState<string>("patient")
  const [showPassword, setShowPassword] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Effacer l'erreur lorsque l'utilisateur commence à taper
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({ ...prev, [name]: undefined }))
    }
  }

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {}
    let isValid = true

    if (!formData.email) {
      newErrors.email = "L'email est requis"
      isValid = false
    } else if (!/\S+@\S+\.\S+/.test(formData.email) && formData.email !== "demo") {
      newErrors.email = "L'email n'est pas valide"
      isValid = false
    }

    if (!formData.password) {
      newErrors.password = "Le mot de passe est requis"
      isValid = false
    }

    setErrors(newErrors)
    return isValid
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }
    setFormSubmitLoading(true);

    // Préremplir l'email en fonction de l'onglet actif
    let email = formData.email
    if (email === "demo") {
      if (activeTab === "patient") {
        email = "patient@example.com"
      } else if (activeTab === "healthcare") {
        // email = "doctor@example.com"
      } else if (activeTab === "pharmacy") {
        email = "pharmacy@example.com"
      }
    }

    const success = await login(email, formData.password)

    if (success) {
      // Rediriger vers le tableau de bord approprié
      if (email === "patient@example.com" || (email === "demo" && activeTab === "patient")) {
        router.push("/dashboard/patient")
      } else if (email === "doctor@example.com" || (email === "demo" && activeTab === "healthcare")) {
        // router.push("/dashboard/healthcare")
      } else if (email === "pharmacy@example.com" || (email === "demo" && activeTab === "pharmacy")) {
        router.push("/dashboard/pharmacy")
      } else {
        router.push(`/dashboard/${activeTab}`)
      }
    } else {
      toast({
        title: "Échec de la connexion",
        description: "L\'email ou le mot de passe est incorrect.",
        variant: "destructive",
      });
    }
    setFormSubmitLoading(false);
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 mt-9">
        <div className="w-full max-w-md">
          <LoginForm
            title="Connexion"
            description="Accédez à votre espace pour gérer vos rendez-vous et consultations."
            formData={formData}
            errors={errors}
            isLoading={formSubmitLoading}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
          <div className="mt-4">
            <GoogleSignInButton text="Se connecter avec Google" />
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">Pour la démo, utilisez:</p>
            <p className="text-sm text-gray-500">
              Email: <code className="bg-gray-100 px-1 py-0.5 rounded">patient@example.com</code> ou{" "}
              <code className="bg-gray-100 px-1 py-0.5 rounded">doctor@example.com</code> ou{" "}
              <code className="bg-gray-100 px-1 py-0.5 rounded">pharmacy@example.com</code>
            </p>
            <p className="text-sm text-gray-500">
              Mot de passe: <code className="bg-gray-100 px-1 py-0.5 rounded">password123</code>
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Ou simplement utilisez <code className="bg-gray-100 px-1 py-0.5 rounded">demo</code> comme email et mot de
              passe pour tester rapidement.
            </p>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}

interface LoginFormProps {
  title: string
  description: string
  formData: {
    email: string
    password: string
  }
  errors: {
    email?: string
    password?: string
  }
  isLoading: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

function LoginForm({ title, description, formData, errors, isLoading, onChange, onSubmit }: LoginFormProps) {
  const [showPasswordLocal, setShowPasswordLocal] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center py-2">{title}</CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="text"
              placeholder="exemple@email.com"
              value={formData.email}
              onChange={onChange}
              disabled={isLoading}
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Mot de passe</Label>
              <Link href="/forgot-password" className="text-sm text-emerald-600 hover:underline">
                Mot de passe oublié?
              </Link>
            </div>
            <div className="relative">
              <Input
                id="password"
                name="password"
                type={showPasswordLocal ? "text" : "password"}
                value={formData.password}
                onChange={onChange}
                disabled={isLoading}
                className={errors.password ? "border-red-500" : ""}
              />
              <button
                type="button"
                onClick={() => setShowPasswordLocal(!showPasswordLocal)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                aria-label={showPasswordLocal ? "Masquer le mot de passe" : "Afficher le mot de passe"}
              >
                {showPasswordLocal ? <EyeOff className="h-5 w-5 text-gray-500" /> : <Eye className="h-5 w-5 text-gray-500" />}
              </button>
            </div>
            {errors.password && <p className="text-sm text-red-500">{errors.password}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex flex-col space-y-4">
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <span className="flex items-center">
                <LoadingSpinner size="sm" className="mr-2" />
                Connexion en cours...
              </span>
            ) : (
              "Se connecter"
            )}
          </Button>
          <p className="text-center text-sm text-gray-600">
            Pas encore de compte?{" "}
            <Link href="/register" className="text-emerald-600 hover:underline">
              S'inscrire
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  )
}
