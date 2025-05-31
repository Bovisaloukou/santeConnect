import { Hospital, Stethoscope, HomeIcon, Phone, MapPin, Clock } from "lucide-react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import Link from "next/link"
import React from "react"

export interface MedicalCenter {
  id: string
  name: string
  type: "HOSPITAL" | "CLINIC" | "HEALTH_CENTER" | "DOCTOR_OFFICE"
  isOpen: boolean
  distance: number // en kilomètres
  address: string
  phone: string
  icon: React.ElementType
  images: string[]
  services: { name: string; description?: string }[]
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

export const mockMedicalCenters: MedicalCenter[] = [
  {
    id: "1",
    name: "Centre National Hospitalier et Universitaire (CNHU)",
    type: "HOSPITAL",
    isOpen: true,
    distance: 2.1,
    address: "Avenue Jean-Paul II, Cotonou",
    phone: "+229 21 30 06 56",
    icon: Hospital,
    images: ["/images/hopital-central-1.png", "/images/hopital-central-2.png", "/images/hopital-central-3.png"],
    services: [
      { name: "Médecine Générale", description: "Services hospitaliers généraux et spécialisés." },
      { name: "Urgences", description: "Service d'urgence 24/7." },
      { name: "Chirurgie", description: "Interventions chirurgicales diverses." },
    ],
  },
  {
    id: "2",
    name: "Centre Hospitalier et Universitaire de la Mère et de l'Enfant Lagune (HOMEL)",
    type: "HOSPITAL",
    isOpen: true,
    distance: 3.5,
    address: "01 BP 107 Cotonou Bénin",
    phone: "+229 21 31 31 28",
    icon: Hospital,
    images: ["/images/hopital-central-1.png", "/images/hopital-central-2.png", "/images/hopital-central-3.png"],
    services: [
      { name: "Maternité", description: "Soins spécialisés pour les mères et les enfants." },
      { name: "Pédiatrie", description: "Soins pédiatriques spécialisés." },
      { name: "Gynécologie", description: "Soins gynécologiques et obstétriques." },
    ],
  },
  {
    id: "3",
    name: "Clinique Mahouna",
    type: "CLINIC",
    isOpen: true,
    distance: 1.8,
    address: "Patte d'Oie, Rue 395 et Place du Souvenir, Cotonou",
    phone: "+229 21 30 14 35",
    icon: Stethoscope,
    images: ["/images/hopital-central-1.png", "/images/hopital-central-2.png", "/images/hopital-central-3.png"],
    services: [
      { name: "Médecine Générale", description: "Consultations médicales générales." },
      { name: "Laboratoire", description: "Analyses médicales et tests paludisme." },
      { name: "Chirurgie Orthopédique", description: "Interventions chirurgicales orthopédiques." },
    ],
  },
  {
    id: "4",
    name: "Polyclinique Saint Michel (POSAM)",
    type: "CLINIC",
    isOpen: true,
    distance: 2.3,
    address: "09 BP 316 Cotonou",
    phone: "+229 21 31 83 83",
    icon: Stethoscope,
    images: ["/images/hopital-central-1.png", "/images/hopital-central-2.png", "/images/hopital-central-3.png"],
    services: [
      { name: "Médecine Générale", description: "Toutes les spécialités médicales." },
      { name: "Procréation Médicalement Assistée", description: "IIU, FIV, ICSI, IMSI." },
      { name: "Urgences", description: "Service d'urgence 24/7." },
    ],
  },
  {
    id: "5",
    name: "Clinique Ophtalmologique La Lumière",
    type: "CLINIC",
    isOpen: true,
    distance: 1.5,
    address: "04 BP 497 Cotonou",
    phone: "+229 99 04 05 05",
    icon: Stethoscope,
    images: ["/images/hopital-central-1.png", "/images/hopital-central-2.png", "/images/hopital-central-3.png"],
    services: [
      { name: "Ophtalmologie", description: "Consultations et chirurgie oculaire." },
      { name: "Dépistage", description: "Dépistage visuel pour enfants et adultes." },
      { name: "Chirurgie Oculaire", description: "Cataracte, glaucome, myopie." },
    ],
  },
  {
    id: "6",
    name: "Centre Médical Haie Vive",
    type: "HEALTH_CENTER",
    isOpen: true,
    distance: 0.8,
    address: "Quartier Haie Vive, Cotonou",
    phone: "+229 91 55 50 50",
    icon: HomeIcon,
    images: ["/images/hopital-central-1.png", "/images/hopital-central-2.png", "/images/hopital-central-3.png"],
    services: [
      { name: "Médecine Générale", description: "Consultations médicales générales." },
      { name: "Gynécologie-Obstétrique", description: "Suivi de grossesse et échographies." },
      { name: "Soins Paramédicaux", description: "Analyses biomédicales, soins infirmiers, kinésithérapie." },
    ],
  },
]

export default function CentresMedicauxPage() {
  const sortedCenters = [...mockMedicalCenters].sort((a, b) => {
    if (a.isOpen && !b.isOpen) return -1;
    if (!a.isOpen && b.isOpen) return 1;
    return a.distance - b.distance;
  });

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

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
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
