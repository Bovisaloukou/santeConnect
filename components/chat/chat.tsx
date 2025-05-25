"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { v4 as uuidv4 } from "uuid";
import ReactMarkdown from "react-markdown";

interface Message {
  id: string;
  content: string;
  role: "user" | "assistant";
}

export function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [userId] = useState(() => uuidv4());

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
          content: data.output,
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
    if (!input.trim() || isLoading) return;

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

      const data = await response.json();
      
      const assistantMessage: Message = {
        id: uuidv4(),
        content: data.output,
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

  return (
    <div className="flex flex-col h-full">
      <ScrollArea className="flex-1 p-4">
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
            disabled={isLoading}
          />
          <Button type="submit" disabled={isLoading || !input.trim()}>
            Envoyer
          </Button>
        </div>
      </form>
    </div>
  );
} 