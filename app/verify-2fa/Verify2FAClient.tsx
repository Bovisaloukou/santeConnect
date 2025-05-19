"use client";

import { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading-spinner";

export default function Verify2FAClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [code, setCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const emailFromParams = searchParams.get('email');
    if (emailFromParams) {
      setUserEmail(emailFromParams);
    } else {
      // Si l'email n'est pas présent, rediriger vers la page de login
      router.push("/login");
    }
  }, [searchParams, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    if (!code) {
      setError("Veuillez entrer le code de vérification.");
      return;
    }

    setIsLoading(true);

    // TODO: Replace with actual 2FA verification logic calling your backend/API
    // For now, simulate success for any code
    const verificationSuccessful = true; // Simulation

    if (verificationSuccessful) {
      // Déterminer la redirection basée sur l'email de l'utilisateur (simulé)
      let redirectPath = "/dashboard/patient"; // Rôle par défaut
      if (userEmail) {
        if (userEmail === "doctor@example.com") {
          redirectPath = "/dashboard/healthcare";
        } else if (userEmail === "pharmacy@example.com") {
          redirectPath = "/dashboard/pharmacy";
        } else if (userEmail === "patient@example.com") {
          redirectPath = "/dashboard/patient";
        } else {
            // Gérer d'autres emails si nécessaire, redirection par défaut si non reconnu
             redirectPath = "/dashboard";
        }
      }

      router.push(redirectPath);

    } else {
      setError("Code invalide. Veuillez réessayer.");
    }

    setIsLoading(false);
  };

  // Afficher un indicateur de chargement ou un message si l'email n'est pas encore chargé
  if (!userEmail) {
      return (
          <div className="min-h-screen flex items-center justify-center">
              <LoadingSpinner />
              <p className="ml-2">Chargement des informations de vérification...</p>
          </div>
      );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-center py-2">Vérification requise</CardTitle>
          <CardDescription className="text-center">Un code de vérification a été envoyé à votre numéro de téléphone associé à {userEmail}. Veuillez le saisir ci-dessous.</CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="2fa-code">Code de vérification</Label>
              <Input
                id="2fa-code"
                name="2fa-code"
                type="text"
                placeholder="Entrez votre code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={isLoading}
                className={error ? "border-red-500" : ""}
              />
              {error && <p className="text-sm text-red-500">{error}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <span className="flex items-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  Vérification en cours...
                </span>
              ) : (
                "Vérifier le code"
              )}
            </Button>
            {/* TODO: Add a link/button to resend the code */}
            {/* <button type="button" className="text-sm text-emerald-600 hover:underline" disabled={isLoading}>Renvoyer le code</button> */}
          </CardFooter>
        </form>
      </Card>
    </div>
  );
} 