/** @jsxImportSource react */
'use client';
import type { Metadata } from "next"
import Image from "next/image"
import { Hospital, Stethoscope, HomeIcon, Phone, MapPin } from "lucide-react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';

// Importation temporaire des données fictives
// Idéalement, ces données viendraient d'une API ou d'une source centrale
import { mockMedicalCenters, MedicalCenter } from "../page"

export default function MedicalCenterDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const center = mockMedicalCenters.find((c: MedicalCenter) => c.id === id);
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [api, setApi] = useState<CarouselApi>()
  const [current, setCurrent] = useState(0)
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!api) {
      return
    }

    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 } // Adjust threshold as needed
    );

    if (carouselRef.current) {
      observer.observe(carouselRef.current);
    }

    return () => {
      if (carouselRef.current) {
        observer.unobserve(carouselRef.current);
      }
    };
  }, []);

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (api && isVisible) {
      interval = setInterval(() => {
        if (api.selectedScrollSnap() === api.scrollSnapList().length - 1) {
          api.scrollTo(0);
        } else {
          api.scrollNext();
        }
      }, 5000); // Défilement toutes les 5 secondes
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [api, isVisible]);

  if (!center) {
    return (
      <div className="flex flex-col min-h-screen bg-neutral-light-gray">
        <Header />
        <main className="flex-1 py-8 md:py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Centre Médical Introuvable</h1>
            <p className="text-lg text-neutral-dark-gray">Désolé, le centre médical avec l'identifiant "{id}" n'a pas été trouvé.</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-light-gray">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-blue mb-6 text-center">
            {center.name}
          </h1>

          {/* Section Images */}
          {center.images && center.images.length > 0 && (
            <div className="mb-8">
              <Carousel className="w-full max-w-xs mx-auto md:max-w-full">
                <CarouselContent>
                  {center.images.map((image: string, index: number) => (
                    <CarouselItem key={index} className="basis-full">
                      <div className="p-1">
                        <div className="relative w-full h-screen overflow-hidden rounded-md shadow-md">
                          <Image
                            src={image}
                            alt={`Image de ${center.name} ${index + 1}`}
                            layout="fill"
                            objectFit="cover"
                            className="transition-transform duration-300 hover:scale-105"
                          />
                        </div>
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
            <h2 className="text-2xl font-semibold text-neutral-dark-gray mb-4">Détails du Centre</h2>
            <div className="space-y-3 text-neutral-dark-gray/90">
              <div className="flex items-center space-x-2">
                {React.createElement(center.icon, { className: "w-5 h-5 text-primary-blue flex-shrink-0" })}
                <span>Type : {center.type}</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-primary-blue flex-shrink-0" />
                <span>Distance : {`${center.distance} km`}</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-primary-blue flex-shrink-0 mt-0.5" />
                <span>Adresse : {center.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-primary-blue flex-shrink-0" />
                <span>Téléphone : <a href={`tel:${center.phone}`} className="text-primary-blue hover:underline">{center.phone}</a></span>
              </div>
              {/* Ajoutez d'autres détails ici si disponibles dans les données */}
            </div>
          </div>

          {/* Section Services */}
          {center.services && center.services.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-dark-gray mb-4">Services Proposés</h2>
              <div className="grid grid-cols-1 gap-4">
                {center.services.map((service: { name: string; description?: string }, index: number) => (
                  <div key={index} className="bg-neutral-light-gray p-4 rounded-md border border-neutral-medium-gray/20 flex justify-between items-center">
                    <div>
                      <span className="text-neutral-dark-gray font-medium">{service.name}</span>
                      {service.description && (
                        <p className="text-sm text-neutral-dark-gray/70 mt-1">{service.description}</p>
                      )}
                    </div>
                    <Button
                      size="sm"
                      onClick={() => {
                        if (user) {
                          router.push("/chatbot");
                        } else {
                          router.push("/login");
                        }
                      }}
                    >
                      Prendre rendez-vous
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section Orientation */}
          <div className="p-5 rounded-xl text-center">
            <p className="text-lg text-neutral-dark-gray mb-4">
            Vous ne savez pas exactement de quoi vous souffrez ? Discutez avec un médecin généraliste pour identifier vos symptômes et être orienté vers le service médical le plus adapté.
            </p>
            <Button
              size="lg"
              className="bg-accent-turquoise hover:bg-accent-turquoise/90 text-neutral-white"
              onClick={() => {
                if (user) {
                  router.push("/chat");
                } else {
                  router.push("/login");
                }
              }}
            >
              Consultation
            </Button>
          </div>

        </div>
      </main>
      <Footer />
    </div>
  )
} 