"use client";

import { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import PhoneInput from 'react-phone-input-2';
import type { CountryData } from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { useToast } from "@/components/ui/use-toast";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { validatePhone } from '@/app/utils/validations/registerValidations';
import { pharmacyApi } from '@/lib/api/pharmacy';

const servicesList = [
  { value: "consultation", label: "Consultation" },
  { value: "vente-medicaments", label: "Vente de médicaments" },
  { value: "tests-rapides", label: "Tests rapides" },
];

const daysOfWeek = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi', 'Dimanche'];

interface Horaires {
  is24h: boolean;
  lundiVendredi: {
    isOpen: boolean;
    debut: string;
    fin: string;
  };
  samedi: {
    isOpen: boolean;
    debut: string;
    fin: string;
  };
  dimanche: {
    isOpen: boolean;
    debut: string;
    fin: string;
  };
}

const generateTimeOptions = () => {
  const options = [];
  for (let hour = 0; hour < 24; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
      options.push(time);
    }
  }
  return options;
};

const timeOptions = generateTimeOptions();

const RegisterPharmacyPage = () => {
  const { data: session } = useSession();
  const router = useRouter();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [pharmacyPhone, setPharmacyPhone] = useState('');
  const [selectedCountryData, setSelectedCountryData] = useState<CountryData | null>(null);
  const [phoneError, setPhoneError] = useState<string>('');
  const [selectedServices, setSelectedServices] = useState<string[]>([]);
  const [files, setFiles] = useState<File[]>([]);
  const [horaires, setHoraires] = useState<Horaires>({
    is24h: true,
    lundiVendredi: {
      isOpen: true,
      debut: '08:00',
      fin: '20:00'
    },
    samedi: {
      isOpen: true,
      debut: '08:00',
      fin: '20:00'
    },
    dimanche: {
      isOpen: true,
      debut: '08:00',
      fin: '20:00'
    }
  });

  const [formData, setFormData] = useState({
    name: '',
    address: '',
  });

  useEffect(() => {
    setSelectedCountryData({ countryCode: 'bj', dialCode: '229' } as CountryData);
  }, []);

  // Fonction de formatage personnalisée pour le numéro de téléphone
  const formatPhoneNumber = (value: string, countryData: CountryData | null) => {
    if (!value) return value;
    
    if (countryData && countryData.countryCode === 'bj') {
      const digitsOnly = value.replace(/\D/g, '');
      const dialCode = countryData.dialCode;
      const nationalNumber = digitsOnly.substring(dialCode.length);
      
      if (nationalNumber.length >= 2) {
        const firstPart = nationalNumber.substring(0, 2);
        const secondPart = nationalNumber.substring(2, 4);
        const thirdPart = nationalNumber.substring(4, 6);
        const fourthPart = nationalNumber.substring(6, 8);
        const fifthPart = nationalNumber.substring(8, 10);
        
        return `${dialCode} ${firstPart} ${secondPart} ${thirdPart} ${fourthPart} ${fifthPart}`.trim();
      }
    }
    
    return value;
  };

  const handlePhoneChange = (
    value: string,
    data: CountryData,
    event: React.ChangeEvent<HTMLInputElement>,
    formattedValue: string
  ) => {
    setPharmacyPhone(value);
    setSelectedCountryData(data);
    const result = validatePhone({ value, countryData: data });
    setPhoneError(result.errorMessage);
  };

  const handleServiceToggle = (service: string) => {
    if (selectedServices.includes(service)) {
      setSelectedServices(selectedServices.filter(s => s !== service));
    } else {
      setSelectedServices([...selectedServices, service]);
    }
  };

  const handleHorairesChange = (section: keyof Horaires, value: any) => {
    if (section === 'is24h') {
      setHoraires(prev => ({
        ...prev,
        is24h: value,
        lundiVendredi: {
          ...prev.lundiVendredi,
          isOpen: value
        },
        samedi: {
          ...prev.samedi,
          isOpen: value
        },
        dimanche: {
          ...prev.dimanche,
          isOpen: value
        }
      }));
    } else {
      setHoraires(prev => ({
        ...prev,
        [section]: {
          ...prev[section],
          ...value
        }
      }));
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const formDataToSend = new FormData();
      
      // Ajouter les services un par un
      selectedServices.forEach(service => {
        formDataToSend.append('services', service);
      });

      // Ajouter les horaires un par un
      if (horaires.is24h) {
        formDataToSend.append('horaires', 'Lundi-Vendredi: 24h/24');
        formDataToSend.append('horaires', 'Samedi: 24h/24');
        formDataToSend.append('horaires', 'Dimanche: 24h/24');
      } else {
        if (horaires.lundiVendredi?.isOpen) {
          formDataToSend.append('horaires', `Lundi-Vendredi: ${horaires.lundiVendredi?.debut}-${horaires.lundiVendredi?.fin}`);
        }
        if (horaires.samedi?.isOpen) {
          formDataToSend.append('horaires', `Samedi: ${horaires.samedi?.debut}-${horaires.samedi?.fin}`);
        }
        if (horaires.dimanche?.isOpen) {
          formDataToSend.append('horaires', `Dimanche: ${horaires.dimanche?.debut}-${horaires.dimanche?.fin}`);
        } else {
          formDataToSend.append('horaires', 'Dimanche: Fermé');
        }
      }

      // Ajouter les autres champs du formulaire
      formDataToSend.append('name', formData.name);
      formDataToSend.append('adress', formData.address);
      formDataToSend.append('telephone', `+${pharmacyPhone}`);
      formDataToSend.append('userUuid', session?.user?.id || '');

      await pharmacyApi.register(formDataToSend, files);

      toast({
        title: "Inscription réussie",
        description: "Votre pharmacie a été enregistrée avec succès. Nous allons valider votre compte dans les plus brefs délais.",
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
        <h1 className="text-2xl font-bold mb-6 text-center">Inscription d'une pharmacie</h1>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. Informations de base */}
          <div className="p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">1. Informations de base</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="name">Nom de la pharmacie</Label>
                <Input 
                  id="name" 
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Nom de la pharmacie" 
                  required
                />
              </div>
              <div>
                <Label htmlFor="address">Adresse</Label>
                <Input 
                  id="address" 
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  placeholder="Adresse complète" 
                  required
                />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <PhoneInput
                  country={'bj'}
                  value={pharmacyPhone}
                  onChange={handlePhoneChange}
                  inputProps={{
                    required: true,
                    id: 'phone',
                    onBlur: (e: React.FocusEvent<HTMLInputElement>) => {
                      const result = validatePhone({ value: e.target.value, countryData: selectedCountryData });
                      setPhoneError(result.errorMessage);
                    },
                    value: formatPhoneNumber(pharmacyPhone, selectedCountryData)
                  }}
                  containerClass={`w-full ${phoneError ? 'border-red-500 rounded-md' : ''}`}
                  inputClass="flex !h-10 !w-full rounded-md border !border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 !rounded-r-md"
                  buttonClass="!rounded-l-md !border-r-0 !border-input !bg-background hover:!bg-accent"
                  dropdownClass="!bg-popover !border-border"
                  searchClass="!bg-popover !text-popover-foreground"
                />
                {phoneError && <p className="text-red-500 text-sm">{phoneError}</p>}
              </div>
            </div>
          </div>

          {/* 2. Services disponibles */}
          <div className="p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">2. Services disponibles</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {servicesList.map((service) => (
                <div key={service.value} className="flex items-center space-x-2">
                  <Checkbox
                    id={service.value}
                    checked={selectedServices.includes(service.value)}
                    onCheckedChange={() => handleServiceToggle(service.value)}
                  />
                  <Label htmlFor={service.value}>{service.label}</Label>
                </div>
              ))}
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

          {/* 4. Horaires d'ouverture */}
          <div className="p-6 border rounded-lg shadow-sm">
            <h2 className="text-xl font-semibold mb-4">4. Horaires d'ouverture</h2>
            <div className="space-y-6">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="24h"
                  checked={horaires.is24h}
                  onCheckedChange={(checked) => handleHorairesChange('is24h', checked)}
                />
                <Label htmlFor="24h">Ouvert 24h/24</Label>
              </div>
              
              {!horaires.is24h && (
                <div className="space-y-6">
                  {/* Lundi au Vendredi */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="lundi-vendredi"
                        checked={horaires.lundiVendredi?.isOpen}
                        onCheckedChange={(checked) => handleHorairesChange('lundiVendredi', { isOpen: checked })}
                      />
                      <Label htmlFor="lundi-vendredi">Du lundi au vendredi</Label>
                    </div>
                    {horaires.lundiVendredi?.isOpen && (
                      <div className="grid grid-cols-2 gap-4 ml-6">
                        <div>
                          <Label>Heure de début</Label>
                          <Select
                            value={horaires.lundiVendredi?.debut}
                            onValueChange={(value) => handleHorairesChange('lundiVendredi', { debut: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner l'heure" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Heure de fin</Label>
                          <Select
                            value={horaires.lundiVendredi?.fin}
                            onValueChange={(value) => handleHorairesChange('lundiVendredi', { fin: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner l'heure" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Samedi */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="samedi"
                        checked={horaires.samedi?.isOpen}
                        onCheckedChange={(checked) => handleHorairesChange('samedi', { isOpen: checked })}
                      />
                      <Label htmlFor="samedi">Samedi</Label>
                    </div>
                    {horaires.samedi?.isOpen && (
                      <div className="grid grid-cols-2 gap-4 ml-6">
                        <div>
                          <Label>Heure de début</Label>
                          <Select
                            value={horaires.samedi?.debut}
                            onValueChange={(value) => handleHorairesChange('samedi', { debut: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner l'heure" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Heure de fin</Label>
                          <Select
                            value={horaires.samedi?.fin}
                            onValueChange={(value) => handleHorairesChange('samedi', { fin: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner l'heure" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Dimanche */}
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="dimanche"
                        checked={horaires.dimanche?.isOpen}
                        onCheckedChange={(checked) => handleHorairesChange('dimanche', { isOpen: checked })}
                      />
                      <Label htmlFor="dimanche">Dimanche</Label>
                    </div>
                    {horaires.dimanche?.isOpen && (
                      <div className="grid grid-cols-2 gap-4 ml-6">
                        <div>
                          <Label>Heure de début</Label>
                          <Select
                            value={horaires.dimanche?.debut}
                            onValueChange={(value) => handleHorairesChange('dimanche', { debut: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner l'heure" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label>Heure de fin</Label>
                          <Select
                            value={horaires.dimanche?.fin}
                            onValueChange={(value) => handleHorairesChange('dimanche', { fin: value })}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Sélectionner l'heure" />
                            </SelectTrigger>
                            <SelectContent>
                              {timeOptions.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? "Enregistrement en cours..." : "Enregistrer la pharmacie"}
          </Button>
        </form>
      </main>
      <Footer />
    </div>
  );
};

export default RegisterPharmacyPage; 