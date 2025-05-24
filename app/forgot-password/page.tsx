"use client"
import React, { useState } from 'react';
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { authApi } from "@/lib/apiClient";
import { useRouter } from "next/navigation";

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [errors, setErrors] = useState<{ email?: string; general?: string }>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const validateForm = () => {
    const newErrors: { email?: string } = {};
    let isValid = true;

    if (!email) {
      newErrors.email = "L'email est requis";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "L'email n'est pas valide";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    try {
      await authApi.forgotPassword(email);
      setIsSuccess(true);
      setErrors({
        general: "Si un compte existe avec cet email, vous recevrez un lien de réinitialisation. Vous allez être redirigé vers la page de connexion dans quelques secondes."
      });
      // Rediriger vers la page de connexion après 5 secondes
      setTimeout(() => {
        router.push('/login');
      }, 10000);
    } catch (error: any) {
      setIsSuccess(false);
      if (error.response?.status === 401) {
        setErrors({
          general: "Aucun compte n'a été trouvé avec cet email."
        });
      } else {
        setErrors({
          general: "Une erreur est survenue lors de l'envoi de l'email."
        });
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 flex items-center justify-center p-4 md:p-8 mt-9">
        <div className="w-full max-w-md">
          <Card>
            <CardHeader>
              <CardTitle className="text-center py-2">Mot de passe oublié</CardTitle>
              <CardDescription className="text-center">Entrez votre adresse email pour recevoir un lien de réinitialisation.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {errors.general && (
                  <div className={`p-3 border rounded-md ${
                    isSuccess 
                      ? 'bg-green-50 border-green-200' 
                      : 'bg-red-50 border-red-200'
                  }`}>
                    <p className={`text-sm ${
                      isSuccess 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>{errors.general}</p>
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="text"
                    placeholder="exemple@email.com"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors({}); // Efface l'erreur lors de la saisie
                    }}
                    onBlur={(e) => {
                      const error = validateForm();
                      if (!error) {
                        setErrors({ email: "L'email n'est pas valide" });
                      }
                    }}
                    className={errors.email ? "border-red-500" : ""}
                    disabled={isLoading}
                  />
                  {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" className="w-full" disabled={isLoading}>
                  {isLoading ? (
                    <span className="flex items-center">
                      <LoadingSpinner size="sm" className="mr-2" />
                      Envoi en cours...
                    </span>
                  ) : (
                    "Envoyer le lien de réinitialisation"
                  )}
                </Button>
              </CardFooter>
            </form>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default ForgotPassword; 