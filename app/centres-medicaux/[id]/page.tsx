/** @jsxImportSource react */
'use client';
import type { Metadata } from "next"
import Image from "next/image"
import { Hospital, Stethoscope, HomeIcon, Phone, MapPin } from "lucide-react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { Button } from "@/components/ui/button"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, type CarouselApi } from "@/components/ui/carousel"
import LoadingSpinner from "@/components/ui/loading-spinner"
import React, { useState, useEffect, useRef } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { healthCenterApi } from '@/lib/api/healthCenter';

interface BackendHealthCenterDetail {
  uuid: string;
  name: string;
  type: string;
  fullAddress: string;
  phoneNumber: string;
  email: string;
  department: string;
  municipality: string;
  licenseNumber: string;
  taxIdentificationNumber: string;
  responsable: {
    firstName: string;
    lastName: string;
    email: string;
    contact: string;
  };
  healthServices: {
    uuid: string;
    serviceName: string;
    description: string | null;
    etat: string;
  }[];
}

export interface MedicalCenter {
  id: string;
  name: string;
  type: "HOSPITAL" | "CLINIC" | "HEALTH_CENTER" | "DOCTOR_OFFICE";
  isOpen: boolean;
  distance: number;
  address: string;
  phone: string;
  icon: React.ElementType;
  images: string[];
  services: { 
    name: string; 
    description?: string;
    uuid: string;
  }[];
}

// Fonction de mapping pour l'affichage des types en français
const getTypeLabel = (type: MedicalCenter["type"]): string => {
  const typeLabels: Record<MedicalCenter["type"], string> = {
    HOSPITAL: "Hôpital",
    CLINIC: "Clinique",
    HEALTH_CENTER: "Centre de santé",
    DOCTOR_OFFICE: "Cabinet médical"
  }
  return typeLabels[type]
}

// Fonction pour mapper les données du backend vers le format attendu par le composant
const mapBackendDetailToFrontend = (backendData: BackendHealthCenterDetail): MedicalCenter => {
  // Tableau d'images disponibles
  const availableImages = [
    "/images/hopital-central-1.png",
    "/images/hopital-central-2.png",
    "/images/hopital-central-3.png",
    "/images/hopital-central-4.png"
  ];

  // Sélectionner les images de manière cyclique en fonction du nombre de services
  const selectedImages = availableImages.slice(0, Math.min(backendData.healthServices.length, availableImages.length));

  return {
    id: backendData.uuid,
    name: backendData.name,
    type: backendData.type as MedicalCenter["type"],
    isOpen: true, // À implémenter plus tard
    distance: 0, // À implémenter plus tard
    address: backendData.fullAddress,
    phone: backendData.phoneNumber,
    icon: Hospital, // Par défaut, à adapter selon le type
    images: selectedImages,
    services: backendData.healthServices.map(service => ({
      name: service.serviceName,
      description: service.description || undefined,
      uuid: service.uuid
    }))
  };
};

export default function MedicalCenterDetailPage() {
  const params = useParams<{ id: string }>();
  const id = params.id;
  const router = useRouter();
  const { user, isLoading } = useAuth();

  const [center, setCenter] = useState<MedicalCenter | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const fetchCenter = async () => {
      try {
        const response = await healthCenterApi.getById(id);
        const mappedCenter = mapBackendDetailToFrontend(response.data);
        setCenter(mappedCenter);
      } catch (err) {
        setError("Erreur lors du chargement des détails du centre médical");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCenter();
  }, [id]);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
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
      }, 5000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [api, isVisible]);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-neutral-light-gray">
        <Header />
        <main className="flex-1 py-8 md:py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center min-h-[60vh]">
              <LoadingSpinner size="lg" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !center) {
    return (
      <div className="flex flex-col min-h-screen bg-neutral-light-gray">
        <Header />
        <main className="flex-1 py-8 md:py-12">
          <div className="container mx-auto px-4 text-center">
            <h1 className="text-3xl font-bold text-red-600 mb-4">Centre Médical Introuvable</h1>
            <p className="text-lg text-neutral-dark-gray">
              {error || `Désolé, le centre médical avec l'identifiant "${id}" n'a pas été trouvé.`}
            </p>
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
                <span>Type : {getTypeLabel(center.type)}</span>
              </div>
              <div className="flex items-start space-x-2">
                <MapPin className="w-5 h-5 text-primary-blue flex-shrink-0 mt-0.5" />
                <span>Adresse : {center.address}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-5 h-5 text-primary-blue flex-shrink-0" />
                <span>Téléphone : <a href={`tel:${center.phone}`} className="text-primary-blue hover:underline">{center.phone}</a></span>
              </div>
            </div>
          </div>

          {/* Section Services */}
          {center.services && center.services.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-neutral-dark-gray mb-4">Services Proposés</h2>
              <div className="grid grid-cols-1 gap-4">
                {center.services.map((service: { name: string; description?: string; uuid: string }, index: number) => (
                  <div key={index} className="bg-neutral-light-gray p-4 rounded-md border border-neutral-medium-gray/20 flex items-center justify-between">
                    <div className="flex-1">
                      <span className="text-neutral-dark-gray font-medium">{service.name}</span>
                      {service.description && (
                        <p className="text-sm text-neutral-dark-gray/70 mt-1">{service.description}</p>
                      )}
                    </div>
                    <div className="flex gap-2 ml-4">
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
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          router.push(`/register/professional?serviceUuid=${service.uuid}`);
                        }}
                      >
                        S'affilier au centre
                      </Button>
                    </div>
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
                  router.push(`/chat?centerId=${center.id}`);
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
  );
} 