"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { ExtendedSession } from "@/lib/api/types";
import { patientApi } from "@/lib/api/patient";
import { visiteApi } from "@/lib/api/visite";
import { consultationApi } from "@/lib/api/consultation";
import { N8nResponse } from "@/lib/api/types";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
}

// Hook personnalisé pour le défilement automatique
function useChatScroll<T>(dep: T) {
  const ref = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    if (ref.current) {
      const viewport = ref.current.querySelector('[data-radix-scroll-area-viewport]');
      if (viewport) {
        viewport.scrollTo({
          top: viewport.scrollHeight,
          behavior: "smooth"
        });
      }
    }
  }, [dep]);

  return ref;
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId] = useState(() => uuidv4());
  const [isRedirecting, setIsRedirecting] = useState(false);
  const [dossierUuid, setDossierUuid] = useState<string | null>(null);
  const scrollRef = useChatScroll(messages);
  const router = useRouter();
  const { data: session } = useSession();

  useEffect(() => {
    const sendInitialMessage = async () => {
      const initialMessage: Message = {
        id: uuidv4(),
        content: "Cc",
        role: "user",
      };

      setMessages((prev) => [...prev, initialMessage]);
      setIsLoading(true);

      try {
        const response = await fetch(
          `https://n8n-zw6h.onrender.com/webhook/test?id=${userId}`,
          {
            method: "POST",
            headers: {
              "Content-Type": "text/plain",
            },
            body: "Cc",
          }
        );

        if (!response.ok) {
          throw new Error("Erreur lors de l'envoi du message");
        }

        const data = await response.json();
        
        const assistantMessage: Message = {
          id: uuidv4(),
          content: data.message,
          role: "assistant",
        };

        setMessages((prev) => [...prev, assistantMessage]);
      } catch (error) {
        console.error("Erreur:", error);
        const errorMessage: Message = {
          id: uuidv4(),
          content: "Désolé, une erreur s'est produite. Veuillez réessayer.",
          role: "assistant",
        };
        setMessages((prev) => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    };

    sendInitialMessage();
  }, [userId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading || isRedirecting) return;

    const userMessage: Message = {
      id: uuidv4(),
      content: input,
      role: "user",
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `https://n8n-zw6h.onrender.com/webhook/test?id=${userId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "text/plain",
          },
          body: input,
        }
      );

      if (!response.ok) {
        throw new Error("Erreur lors de l'envoi du message");
      }

      const data = await response.json() as N8nResponse;
      
      const assistantMessage: Message = {
        id: uuidv4(),
        content: data.message,
        role: "assistant",
      };
      setMessages((prev) => [...prev, assistantMessage]);

      if (data.data?.stop) {
        setIsRedirecting(true);

        // Appel à l'API pour créer le patient et le dossier via la nouvelle fonction
        if (session?.user?.healthServiceUuid) {
          try {
            const response = await patientApi.create({
              service_uuid: session.user.healthServiceUuid
            });

            if (response?.data?.dossiers?.[0]?.uuid) {
              const dossierUuid = response.data.dossiers[0].uuid;
              setDossierUuid(dossierUuid);
              console.log("UUID du dossier créé:", dossierUuid);

              // Création de la visite
              try {
                const visiteResponse = await visiteApi.create({
                  date_visite: data.data.date_visite,
                  motif: data.data.motif,
                  anamnese: data.data.anamnese,
                  antecedants_medicaux: data.data.antecedants_medicaux,
                  enquete_socioculturelle: data.data.enquete_socioculturelle || "",
                  dossier_uuid: dossierUuid
                });
                console.log("Visite créée avec succès");

                // Création de la consultation
                if (visiteResponse?.data?.uuid) {
                  try {
                    await consultationApi.create({
                      motif: "EXTERNAL",
                      visite_uuid: visiteResponse.data.uuid
                    });
                    console.log("Consultation créée avec succès");
                  } catch (consultationError) {
                    console.error("Erreur lors de la création de la consultation:", consultationError);
                    const errorMessage: Message = {
                      id: uuidv4(),
                      content: "Désolé, une erreur s'est produite lors de la création de la consultation. Veuillez réessayer.",
                      role: "assistant",
                    };
                    setMessages((prev) => [...prev, errorMessage]);
                  }
                }
              } catch (visiteError) {
                console.error("Erreur lors de la création de la visite:", visiteError);
                const errorMessage: Message = {
                  id: uuidv4(),
                  content: "Désolé, une erreur s'est produite lors de la création de la visite. Veuillez réessayer.",
                  role: "assistant",
                };
                setMessages((prev) => [...prev, errorMessage]);
              }
            } else {
               // Gérer le cas où l'UUID du dossier n'est pas retourné
                const errorMessage: Message = {
                  id: uuidv4(),
                  content: "Désolé, une erreur s'est produite lors de la création du dossier. Veuillez réessayer.",
                  role: "assistant",
                };
                setMessages((prev) => [...prev, errorMessage]);
            }

          } catch (patientError) {
            // Gérer les erreurs de l'appel API
             const errorMessage: Message = {
                id: uuidv4(),
                content: "Désolé, une erreur s'est produite lors de l'appel API pour créer le patient. Veuillez réessayer.",
                role: "assistant",
              };
              setMessages((prev) => [...prev, errorMessage]);
          }
        } else {
           console.error("healthServiceUuid not found in session.");
            const errorMessage: Message = {
                id: uuidv4(),
                content: "Désolé, je n'ai pas pu trouver les informations de service nécessaires dans votre session.",
                role: "assistant",
              };
              setMessages((prev) => [...prev, errorMessage]);
        }

        const redirectMessage: Message = {
          id: uuidv4(),
          content: "Vos informations ont été transmises au centre de santé. Un professionnel de santé vous contactera prochainement pour vous orienter vers le service approprié et vous mettre en relation avec un médecin. Vous recevrez une notification dès que cela sera fait.",
          role: "assistant",
        };
        setMessages((prev) => [...prev, redirectMessage]);
        
        setTimeout(() => {
          router.push("/dashboard/patient");
        }, 20000);
      }
    } catch (error) {
      console.error("Erreur:", error);
      const errorMessage: Message = {
        id: uuidv4(),
        content: "Désolé, une erreur s'est produite. Veuillez réessayer.",
        role: "assistant",
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4" ref={scrollRef}>
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${
                message.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-[80%] ${
                  message.role === "user"
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted"
                }`}
              >
                <ReactMarkdown>{message.content}</ReactMarkdown>
              </div>
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted rounded-lg px-4 py-2">
                GuideSantéBot est en train d'écrire...
              </div>
            </div>
          )}
        </div>
      </ScrollArea>
      <form onSubmit={handleSubmit} className="p-4 border-t">
        <div className="flex gap-2">
          <Input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Posez votre question..."
            disabled={isLoading || isRedirecting}
          />
          <Button type="submit" disabled={isLoading || !input.trim() || isRedirecting}>
            Envoyer
          </Button>
        </div>
      </form>
    </div>
  );
} 