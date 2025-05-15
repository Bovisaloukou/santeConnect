"use client";

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

import PhoneInput from 'react-phone-input-2';
import type { CountryData } from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';

import { Command as CommandPrimitive } from "cmdk";
import { X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Command, CommandGroup, CommandItem, CommandList } from "@/components/ui/command";
import { useToast } from "@/components/ui/use-toast";

// Import des données administratives du Bénin
import { beninAdministrativeData, DepartementData } from '@/data/beninAdministrativeData';

const medicalSpecialtiesList = [
  { value: "medecine-generale", label: "Médecine générale" },
  { value: "gynecologie", label: "Gynécologie" },
  { value: "pediatrie", label: "Pédiatrie" },
  { value: "cardiologie", label: "Cardiologie" },
  { value: "dermatologie", label: "Dermatologie" },
  { value: "neurologie", label: "Neurologie" },
  { value: "ophtalmologie", label: "Ophtalmologie" },
  { value: "orl", label: "ORL" },
  { value: "psychiatrie", label: "Psychiatrie" },
  { value: "radiologie", label: "Radiologie" },
  { value: "urologie", label: "Urologie" },
  { value: "kinesitherapie", label: "Kinésithérapie" },
  { value: "dentaire", label: "Chirurgie Dentaire" },
  // Add more specialties here
];

const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

const RegisterCenterPage = () => {
  const [centerPhone, setCenterPhone] = useState('');
  const [responsiblePhone, setResponsiblePhone] = useState('');
  const [centerSelectedCountryData, setCenterSelectedCountryData] = useState<CountryData | null>(null);
  const [responsibleSelectedCountryData, setResponsibleSelectedCountryData] = useState<CountryData | null>(null);
  const [selectedSpecialties, setSelectedSpecialties] = useState<{ value: string; label: string }[]>([]);
  const [openDays, setOpenDays] = useState<string[]>([]);
  const [openingTime, setOpeningTime] = useState('');
  const [closingTime, setClosingTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  // --- États pour les données administratives ---
  const [departements, setDepartements] = useState<{ value: string; label: string }[]>([]);
  const [communesData, setCommunesData] = useState<DepartementData[]>([]); // Stocke les données brutes
  const [selectedDepartement, setSelectedDepartement] = useState<string | null>(null);
  const [filteredCommunes, setFilteredCommunes] = useState<{ value: string; label: string }[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true); // État de chargement
  // --- Fin des États ---

  const { toast } = useToast();

  useEffect(() => {
    // Default to Benin if needed
    setCenterSelectedCountryData({ countryCode: 'bj', dialCode: '229' } as CountryData);
    setResponsibleSelectedCountryData({ countryCode: 'bj', dialCode: '229' } as CountryData);

    // --- Nouvelle logique pour charger les données ---
    // Utilise les données importées
    const formattedDepartements = beninAdministrativeData.map(dep => ({
      value: dep.departement.toLowerCase().replace(/[^a-z0-9]/g, ''), // Crée une valeur simple sans accents/espaces
      label: dep.departement
    }));
    setDepartements(formattedDepartements);
    setCommunesData(beninAdministrativeData); // Stocke les données brutes pour le filtrage
    setIsLoadingData(false); // Les données sont chargées instantanément
    // --- Fin de la nouvelle logique ---

  }, []);

  // --- Nouvelle logique pour filtrer les communes par département ---
  useEffect(() => {
    if (selectedDepartement) {
      const departement = communesData.find(dep => dep.departement.toLowerCase().replace(/[^a-z0-9]/g, '') === selectedDepartement);
      if (departement) {
        const formattedCommunes = departement.communes.map(com => ({
          value: com.toLowerCase().replace(/[^a-z0-9]/g, ''), // Crée une valeur simple
          label: com
        }));
        setFilteredCommunes(formattedCommunes);
      } else {
        setFilteredCommunes([]);
      }
    } else {
      setFilteredCommunes([]);
    }
  }, [selectedDepartement, communesData]); // Dépend de selectedDepartement et des données brutes
  // --- Fin de la nouvelle logique ---

  const handlePhoneChange = (value: string, data: CountryData, field: 'center' | 'responsible') => {
    if (field === 'center') {
      setCenterPhone(value);
      setCenterSelectedCountryData(data);
    } else {
      setResponsiblePhone(value);
      setResponsibleSelectedCountryData(data);
    }
  };

   const handleSpecialtySelect = (specialty: { value: string; label: string }) => {
    if (selectedSpecialties.find(s => s.value === specialty.value)) {
      setSelectedSpecialties(selectedSpecialties.filter(s => s.value !== specialty.value));
    } else {
      setSelectedSpecialties([...selectedSpecialties, specialty]);
    }
  };

  const handleDayToggle = (day: string) => {
    if (openDays.includes(day)) {
      setOpenDays(openDays.filter(d => d !== day));
    } else {
      setOpenDays([...openDays, day]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Handle form submission logic here (e.g., send data to an API)
    console.log('Form submitted', {
      centerPhone,
      responsiblePhone,
      selectedSpecialties,
      openDays,
      openingTime,
      closingTime
    });

    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    setIsLoading(false);

    // Show success message
    toast({
      title: "Informations reçues",
      description: "Vos informations ont été bien reçues. Nous allons valider votre compte au plus tard dans 48h et vous faire un retour par mail.",
    });

    // Optional: Redirect after a short delay
    // setTimeout(() => {
    //   router.push('/');
    // }, 3000);
  };

  const nextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    setCurrentStep(currentStep - 1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-light-gray">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Inscription d'un centre de santé</h1>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* 1. Identification du centre */}
          {currentStep === 1 && (
            <div className="p-6 border rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">1. Identification du centre</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="centerName">Nom du centre</Label>
                  <Input id="centerName" placeholder="Nom du centre" />
                </div>
                <div>
                  <Label htmlFor="structureType">Type de structure</Label>
                  <Select>
                    <SelectTrigger id="structureType">
                      <SelectValue placeholder="Sélectionner le type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="cabinet">Cabinet médical</SelectItem>
                      <SelectItem value="clinique">Clinique</SelectItem>
                      <SelectItem value="centre">Centre de santé</SelectItem>
                      {/* Add other relevant types */}
                    </SelectContent>
                  </Select>
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="address">Adresse complète</Label>
                  <Input id="address" placeholder="Adresse complète" />
                </div>
                <div>
                  <Label htmlFor="departement">Département</Label>
                  <Select onValueChange={setSelectedDepartement} value={selectedDepartement || ""}>
                    <SelectTrigger id="departement" disabled={isLoadingData}>
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {departements.map((dep) => (
                        <SelectItem key={dep.value} value={dep.value}>{dep.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                 <div>
                  <Label htmlFor="commune">Commune</Label>
                  <Select disabled={!selectedDepartement || isLoadingData}>
                    <SelectTrigger id="commune">
                      <SelectValue placeholder="Sélectionner" />
                    </SelectTrigger>
                    <SelectContent>
                      {filteredCommunes.map((com) => (
                        <SelectItem key={com.value} value={com.value}>{com.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="centerPhone">Téléphone du centre</Label>
                  <PhoneInput
                    country={'bj'}
                    value={centerPhone}
                    onChange={(value, data) => handlePhoneChange(value, data as CountryData, 'center')}
                    inputProps={{
                      required: true,
                      id: 'centerPhone'
                    }}
                    containerClass="w-full"
                    inputClass="flex !h-10 !w-full rounded-md border !border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 !rounded-r-md"
                    buttonClass="!rounded-l-md !border-r-0 !border-input !bg-background hover:!bg-accent"
                    dropdownClass="!bg-popover !border-border"
                    searchClass="!bg-popover !text-popover-foreground"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label htmlFor="email">Adresse email du centre</Label>
                  <Input id="email" type="email" placeholder="Adresse email du centre" />
                </div>
              </div>
            </div>
          )}

          {/* 3. Informations légales */}
          {currentStep === 1 && (
            <div className="p-6 border rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">2. Informations légales</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="agreementNumber">Numéro d'agrément ou autorisation d'ouverture</Label>
                  <Input id="agreementNumber" placeholder="Numéro d'agrément" />
                </div>
                <div>
                  <Label htmlFor="nifNumber">Numéro d'Identification Fiscale (NIF)</Label>
                  <Input id="nifNumber" placeholder="Numéro NIF" />
                </div>
              </div>
            </div>
          )}

          {/* 4. Services proposés */}
          {currentStep === 1 && (
            <div className="p-6 border rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">3. Services proposés</h2>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="medicalSpecialties">Spécialités médicales disponibles</Label>
                   <Command className="overflow-visible bg-transparent">
                      <div className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2">
                        <div className="flex flex-wrap gap-1">
                          {selectedSpecialties.map((specialty) => (
                            <Badge key={specialty.value} variant="secondary">
                              {specialty.label}
                              <button
                                className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                                onMouseDown={(e) => e.preventDefault()}
                                onClick={() => handleSpecialtySelect(specialty)}
                              >
                                <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                              </button>
                            </Badge>
                          ))}
                           <CommandPrimitive.Input
                              placeholder="Sélectionner les spécialités..."
                              className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground"
                            />
                        </div>
                      </div>
                      <CommandList>
                        <CommandGroup className="mt-2">
                          {medicalSpecialtiesList
                             .filter(specialty => !selectedSpecialties.some(s => s.value === specialty.value))
                             .map((specialty) => (
                            <CommandItem
                              key={specialty.value}
                              onSelect={() => handleSpecialtySelect(specialty)}
                              className="cursor-pointer"
                            >
                              {specialty.label}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox id="teleconsultation" />
                  <Label htmlFor="teleconsultation">Téléconsultation disponible ?</Label>
                </div>
              </div>
            </div>
          )}

          {/* Documents justificatifs */}
          {currentStep === 1 && (
            <div className="p-6 border rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">4. Documents justificatifs obligatoires</h2>
              <p className="text-sm text-gray-500 mb-4">Veuillez scanner ou prendre en photo les documents suivants :</p>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="openingAuthorization">Autorisation d'ouverture du centre</Label>
                  <Input id="openingAuthorization" type="file" />
                </div>
                <div>
                  <Label htmlFor="responsibleId">Carte d'identité du responsable</Label>
                  <Input id="responsibleId" type="file" />
                </div>
                <div>
                  <Label htmlFor="centerLogo">Logo du centre (Facultatif)</Label>
                  <Input id="centerLogo" type="file" />
                </div>
                <div>
                  <Label htmlFor="centerPhotos">Photos du centre (Facultatif)</Label>
                  <Input id="centerPhotos" type="file" multiple />
                </div>
              </div>
            </div>
          )}

          {/* 2. Responsable du centre */}
          {currentStep === 2 && (
            <div className="p-6 border rounded-lg shadow-sm">
              <h2 className="text-xl font-semibold mb-4">5. Responsable du centre</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="responsibleLastName">Nom</Label>
                  <Input id="responsibleLastName" placeholder="Nom du responsable" />
                </div>
                <div>
                  <Label htmlFor="responsibleFirstName">Prénom</Label>
                  <Input id="responsibleFirstName" placeholder="Prénom du responsable" />
                </div>
                <div>
                  <Label htmlFor="responsibleFunction">Fonction</Label>
                  <Input id="responsibleFunction" placeholder="Fonction (ex : Médecin Directeur)" />
                </div>
                <div>
                  <Label htmlFor="responsiblePhone">Numéro de téléphone</Label>
                  <PhoneInput
                    country={'bj'}
                    value={responsiblePhone}
                    onChange={(value, data) => handlePhoneChange(value, data as CountryData, 'responsible')}
                    inputProps={{
                      required: true,
                      id: 'responsiblePhone'
                    }}
                    containerClass="w-full"
                    inputClass="flex !h-10 !w-full rounded-md border !border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 !rounded-r-md"
                    buttonClass="!rounded-l-md !border-r-0 !border-input !bg-background hover:!bg-accent"
                    dropdownClass="!bg-popover !border-border"
                    searchClass="!bg-popover !text-popover-foreground"
                  />
                </div>
                <div>
                  <Label htmlFor="responsibleEmail">Adresse email</Label>
                  <Input id="responsibleEmail" type="email" placeholder="Adresse email du responsable" />
                </div>
              </div>
            </div>
          )}

          {/* Navigation buttons */}
          <div className={`flex mt-6 ${currentStep === 1 ? 'justify-end' : 'justify-between'}`}>
            {currentStep > 1 && (
              <Button type="button" onClick={prevStep} variant="outline" disabled={isLoading}>
                Précédent
              </Button>
            )}
            {currentStep < 2 && (
              <Button type="button" onClick={nextStep} disabled={isLoadingData}>
                Suivant
              </Button>
            )}
            {currentStep === 2 && (
              <Button type="submit" disabled={isLoading || isLoadingData}>
                {isLoading ? "Envoi en cours..." : "Inscrire le centre"}
              </Button>
            )}
          </div>

        </form>
      </main>
      <Footer />
    </div>
  );
};

export default RegisterCenterPage; 