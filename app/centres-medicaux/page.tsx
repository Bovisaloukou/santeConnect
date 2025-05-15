import type { Metadata } from "next"
import { Hospital, Stethoscope, HomeIcon, Phone, MapPin, Clock } from "lucide-react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import Link from "next/link"

export interface MedicalCenter {
  id: string
  name: string
  type: "Hôpital" | "Clinique" | "Centre de santé"
  isOpen: boolean
  distance: number // en kilomètres
  address: string
  phone: string
  icon: React.ElementType
  services: { id: string; name: string; description: string }[]
  images: string[]
}

export const mockMedicalCenters: MedicalCenter[] = [
  {
    id: "1",
    name: "Hôpital Central de la Ville",
    type: "Hôpital",
    isOpen: true,
    distance: 1.2,
    address: "123 Rue de la Santé, 75001 Paris",
    phone: "0123456789",
    icon: Hospital,
    services: [
      { id: "s2", name: "Pédiatrie", description: "Consultations pour enfants" },
      { id: "s3", name: "Dermatologie", description: "Consultations pour problèmes de peau" },
      { id: "s12", name: "Ophtalmologie", description: "Consultations pour les yeux" },
      { id: "s13", name: "Oto-rhino-laryngologie (ORL)", description: "Consultations pour les oreilles, le nez et la gorge" },
      { id: "s14", name: "Cardiologie", description: "Consultations et examens cardiaques" },
      { id: "s15", name: "Radiologie", description: "Examens d'imagerie médicale" },
      { id: "s16", name: "Vaccination", description: "Vaccinations tout âge" },
      { id: "s17", name: "Chirurgie", description: "Interventions chirurgicales diverses" },
      { id: "s18", name: "Anesthésiologie", description: "Consultations pré-opératoires" },
      { id: "s19", name: "Gynécologie", description: "Consultations gynécologiques" },
      { id: "s20", name: "Obstétrique", description: "Suivi de grossesse" },
    ],
    images: [
      "/images/hopital-central-1.jpg",
      "/images/hopital-central-2.jpg",
      "/images/hopital-central-3.jpg",
    ],
  },
  {
    id: "2",
    name: "Clinique du Parc",
    type: "Clinique",
    isOpen: false,
    distance: 2.5,
    address: "45 Avenue des Champs, 75008 Paris",
    phone: "0987654321",
    icon: Stethoscope,
    services: [
      { id: "s4", name: "Cardiologie", description: "Consultations et examens cardiaques" },
      { id: "s5", name: "Radiologie", description: "Examens d'imagerie médicale" },
    ],
    images: [
      "/images/clinique-parc-1.jpg",
      "/images/clinique-parc-2.jpg",
    ],
  },
  {
    id: "3",
    name: "Centre de Santé Bien-Être",
    type: "Centre de santé",
    isOpen: true,
    distance: 0.8,
    address: "789 Boulevard Voltaire, 75011 Paris",
    phone: "0112233445",
    icon: HomeIcon,
    services: [
      { id: "s6", name: "Médecine Générale", description: "Suivi médical général" },
      { id: "s7", name: "Vaccination", description: "Vaccinations tout âge" },
    ],
    images: [
      "/images/centre-sante-1.jpg",
    ],
  },
  {
    id: "4",
    name: "Hôpital Universitaire Grand Est",
    type: "Hôpital",
    isOpen: true,
    distance: 5.1,
    address: "10 Rue de l\'Hôpital, 67000 Strasbourg",
    phone: "0388000000",
    icon: Hospital,
    services: [
      { id: "s8", name: "Chirurgie", description: "Interventions chirurgicales diverses" },
      { id: "s9", name: "Anesthésiologie", description: "Consultations pré-opératoires" },
    ],
    images: [
      "/images/hopital-universitaire-1.jpg",
      "/images/hopital-universitaire-2.jpg",
      "/images/hopital-universitaire-3.jpg",
    ],
  },
  {
    id: "5",
    name: "Clinique Sainte-Anne",
    type: "Clinique",
    isOpen: false,
    distance: 3.0,
    address: "22 Allée de la Robertsau, 67000 Strasbourg",
    phone: "0388112233",
    icon: Stethoscope,
    services: [
      { id: "s10", name: "Gynécologie", description: "Consultations gynécologiques" },
      { id: "s11", name: "Obstétrique", description: "Suivi de grossesse" },
    ],
    images: [
      "/images/clinique-sainte-anne-1.jpg",
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
                    <center.icon className="w-4 h-4 text-primary-blue flex-shrink-0" />
                    <span>{center.type}</span>
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
                  <Link href={`/centres-medicaux/${center.id}`} className="text-primary-blue hover:underline hover:text-accent-turquoise transition-colors">
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
