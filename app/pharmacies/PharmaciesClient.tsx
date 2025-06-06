"use client";

import { MedicamentCard } from "@/app/components/pharmacies/MedicamentCard"
import { PharmacieCard } from "@/app/components/pharmacies/PharmacieCard"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { useEffect, useState } from "react"
import { pharmacyApi } from "@/lib/api/pharmacy"
import { PharmacieComponent, MedicamentComponent } from "@/lib/api/types"

export default function PharmaciesClient() {
  const [pharmacies, setPharmacies] = useState<PharmacieComponent[]>([]);
  const [medicaments, setMedicaments] = useState<MedicamentComponent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPharmacies = async () => {
      try {
        const response = await pharmacyApi.getAll();
        // Transformer les données de l'API en format compatible avec les composants
        const transformedPharmacies = response.data.map(pharmacie => ({
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

        // Transformer les médicaments
        const transformedMedicaments = response.data.flatMap(pharmacie => 
          pharmacie.medicaments.map(medicament => ({
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
      } finally {
        setLoading(false);
      }
    };

    fetchPharmacies();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col min-h-screen bg-neutral-light-gray">
        <Header />
        <main className="flex-1 py-8 md:py-12">
          <div className="container mx-auto px-4 text-center">
            <p>Chargement des pharmacies...</p>
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