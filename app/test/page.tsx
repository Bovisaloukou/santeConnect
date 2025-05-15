// pages/nearby-centers.tsx
"use client"
import { useState, useEffect, use } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@/components/ui/carousel'; // Assure-toi que ce composant existe ou crée-le
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"


// Type pour les infos de base d'un centre
interface CenterSummary {
  id: string;
  name: string;
  type: string;
  distance: string;
  address: string;
  phone: string;
}

// Type pour les infos détaillées (incluant services et images)
interface CenterDetails extends CenterSummary {
  images: string[];
  services: Array<{ id: string, name: string, description?: string }>;
}

// Données initiales (simulées)
const initialCentersData: CenterSummary[] = [
  { id: '1', name: 'Centre de Santé Bien-Être', type: 'Centre de santé', distance: '0.8 km', address: '789 Boulevard Voltaire, 75011 Paris', phone: '0112233445' },
  { id: '2', name: 'Hôpital Central de la Ville', type: 'Hôpital', distance: '1.2 km', address: '123 Rue de la Santé, 75001 Paris', phone: '0123456789' },
  // ... autres centres
];

// Fonction pour simuler la récupération des détails d'un centre
async function fetchCenterDetails(centerId: string): Promise<CenterDetails | null> {
  // Simule un appel API
  await new Promise(resolve => setTimeout(resolve, 500));
  if (centerId === '1') {
    return {
      ...initialCentersData.find(c => c.id === centerId)!,
      images: ['/path/to/image1.jpg', '/path/to/image2.jpg'], // Remplace par de vrais chemins
      services: [
        { id: 's1', name: 'Consultation Générale', description: 'Médecine générale pour tous.' },
        { id: 's2', name: 'Cardiologie', description: 'Soins du coeur et des vaisseaux.' },
      ],
    };
  }
  // Gérer les autres centres ou retourner null si non trouvé
  return null;
}


const MedicalCenterCard = ({ center }: { center: CenterSummary }) => {
  const [details, setDetails] = useState<CenterDetails | null>(null);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // Pour l'option Accordion

  const handleToggleDetails = async () => {
    if (!isExpanded && !details) { // Si on ouvre et que les détails ne sont pas chargés
      setIsLoadingDetails(true);
      const fetchedDetails = await fetchCenterDetails(center.id);
      setDetails(fetchedDetails);
      setIsLoadingDetails(false);
    }
    setIsExpanded(!isExpanded);
  };

  const handleBookAppointment = (serviceId: string) => {
    // Logique pour rediriger vers la page de réservation
    // Vérifier si l'utilisateur est connecté
    // Si non, rediriger vers login avec ?redirectTo=/booking?centerId=${center.id}&serviceId=${serviceId}
    console.log(`Booking for service ${serviceId} at center ${center.id}`);
  };

  const handleChatWithGP = () => {
    // Logique pour rediriger vers le chat avec un généraliste
    // Vérifier si l'utilisateur est connecté
    // Si non, rediriger vers login avec ?redirectTo=/chat-gp?centerId=${center.id}
    console.log(`Chat with GP for center ${center.id}`);
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle>{center.name}</CardTitle>
        <CardDescription>{center.type}</CardDescription>
      </CardHeader>
      <CardContent>
        <p>{center.distance}</p>
        <p>{center.address}</p>
        <p>{center.phone}</p>
      </CardContent>
      <CardFooter className="flex flex-col items-start">
        {/* Utilisation d'Accordion pour "Plus d'infos" */}
        <Accordion type="single" collapsible className="w-full" onValueChange={(value) => {
          // `value` sera l'id de l'item ouvert, ou "" si fermé
          const currentlyExpanded = value === center.id;
          if (currentlyExpanded && !details) {
            handleToggleDetails(); // Charge les détails si on ouvre pour la première fois
          }
          setIsExpanded(currentlyExpanded);
        }}>
          <AccordionItem value={center.id}>
            <AccordionTrigger>Plus d'infos</AccordionTrigger>
            <AccordionContent>
              {isLoadingDetails && <p>Chargement des détails...</p>}
              {details && (
                <>
                  {/* Bannière Photos */}
                  {details.images && details.images.length > 0 && (
                    <Carousel className="w-full max-w-xs mx-auto my-4">
                      <CarouselContent>
                        {details.images.map((src, index) => (
                          <CarouselItem key={index}>
                            <img src={src} alt={`${center.name} - image ${index + 1}`} className="w-full h-auto object-cover rounded" />
                          </CarouselItem>
                        ))}
                      </CarouselContent>
                      <CarouselPrevious />
                      <CarouselNext />
                    </Carousel>
                  )}

                  {/* Liste des Services */}
                  <h4 className="font-semibold mt-4 mb-2">Services Disponibles :</h4>
                  {details.services && details.services.length > 0 ? (
                    <ul className="list-disc pl-5 space-y-2">
                      {details.services.map(service => (
                        <li key={service.id} className="flex justify-between items-center">
                          <div>
                            <p className="font-medium">{service.name}</p>
                            {service.description && <p className="text-sm text-muted-foreground">{service.description}</p>}
                          </div>
                          <Button variant="outline" size="sm" onClick={() => handleBookAppointment(service.id)}>
                            Prendre RDV
                          </Button>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p>Aucun service spécifique listé pour ce centre.</p>
                  )}
                </>
              )}
              {!isLoadingDetails && !details && isExpanded && <p>Impossible de charger les détails.</p>}
            </AccordionContent>
          </AccordionItem>
        </Accordion>

        {/* Bouton pour discuter avec un médecin généraliste */}
        <Button variant="secondary" className="mt-4 w-full" onClick={handleChatWithGP}>
          Besoin d'aide pour choisir ? Discuter avec un médecin généraliste
        </Button>
      </CardFooter>
    </Card>
  );
};


export default function NearbyCentersPage() {
  const [centers, setCenters] = useState<CenterSummary[]>([]);

  useEffect(() => {
    // Simuler la récupération des centres à proximité
    setCenters(initialCentersData);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Centres médicaux à proximité</h1>
      {centers.length > 0 ? (
        centers.map(center => <MedicalCenterCard key={center.id} center={center} />)
      ) : (
        <p>Aucun centre trouvé à proximité.</p>
      )}
    </div>
  );
}