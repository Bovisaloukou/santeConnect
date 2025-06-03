"use client";

import { useState, useRef, KeyboardEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { useSession } from "next-auth/react";

export default function Verify2FAClient() {
  const router = useRouter();
  const { data: session, update: updateSession } = useSession();
  const [codes, setCodes] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Vérifier si l'utilisateur a besoin de la 2FA
  useEffect(() => {
    if (session?.user) {
      if (!session.user.is2FAEnabled) {
        // Si la 2FA n'est pas activée, rediriger vers le dashboard
        router.push("/dashboard/patient");
      } else if (session.user.is2FAVerified) {
        // Si la 2FA est déjà vérifiée, rediriger vers le dashboard
        router.push("/dashboard/patient");
      }
    }
  }, [session, router]);

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    const newCodes = [...codes];
    for (let i = 0; i < pastedData.length; i++) {
      if (i < 6) {
        newCodes[i] = pastedData[i];
      }
    }
    setCodes(newCodes);
  };

  const handleInputChange = (index: number, value: string) => {
    // Mise à jour normale
    const newCodes = [...codes];
    newCodes[index] = value;
    setCodes(newCodes);

    // Passer à l'input suivant si un chiffre est entré
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !codes[index] && index > 0) {
      // Revenir à l'input précédent si on appuie sur backspace sur un input vide
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);

    const code = codes.join("");
    if (code.length !== 6) {
      setError("Veuillez entrer le code complet de 6 chiffres.");
      return;
    }

    if (!session?.user?.id) {
      setError("Session utilisateur invalide.");
      return;
    }

    setIsLoading(true);

    try {
      // Appeler le nouvel endpoint API
      const response = await fetch("/api/auth/verify-2fa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ code }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Erreur lors de la vérification du code");
      }

      // Mettre à jour la session avec les données renvoyées par l'API
      await updateSession(data.session);
      router.push("/dashboard/patient");
    } catch (error: any) {
      setError(error.message || "Code invalide. Veuillez réessayer.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-center py-2">Vérification requise</CardTitle>
            <CardDescription className="text-center">Un code de vérification a été envoyé à votre adresse email. Veuillez le saisir ci-dessous.</CardDescription>
          </CardHeader>
          <form onSubmit={handleSubmit}>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="2fa-code">Code de vérification</Label>
                <div className="flex gap-2 justify-center">
                  {codes.map((code, index) => (
                    <Input
                      key={index}
                      ref={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="text"
                      inputMode="numeric"
                      pattern="[0-9]*"
                      maxLength={1}
                      value={code}
                      onChange={(e) => handleInputChange(index, e.target.value)}
                      onKeyDown={(e) => handleKeyDown(index, e)}
                      onPaste={handlePaste}
                      disabled={isLoading}
                      className={`w-12 h-12 text-center text-xl ${
                        error ? "border-red-500" : ""
                      }`}
                    />
                  ))}
                </div>
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
      </main>
    </div>
  );
} 