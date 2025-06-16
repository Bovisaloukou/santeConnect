"use client";

import { Hospital, Stethoscope, HomeIcon, Phone, MapPin, Clock } from "lucide-react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import Link from "next/link"
import React, { useEffect, useState } from "react"
import { healthCenterApi } from "@/lib/api/healthCenter"
import LoadingSpinner from "@/components/ui/loading-spinner"

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
}

interface BackendHealthCenter {
  uuid: string
  name: string
  type: string
  fullAddress: string
  phoneNumber: string
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
    distance: 0, // À implémenter plus tard
    address: center.fullAddress,
    phone: center.phoneNumber,
    icon: Hospital, // Par défaut, à adapter selon le type
    images: ["/images/hopital-central-1.png"], // À implémenter plus tard
    services: center.healthServices.map(service => ({
      name: service.serviceName,
      description: service.description || undefined
    }))
  }))
}

export default function CentresMedicauxPage() {
  const [centers, setCenters] = useState<MedicalCenter[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchCenters = async () => {
      try {
        const response = await healthCenterApi.getAll()
        const mappedCenters = mapBackendToFrontend(response.data)
        setCenters(mappedCenters)
      } catch (err) {
        setError("Erreur lors du chargement des centres médicaux")
        console.error(err)
      } finally {
        setLoading(false)
      }
    }

    fetchCenters()
  }, [])

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
            <div className="flex items-center justify-center min-h-[60vh]">
              <LoadingSpinner size="lg" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    )
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
                    <span>{`${center.distance} km`}</span>
                  </div>
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
