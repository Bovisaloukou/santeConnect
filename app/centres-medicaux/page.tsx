"use client";

import { Hospital, Stethoscope, HomeIcon, Phone, MapPin, Clock } from "lucide-react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { healthCenterApi } from "@/lib/api/healthCenter"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"

export interface MedicalCenter {
  id: string
  name: string
  type: "HOSPITAL" | "CLINIC" | "HEALTH_CENTER" | "DOCTOR_OFFICE"
  isOpen: boolean
  distance: number
  address: string
  phone: string
  icon: React.ElementType
  images: string[]
  services: { name: string; description?: string }[]
  estimatedTime?: string
}

interface BackendHealthCenter {
  uuid: string
  name: string
  type: string
  fullAddress: string
  phoneNumber: string
  distance: number
  estimatedTime: string
  healthServices: {
    serviceName: string
    description: string | null
  }[]
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
const mapBackendToFrontend = (backendData: BackendHealthCenter[]): MedicalCenter[] => {
  return backendData.map(center => ({
    id: center.uuid,
    name: center.name,
    type: center.type as MedicalCenter["type"],
    isOpen: true, // À implémenter plus tard
    distance: center.distance,
    address: center.fullAddress,
    phone: center.phoneNumber,
    icon: Hospital, // Par défaut, à adapter selon le type
    images: ["/images/hopital-central-1.png"], // À implémenter plus tard
    services: center.healthServices.map(service => ({
      name: service.serviceName,
      description: service.description || undefined
    })),
    estimatedTime: center.estimatedTime
  }))
}

export default function CentresMedicauxPage() {
  const [centers, setCenters] = useState<MedicalCenter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const { toast } = useToast()

  const getLocation = () => {
    setIsGettingLocation(true);
    setLocationError(null);
    setLoading(true); // Afficher le spinner pendant la recherche de la localisation

    if (!navigator.geolocation) {
      setLocationError("La géolocalisation n'est pas supportée par votre navigateur. Veuillez l'activer pour trouver les centres proches.");
      setIsGettingLocation(false);
      setLoading(false); // Cacher le spinner
      return;
    }

    const options = {
      enableHighAccuracy: true,
      timeout: 20000,
      maximumAge: 0
    };

    navigator.geolocation.getCurrentPosition(
      (position) => {
        console.log("Position obtenue:", position);
        setLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude
        });
        setIsGettingLocation(false);
        toast({
          title: "Localisation obtenue",
          description: "Votre position a été enregistrée avec succès.",
        });
        // Recharger les centres avec la nouvelle position
        fetchCenters(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error("Erreur détaillée de géolocalisation :", error);
        setLoading(false); // Cacher le spinner en cas d'erreur
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Vous devez autoriser la géolocalisation pour trouver les centres à proximité.");
            toast({
              title: "Permission refusée",
              description: "Veuillez autoriser la géolocalisation dans les paramètres de votre navigateur",
              variant: "destructive",
            });
            break;
          case error.POSITION_UNAVAILABLE:
            setLocationError("Les informations de localisation ne sont pas disponibles. Veuillez vérifier votre connexion internet et réessayer.");
            toast({
              title: "Position indisponible",
              description: "Impossible d'obtenir votre position. Veuillez réessayer.",
              variant: "destructive",
            });
            break;
          case error.TIMEOUT:
            setLocationError("La demande de géolocalisation a expiré. Veuillez réessayer.");
            toast({
              title: "Délai dépassé",
              description: "La demande de géolocalisation a pris trop de temps. Veuillez réessayer.",
              variant: "destructive",
            });
            break;
          default:
            setLocationError("Une erreur est survenue lors de la géolocalisation. Veuillez réessayer.");
            toast({
              title: "Erreur",
              description: "Une erreur inattendue est survenue. Veuillez réessayer.",
              variant: "destructive",
            });
        }
        setIsGettingLocation(false);
      },
      options
    );
  };

  const fetchCenters = async (latitude?: number, longitude?: number) => {
    // On ne fetch que si on a la localisation
    if (latitude === undefined || longitude === undefined) {
      setError("Impossible de charger les centres sans votre localisation.");
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      const response = await healthCenterApi.getAll(latitude, longitude);
      
      const centersData = Array.isArray(response) ? response : response.data || [];
      const mappedCenters = mapBackendToFrontend(centersData);
      setCenters(mappedCenters);
    } catch (err) {
      setError("Erreur lors du chargement des centres médicaux");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Essayer d'obtenir la localisation automatiquement au chargement
    getLocation();
  }, []);

  const sortedCenters = [...centers].sort((a, b) => {
    if (a.isOpen && !b.isOpen) return -1;
    if (!a.isOpen && b.isOpen) return 1;
    return a.distance - b.distance;
  });

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-neutral-light-gray">
        <Header />
        <main className="flex-1 py-8 md:py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <LoadingSpinner size="lg" />
              <p className="mt-4 text-lg text-neutral-dark-gray">Recherche de votre position...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  if (locationError) {
    return (
      <div className="flex flex-col min-h-screen bg-neutral-light-gray">
        <Header />
        <main className="flex-1 py-8 md:py-12">
          <div className="container mx-auto px-4 text-center">
             <div className="flex flex-col items-center justify-center min-h-[60vh]">
              <p className="text-red-500 text-lg mb-4">{locationError}</p>
              <Button onClick={getLocation} disabled={isGettingLocation}>
                {isGettingLocation ? "Recherche en cours..." : "Réessayer"}
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-neutral-light-gray">
        <Header />
        <main className="flex-1 py-8 md:py-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-light-gray">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-blue mb-4 text-center">
            Centres Médicaux à Proximité
          </h1>
          <p className="text-lg text-neutral-dark-gray max-w-3xl text-center mb-8 md:mb-12 mx-auto">
            Trouvez rapidement les informations essentielles sur les établissements de santé autour de vous.
          </p>

          {centers.length === 0 && !loading && (
            <div className="text-center py-10">
              <p className="text-neutral-dark-gray">Aucun centre médical trouvé à proximité.</p>
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {sortedCenters.map((center) => (
              <div key={center.id} className="bg-neutral-white p-5 rounded-xl shadow-lg border border-neutral-medium-gray/20 flex flex-col h-full hover:shadow-primary-blue/20 transition-shadow duration-300">
                <div className="flex justify-between items-start mb-3">
                  <h2 className="text-xl font-semibold text-neutral-dark-gray flex-grow pr-2">
                    {center.name}
                  </h2>
                </div>

                <div className="space-y-2.5 text-sm text-neutral-dark-gray/90 flex-grow">
                  <div className="flex items-center space-x-2">
                    {React.createElement(center.icon, { className: "w-4 h-4 text-primary-blue flex-shrink-0" })}
                    <span>{getTypeLabel(center.type)}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-primary-blue flex-shrink-0" />
                    <span>{`${center.distance.toFixed(1)} km`}</span>
                  </div>
                  {center.estimatedTime && (
                    <div className="flex items-center space-x-2">
                      <Clock className="w-4 h-4 text-primary-blue flex-shrink-0" />
                      <span>{center.estimatedTime}</span>
                    </div>
                  )}
                  <div className="flex items-start space-x-2">
                    <MapPin className="w-4 h-4 text-primary-blue flex-shrink-0 mt-0.5" />
                    <span>{center.address}</span>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-neutral-medium-gray/20 flex justify-between items-center">
                  <a href={`tel:${center.phone}`} className="flex items-center space-x-2 text-sm text-primary-blue hover:underline hover:text-accent-turquoise transition-colors">
                    <Phone className="w-4 h-4" />
                    <span>{center.phone}</span>
                  </a>
                  <Link href={`/centres-medicaux/${center.id}`} className="text-sm text-primary-blue hover:underline hover:text-accent-turquoise transition-colors">
                    Plus d'infos
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
}
