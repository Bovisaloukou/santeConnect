"use client";

import { MedicamentCard } from "@/app/components/pharmacies/MedicamentCard"
import { PharmacieCard } from "@/app/components/pharmacies/PharmacieCard"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { useEffect, useState } from "react"
import { pharmacyApi } from "@/lib/api/pharmacy"
import { PharmacieComponent, MedicamentComponent } from "@/lib/api/types"
import LoadingSpinner from "@/components/ui/loading-spinner"
import { Button } from "@/components/ui/button"
import { useToast } from "@/components/ui/use-toast"
import type { Pharmacie, Medicament } from "@/lib/api/types"

export default function PharmaciesClient() {
  const [pharmacies, setPharmacies] = useState<PharmacieComponent[]>([]);
  const [medicaments, setMedicaments] = useState<MedicamentComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null)
  const [locationError, setLocationError] = useState<string | null>(null)
  const [isGettingLocation, setIsGettingLocation] = useState(false)
  const { toast } = useToast()

  const getLocation = () => {
    setIsGettingLocation(true);
    setLocationError(null);

    if (!navigator.geolocation) {
      setLocationError("La géolocalisation n'est pas supportée par votre navigateur");
      setIsGettingLocation(false);
      return;
    }

    const options = {
      enableHighAccuracy: false,
      timeout: 50000,
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
        // Recharger les pharmacies avec la nouvelle position
        fetchPharmacies(position.coords.latitude, position.coords.longitude);
      },
      (error) => {
        console.error("Erreur de géolocalisation:", error);
        switch (error.code) {
          case error.PERMISSION_DENIED:
            setLocationError("Vous devez autoriser la géolocalisation dans les paramètres de votre navigateur pour continuer");
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

  const fetchPharmacies = async (latitude?: number, longitude?: number) => {
    try {
      setLoading(true);
      let response;

      try {
        if (latitude && longitude) {
          response = await pharmacyApi.getAll(latitude, longitude);
        } else {
          response = await pharmacyApi.getAll();
        }
        console.log("Réponse brute de l'API:", response);
      } catch (apiError) {
        console.error("Erreur lors de l'appel à l'API:", apiError);
        setError("Erreur lors de l'appel à l'API");
        setLoading(false);
        return;
      }

      // Transformer les données de l'API en format compatible avec les composants
      const transformedPharmacies = response.map((pharmacie: Pharmacie) => ({
        id: pharmacie.uuid,
        nom: pharmacie.name,
        adresse: pharmacie.adress,
        codePostal: "", // À remplir si disponible dans l'API
        ville: "", // À remplir si disponible dans l'API
        telephone: pharmacie.telephone,
        services: pharmacie.services,
        horaires: {
          lundi: pharmacie.horaires[0] || "Non spécifié",
          samedi: pharmacie.horaires[1] || "Non spécifié",
          dimanche: pharmacie.horaires[2] || "Non spécifié"
        }
      }));

      // Transformer les médicaments (sécurisé)
      const transformedMedicaments = response.flatMap((pharmacie: Pharmacie) => 
        (pharmacie.medicaments || []).map((medicament: Medicament) => ({
          id: medicament.uuid,
          nom: medicament.name,
          description: medicament.description,
          prix: medicament.prix,
          image: "", // À remplir si disponible dans l'API
          necessiteOrdonnance: medicament.surOrdonnance,
          stock: 0, // À remplir si disponible dans l'API
          categorie: "", // À remplir si disponible dans l'API
          pharmacies: [pharmacie.uuid]
        }))
      );

      setPharmacies(transformedPharmacies);
      setMedicaments(transformedMedicaments);
    } catch (err) {
      setError("Erreur lors du chargement des pharmacies");
      console.error("Erreur globale dans fetchPharmacies:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // Essayer d'obtenir la localisation automatiquement au chargement
    getLocation();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-neutral-light-gray">
        <Header />
        <main className="flex-1 py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center min-h-[40vh]">
              <LoadingSpinner size="lg" />
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
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-neutral-light-gray">
      <Header />
      <main className="flex-1 py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl md:text-4xl font-bold text-primary-blue mb-4 text-center">
            Pharmacies à Proximité
          </h1>
          <p className="text-lg text-neutral-dark-gray max-w-3xl text-center mb-8 md:mb-12 mx-auto">
            Accédez à la liste des pharmacies partenaires, consultez leurs horaires et disponibilités, et trouvez la pharmacie la plus proche de chez vous.
          </p>

          <div className="mb-12">
            <h2 className="text-2xl font-semibold mb-6 text-neutral-dark-gray">Pharmacies partenaires</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {pharmacies.map((pharmacie) => (
                <PharmacieCard key={pharmacie.id} pharmacie={pharmacie} />
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-2xl font-semibold mb-6 text-neutral-dark-gray">Tous les médicaments</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {medicaments.map((medicament) => (
                <MedicamentCard key={medicament.id} medicament={medicament} />
              ))}
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  )
} 