"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast";
import { Eye, EyeOff } from "lucide-react"
import { GoogleSignInButton } from "@/components/auth/GoogleSignInButton"
import { TwoFactorAuthNotification } from "@/components/auth/TwoFactorAuthNotification"
import LoadingSpinner from "@/components/ui/loading-spinner";
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { signIn } from "next-auth/react"
import { useSession } from "next-auth/react"

export default function LoginPage() {
  const router = useRouter()
  const { toast } = useToast();
  const { data: session } = useSession();
  const [formSubmitLoading, setFormSubmitLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [show2FANotification, setShow2FANotification] = useState(false);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState<{ email?: string; password?: string; general?: string }>({})
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
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
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

    // Utiliser signIn de NextAuth.js
    const result = await signIn("credentials", {
      redirect: false,
      email: formData.email,
      password: formData.password,
    });

    if (result?.error) {
      // Gérer les erreurs de connexion de NextAuth
      console.error("NextAuth signIn error:", result.error);
      
      // Analyser le type d'erreur
      let errorMessage = "Une erreur est survenue lors de la connexion.";
      
      if (result.error.includes("Missing credentials")) {
        errorMessage = "Veuillez remplir tous les champs.";
      } else if (result.error.includes("Réponse du serveur invalide")) {
        errorMessage = "Erreur de réponse du serveur. Veuillez réessayer.";
      } else if (result.error.includes("Identifiants invalides")) {
        errorMessage = "Email ou mot de passe incorrect.";
      } else if (result.error.includes("Erreur lors de la connexion")) {
        errorMessage = "Impossible de se connecter au serveur. Veuillez réessayer plus tard.";
      }

      setErrors(prev => ({ ...prev, general: errorMessage }));
    } else if (result?.ok) {
      // Attendre que la session soit mise à jour
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const updatedSession = await fetch('/api/auth/session').then(res => res.json());
      
      if (!updatedSession?.user?.is2FAEnabled) {
        setShow2FANotification(true);
      } else {
        router.push('/verify-2fa');
      }
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
            googleLoading={googleLoading}
            onChange={handleChange}
            onSubmit={handleSubmit}
          />
        </div>
      </main>
      <Footer />
      <TwoFactorAuthNotification 
        isOpen={show2FANotification}
        onOpenChange={setShow2FANotification}
      />
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
    general?: string
  }
  isLoading: boolean
  googleLoading: boolean
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void
}

function LoginForm({ title, description, formData, errors, isLoading, googleLoading, onChange, onSubmit }: LoginFormProps) {
  const [showPasswordLocal, setShowPasswordLocal] = useState(false)

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center py-2">{title}</CardTitle>
        <CardDescription className="text-center">{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <GoogleSignInButton 
          text="Se connecter avec Google" 
          isLoading={googleLoading}
          callbackUrl="/"
        />
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Ou</span>
          </div>
        </div>
      </CardContent>
      <form onSubmit={onSubmit}>
        <CardContent className="space-y-4">
          {errors.general && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-md">
              <p className="text-sm text-red-600">{errors.general}</p>
            </div>
          )}
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
