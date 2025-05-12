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

  const { toast } = useToast();

  useEffect(() => {
    // Default to Benin if needed
    setCenterSelectedCountryData({ countryCode: 'bj', dialCode: '229' } as CountryData);
    setResponsibleSelectedCountryData({ countryCode: 'bj', dialCode: '229' } as CountryData);
  }, []);

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

  return (
    <div className="flex flex-col min-h-screen bg-neutral-light-gray">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8 max-w-3xl">
        <h1 className="text-2xl font-bold mb-6 text-center">Inscription d'un centre de santé</h1>
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* 1. Identification du centre */}
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
                <Select>
                  <SelectTrigger id="departement">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="atlantique">Atlantique</SelectItem>
                    <SelectItem value="littoral">Littoral</SelectItem>
                    {/* Add more communes/départements */}
                  </SelectContent>
                </Select>
              </div>
               <div>
                <Label htmlFor="commune">Commune</Label>
                <Select>
                  <SelectTrigger id="commune">
                    <SelectValue placeholder="Sélectionner" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* Options will depend on selected department */}
                     <SelectItem value="cotonou">Cotonou</SelectItem>
                    <SelectItem value="abomey-calavi">Abomey-Calavi</SelectItem>
                    {/* Add more communes/départements */}
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

          {/* 2. Responsable du centre */}
          <div className="p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">2. Responsable du centre</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="responsibleName">Nom et prénom</Label>
                <Input id="responsibleName" placeholder="Nom et prénom du responsable" />
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

          {/* 3. Informations légales */}
          <div className="p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">3. Informations légales</h2>
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

          {/* 4. Services proposés */}
          <div className="p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">4. Services proposés</h2>
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

          {/* 5. Horaires d'ouverture */}
          <div className="p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">5. Horaires d'ouverture</h2>
            <div className="space-y-4">
              <div>
                <Label>Jours d'ouverture</Label>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                  {daysOfWeek.map(day => (
                    <div key={day} className="flex items-center space-x-2">
                      <Checkbox
                        id={`day-${day}`}
                        checked={openDays.includes(day)}
                        onCheckedChange={() => handleDayToggle(day)}
                      />
                      <Label htmlFor={`day-${day}`}>{day}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div>
                   <Label htmlFor="openingTime">Heure d'ouverture</Label>
                   <Input id="openingTime" type="time" value={openingTime} onChange={(e) => setOpeningTime(e.target.value)} />
                 </div>
                 <div>
                   <Label htmlFor="closingTime">Heure de fermeture</Label>
                   <Input id="closingTime" type="time" value={closingTime} onChange={(e) => setClosingTime(e.target.value)} />
                 </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">Sélectionnez les jours et indiquez les heures d'ouverture et de fermeture globales.</p>
            </div>
          </div>

          {/* Documents justificatifs */}
          <div className="p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">Documents justificatifs obligatoires</h2>
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

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Envoi en cours..." : "Inscrire le centre"}
          </Button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default RegisterCenterPage; 