"use client";

import type { Metadata } from "next"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { mockMedicalCenters, MedicalCenter } from "@/app/centres-medicaux/page"
import { Hospital, Stethoscope, HomeIcon, Phone, MapPin, Clock } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React, { useState, use } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"

// Fonction mock pour simuler la vérification de l'état de connexion
// Dans une vraie application, vous utiliseriez un contexte ou une API d'authentification.
// Supprimer la fonction mock useIsAuthenticated
// const useIsAuthenticated = (): boolean => {
//   // Pour le test, retourne false pour simuler un utilisateur non connecté
//   // Remplacez par la logique d'authentification réelle
//   return false; 
// };

// Supprimez l'exportation de metadata ici car c'est un composant client.
// export const metadata: Metadata = {
//   title: "Centre Médical - SantéConnect",
//   description: "Informations détaillées sur le centre médical et les services disponibles.",
// }

interface MedicalCenterProps {
  params: { id: string }
}

export default function MedicalCenterPage({ params }: MedicalCenterProps) {
  // Revenir à l'accès direct à params.id pour le moment, en attendant les futures mises à jour de Next.js
  const centerId = params.id;

  const router = useRouter();
  // Utiliser useSession pour obtenir le statut d'authentification
  const { user} = useAuth();

  // Rechercher le centre médical correspondant dans les données mock
  const medicalCenter = mockMedicalCenters.find((center: MedicalCenter) => center.id === centerId);

  const [hoveredImageIndex, setHoveredImageIndex] = useState<number | null>(null);

  if (!medicalCenter) {
    return (
      <div className="flex flex-col min-h-screen bg-neutral-light-gray">
        <Header />
        <main className="flex-1 py-8 md:py-12">
          <div className="container mx-auto px-4 text-center text-red-600">
            <h1 className="text-3xl md:text-4xl font-bold text-primary-blue mb-4">Centre Médical Introuvable</h1>
            <p>Le centre médical avec l'ID {centerId} n'a pas été trouvé.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Afficher les détails si le centre est trouvé
  return (
    <div className="flex flex-col min-h-screen bg-neutral-light-gray">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md::text-4xl font-bold text-primary-blue mb-6 text-center">
            {medicalCenter.name}
          </h1>

          {/* Section Images */}
          {medicalCenter.images && medicalCenter.images.length > 0 && (
            <div className="mb-8">
              <Carousel
                 opts={{
                  loop: true,
                 }}
              >
                <CarouselContent>
                  {medicalCenter.images.map((image: string, index: number) => (
                    <CarouselItem key={index}>
                      <div
                        className={`relative w-full h-screen rounded-lg overflow-hidden shadow-md transition-transform duration-300 ease-in-out ${hoveredImageIndex === index ? 'scale-105 z-10' : ''}`}
                        onMouseEnter={() => setHoveredImageIndex(index)}
                        onMouseLeave={() => setHoveredImageIndex(null)}
                      >
                        <Image
                          src={image}
                          alt={`Image du centre ${medicalCenter.name} ${index + 1}`}
                          layout="fill"
                          objectFit="cover"
                          className="transition-transform duration-300 ease-in-out"
                        />
                      </div>
                    </CarouselItem>
                  ))}
                </CarouselContent>
                <CarouselPrevious />
                <CarouselNext />
              </Carousel>
            </div>
          )}

          {/* Section Détails */}
          <div className="bg-neutral-white p-6 rounded-xl shadow-lg border border-neutral-medium-gray/20 mb-8">
            <h2 className="text-2xl font-semibold text-neutral-dark-gray mb-4">Détails</h2>
            <div className="space-y-3 text-neutral-dark-gray/90">
              <div className="flex items-center space-x-2">
                <medicalCenter.icon className="w-5 h-5 text-primary-blue flex-shrink-0" />
                <span>Type : {medicalCenter.type}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-primary-blue flex-shrink-0" />
                <span>Adresse : {medicalCenter.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                 <Phone className="w-5 h-5 text-primary-blue flex-shrink-0" />
                 <a href={`tel:${medicalCenter.phone}`} className="text-neutral-dark-gray/90 hover:underline hover:text-primary-blue transition-colors">
                 <span>{medicalCenter.phone}</span>
                 </a>
              </div>
              
              {/* Ajouter d'autres détails si nécessaire */}
            </div>
          </div>

          {/* Section Services */}
          {medicalCenter.services && medicalCenter.services.length > 0 && (
            <div className="bg-neutral-white p-6 rounded-xl shadow-lg border border-neutral-medium-gray/20 mb-8">
              <h2 className="text-2xl font-semibold text-neutral-dark-gray mb-4">Services Disponibles</h2>
              <ul className="space-y-4">
                {medicalCenter.services.map((service: { id: string; name: string; description: string }) => (
                  <li key={service.id} className="flex justify-between items-center border-b border-neutral-medium-gray/20 pb-3 last:border-b-0 last:pb-0">
                    <div>
                      <h3 className="text-lg font-medium text-neutral-dark-gray">{service.name}</h3>
                      <p className="text-sm text-neutral-dark-gray/80">{service.description}</p>
                    </div>
                    <button
                      onClick={() => {
                        // Utiliser isAuthenticated basé sur le statut de session
                        if (!user) {
                          // Rediriger vers la page de connexion, en passant l'URL actuelle pour rediriger après connexion
                          router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
                        } else {
                          // Logique de prise de rendez-vous (placeholder)
                          alert(`Vous êtes connecté. Prise de rendez-vous pour ${service.name}.`);
                        }
                      }}
                      className="ml-4 bg-primary-blue text-neutral-white px-4 py-2 rounded-md hover:bg-primary-blue/90 transition-colors"
                    >
                      Prendre rendez-vous
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Bouton Généraliste */}
           <div className="text-center mt-8">
             <p className="text-lg text-neutral-dark-gray max-w-3xl mx-auto mb-4">
             Nous vous conseillons de discuter avec un médecin généraliste si vous n'êtes pas sûr du service médical dont vous avez besoin ou de l'origine de vos problèmes de santé. Il pourra évaluer votre situation et vous orienter vers le spécialiste approprié.
             </p>
             <button
               onClick={() => {
                 // Utiliser isAuthenticated basé sur le statut de session
                 if (!user) {
                   // Rediriger vers la page de connexion, en passant l'URL actuelle pour rediriger après connexion
                   router.push(`/login?redirect=${encodeURIComponent(window.location.pathname)}`);
                 } else {
                   // Logique pour discuter avec un généraliste (placeholder)
                   alert("Vous êtes connecté. Lancement de la discussion avec un médecin généraliste.");
                 }
               }}
               className="bg-accent-turquoise text-neutral-white px-6 py-3 rounded-md text-lg font-semibold hover:bg-accent-turquoise/90 transition-colors"
             >
               Discuter avec un médecin généraliste
             </button>
           </div>

        </div>
      </main>
      <Footer />
    </div>
  )
} 