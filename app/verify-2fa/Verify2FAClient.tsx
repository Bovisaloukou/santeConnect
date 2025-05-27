"use client";

import { useState, useRef, KeyboardEvent, ChangeEvent } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { authApi } from "@/lib/apiClient";
import { useSession } from "next-auth/react";

export default function Verify2FAClient() {
  const router = useRouter();
  const { data: session } = useSession();
  const [codes, setCodes] = useState<string[]>(["", "", "", "", "", ""]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

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
      await authApi.verify2FA(session.user.id, code);
      router.push("/dashboard/patient");
    } catch (error: any) {
      setError(error.response?.data?.message || "Code invalide. Veuillez réessayer.");
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