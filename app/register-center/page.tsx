"use client";

import { useState, useEffect, useRef } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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
import { healthCenterApi } from '@/lib/api/healthCenter';
import { HealthCenter } from '@/lib/api/types';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import LoadingSpinner from "@/components/ui/loading-spinner"

const medicalSpecialtiesList = [
  { value: "medecine-generale", label: "Médecine Générale" },
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
  { value: "gastro-enterologie", label: "Gastro-entérologie et Hépatologie" },
  { value: "pneumologie", label: "Pneumologie" },
  { value: "rhumatologie", label: "Rhumatologie" },
  { value: "endocrinologie", label: "Endocrinologie-Diabétologie-Nutrition" },
  { value: "nephrologie", label: "Néphrologie" },
  { value: "oncologie", label: "Oncologie" },
  { value: "chirurgie-generale", label: "Chirurgie Générale et Digestive" },
  { value: "chirurgie-orthopedique", label: "Chirurgie Orthopédique et Traumatologique" },
  { value: "medecine-urgence", label: "Médecine d'Urgence" },
  { value: "kinesitherapie", label: "Kinésithérapie" },
  { value: "dentaire", label: "Chirurgie Dentaire" },
];

const structureTypes = [
  { value: "HOSPITAL", label: "Hôpital" },
  { value: "CLINIC", label: "Clinique" },
  { value: "HEALTH_CENTER", label: "Centre de santé" },
  { value: "DOCTOR_OFFICE", label: "Cabinet médical" }
];

const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

const RegisterCenterPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const [centerPhone, setCenterPhone] = useState('');
  const [centerSelectedCountryData, setCenterSelectedCountryData] = useState<CountryData | null>(null);
  const [selectedSpecialties, setSelectedSpecialties] = useState<{ value: string; label: string }[]>([]);
  const [isSpecialtiesOpen, setIsSpecialtiesOpen] = useState(false);
  const [openDays, setOpenDays] = useState<string[]>([]);
  const [openingTime, setOpeningTime] = useState('');
  const [closingTime, setClosingTime] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [location, setLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [isGettingLocation, setIsGettingLocation] = useState(false);

  // --- États pour les données administratives ---
  const [departements, setDepartements] = useState<{ value: string; label: string }[]>([]);
  const [communesData, setCommunesData] = useState<DepartementData[]>([]); // Stocke les données brutes
  const [selectedDepartement, setSelectedDepartement] = useState<string | null>(null);
  const [filteredCommunes, setFilteredCommunes] = useState<{ value: string; label: string }[]>([]);
  const [isLoadingData, setIsLoadingData] = useState(true); // État de chargement
  // --- Fin des États ---

  const { toast } = useToast();

  const commandRef = useRef<HTMLDivElement>(null);

  const [files, setFiles] = useState<File[]>([]);
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    fullAddress: '',
    department: '',
    municipality: '',
    email: '',
  });

  useEffect(() => {
    // Default to Benin if needed
    setCenterSelectedCountryData({ countryCode: 'bj', dialCode: '229' } as CountryData);

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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (commandRef.current && !commandRef.current.contains(event.target as Node)) {
        setIsSpecialtiesOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // --- Nouvelle logique pour filtrer les communes par département ---
  useEffect(() => {
    if (selectedDepartement) {
      const departement = communesData.find(dep => 
        dep.departement.toLowerCase().replace(/[^a-z0-9]/g, '') === selectedDepartement
      );
      
      if (departement) {
        const formattedCommunes = departement.communes.map(com => ({
          value: com.toLowerCase().replace(/[^a-z0-9]/g, ''),
          label: com
        }));
        setFilteredCommunes(formattedCommunes);
      } else {
        setFilteredCommunes([]);
      }
    } else {
      setFilteredCommunes([]);
    }
  }, [selectedDepartement, communesData]);
  // --- Fin de la nouvelle logique ---

  const handlePhoneChange = (value: string, data: CountryData) => {
    setCenterPhone(`+${value}`);
    setCenterSelectedCountryData(data);
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFiles(prev => {
        const newFiles = [...prev];
        const fileIndex = ['extraitRegistreDeCommerce', 'attestationImatriculation', 'annonceLegale', 'declaration_etablissement_de_entreprise', 'carteProfessionnelle'].indexOf(fieldName);
        if (fileIndex !== -1) {
          newFiles[fileIndex] = file;
        }
        return newFiles;
      });
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

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
      timeout: 50000, // Augmente le timeout à 10 secondes
      maximumAge: 0 // Ne pas utiliser de position en cache
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!location) {
      toast({
        title: "Erreur",
        description: "Vous devez obtenir votre localisation avant de soumettre le formulaire",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Ajouter les services un par un
      selectedSpecialties.forEach(specialty => {
        formDataToSend.append('services', specialty.label);
      });

      // Ajouter les autres champs du formulaire
      formDataToSend.append('name', formData.name);
      formDataToSend.append('type', formData.type);
      formDataToSend.append('fullAddress', formData.fullAddress);
      formDataToSend.append('department', formData.department);
      formDataToSend.append('municipality', formData.municipality);
      formDataToSend.append('email', formData.email);
      formDataToSend.append('phoneNumber', centerPhone);
      formDataToSend.append('userUuid', session?.user?.id || '');
      formDataToSend.append('latitude', location.latitude.toString());
      formDataToSend.append('longitude', location.longitude.toString());

      await healthCenterApi.register(formDataToSend, files);

      toast({
        title: "Inscription réussie",
        description: "Votre centre de santé a été enregistré avec succès. Nous allons valider votre compte dans les plus brefs délais.",
      });

      router.push('/dashboard/patient');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'enregistrement. Veuillez réessayer.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-light-gray">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Inscription d'un centre de santé</h1>
        
        {/* Message de géolocalisation */}
        <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-blue-800 mb-2">
            Pour une meilleure expérience, nous avons besoin de votre localisation. 
            Veuillez vous assurer d'être physiquement présent dans le centre de santé 
            avant de continuer.
          </p>
          <div className="flex items-center gap-4">
            <Button 
              onClick={getLocation} 
              disabled={isGettingLocation}
              variant="outline"
            >
              {isGettingLocation ? (
                <div className="flex items-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  <span>Obtention de la localisation...</span>
                </div>
              ) : "Obtenir ma localisation"}
            </Button>
            {location && (
              <span className="text-sm text-green-600">
                Localisation obtenue ✓
              </span>
            )}
          </div>
          {locationError && (
            <p className="text-red-600 text-sm mt-2">{locationError}</p>
          )}
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Identification du centre */}
          <div className="p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">1. Identification du centre</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nom du centre</Label>
                <Input 
                  id="name" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nom du centre" 
                  required
                />
              </div>
              <div>
                <Label htmlFor="type">Type de structure</Label>
                <Select 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value }))}
                  value={formData.type}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Sélectionner le type" />
                  </SelectTrigger>
                  <SelectContent>
                    {structureTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="md:col-span-2">
                <Label htmlFor="fullAddress">Adresse complète</Label>
                <Input 
                  id="fullAddress" 
                  name="fullAddress"
                  value={formData.fullAddress}
                  onChange={handleInputChange}
                  placeholder="Adresse complète" 
                  required
                />
              </div>
              <div>
                <Label htmlFor="department">Département</Label>
                <Select 
                  onValueChange={(value) => {
                    setFormData(prev => ({ ...prev, department: value }));
                    setSelectedDepartement(value);
                  }}
                  value={formData.department}
                >
                  <SelectTrigger id="department" disabled={isLoadingData}>
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
                <Label htmlFor="municipality">Commune</Label>
                <Select 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, municipality: value }))}
                  value={formData.municipality}
                  disabled={!formData.department || isLoadingData}
                >
                  <SelectTrigger id="municipality">
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
                <Label htmlFor="phoneNumber">Téléphone du centre</Label>
                <PhoneInput
                  country={'bj'}
                  value={centerPhone}
                  onChange={(value, data) => handlePhoneChange(value, data as CountryData)}
                  inputProps={{
                    required: true,
                    id: 'phoneNumber',
                    name: 'phoneNumber'
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
                <Input 
                  id="email" 
                  name="email"
                  type="email" 
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Adresse email du centre" 
                  required
                />
              </div>
            </div>
          </div>

          {/* 2. Services proposés */}
          <div className="p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">2. Services proposés</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="medicalSpecialties">Spécialités médicales disponibles</Label>
                <Command className="overflow-visible bg-transparent" ref={commandRef}>
                  <div 
                    className="group rounded-md border border-input px-3 py-2 text-sm ring-offset-background focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 cursor-pointer"
                    onClick={() => setIsSpecialtiesOpen(!isSpecialtiesOpen)}
                  >
                    <div className="flex flex-wrap gap-1">
                      {selectedSpecialties.map((specialty) => (
                        <Badge key={specialty.value} variant="secondary">
                          {specialty.label}
                          <button
                            className="ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={(e) => {
                              e.stopPropagation();
                              handleSpecialtySelect(specialty);
                            }}
                          >
                            <X className="h-3 w-3 text-muted-foreground hover:text-foreground" />
                          </button>
                        </Badge>
                      ))}
                      <CommandPrimitive.Input
                        placeholder="Sélectionner les spécialités..."
                        className="ml-2 flex-1 bg-transparent outline-none placeholder:text-muted-foreground cursor-pointer"
                        onFocus={() => setIsSpecialtiesOpen(true)}
                      />
                    </div>
                  </div>
                  {isSpecialtiesOpen && (
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
                  )}
                </Command>
              </div>
            </div>
          </div>

          {/* 3. Documents justificatifs */}
          <div className="p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">3. Documents justificatifs obligatoires</h2>
            <p className="text-sm text-gray-500 mb-4">Veuillez scanner ou prendre en photo les documents suivants (format PDF ou image) :</p>
            <div className="space-y-4">
              <div>
                <Label htmlFor="extraitRegistreDeCommerce">Extrait du registre de commerce</Label>
                <Input 
                  id="extraitRegistreDeCommerce" 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  required 
                  className="cursor-pointer"
                  onChange={(e) => handleFileChange(e, 'extraitRegistreDeCommerce')}
                />
                <p className="text-sm text-gray-500 mt-1">Document officiel attestant de l'enregistrement de votre entreprise</p>
              </div>
              <div>
                <Label htmlFor="attestationImatriculation">Attestation d'immatriculation</Label>
                <Input 
                  id="attestationImatriculation" 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  required 
                  className="cursor-pointer"
                  onChange={(e) => handleFileChange(e, 'attestationImatriculation')}
                />
                <p className="text-sm text-gray-500 mt-1">Document attestant de l'immatriculation de votre établissement</p>
              </div>
              <div>
                <Label htmlFor="annonceLegale">Annonce légale</Label>
                <Input 
                  id="annonceLegale" 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  required 
                  className="cursor-pointer"
                  onChange={(e) => handleFileChange(e, 'annonceLegale')}
                />
                <p className="text-sm text-gray-500 mt-1">Publication légale de la création de votre établissement</p>
              </div>
              <div>
                <Label htmlFor="declaration_etablissement_de_entreprise">Déclaration d'établissement d'entreprise</Label>
                <Input 
                  id="declaration_etablissement_de_entreprise" 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  required 
                  className="cursor-pointer"
                  onChange={(e) => handleFileChange(e, 'declaration_etablissement_de_entreprise')}
                />
                <p className="text-sm text-gray-500 mt-1">Document officiel de déclaration de votre établissement</p>
              </div>
              <div>
                <Label htmlFor="carteProfessionnelle">Carte professionnelle</Label>
                <Input 
                  id="carteProfessionnelle" 
                  type="file" 
                  accept=".pdf,.jpg,.jpeg,.png"
                  required 
                  className="cursor-pointer"
                  onChange={(e) => handleFileChange(e, 'carteProfessionnelle')}
                />
                <p className="text-sm text-gray-500 mt-1">Carte professionnelle du responsable de l'établissement</p>
              </div>
            </div>
          </div>

          {/* Bouton de soumission */}
          <div className="flex justify-center mt-6">
            <Button 
              type="submit" 
              disabled={isLoading || isLoadingData || !location}
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <LoadingSpinner size="sm" className="mr-2" />
                  <span>Envoi en cours...</span>
                </div>
              ) : "Inscrire le centre"}
            </Button>
          </div>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default RegisterCenterPage; 