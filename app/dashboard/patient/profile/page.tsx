'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { CalendarIcon, Eye, EyeOff, Camera, UserCircle2 } from "lucide-react"; // Ajout d'icônes utiles
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"; // Import des composants Avatar

// Interface (potentielle) pour les données du profil patient
interface PatientProfileData {
  fullName: string;
  dateOfBirth: Date | undefined;
  gender: string;
  placeOfBirth?: string;
  currentAddress: string;
  phone: string;
  email: string;
  profession?: string;
  // Informations administratives
  uniqueId?: string;
  emergencyContactName?: string;
  emergencyContactRelation?: string;
  emergencyContactPhone?: string;
  treatingPhysician?: string;
  insuranceInfo?: string;
  // Antécédents médicaux personnels
  chronicDiseases?: string;
  majorSurgeries?: string;
  hospitalizations?: string;
  allergies?: string;
  bloodType?: string;
  // Antécédents familiaux
  familyMedicalHistory?: string;
  // Image de profil
  profileImageUrl?: string;
}

// Données fictives pour le profil
const mockProfileData: PatientProfileData = {
  fullName: "Alice Dubois",
  dateOfBirth: new Date(1990, 5, 15), // Année, Mois (0-11), Jour
  gender: "female",
  placeOfBirth: "Lyon",
  currentAddress: "45 Rue de la République, 69002 Lyon",
  phone: "0611223344",
  email: "alice.dubois@example.com",
  profession: "Développeuse",
  uniqueId: "123456789012345",
  emergencyContactName: "Bob Dubois",
  emergencyContactRelation: "Mari",
  emergencyContactPhone: "0699887766",
  treatingPhysician: "Dr. Sophie Martin",
  insuranceInfo: "Assurance Maladie - N° XXXXXX",
  chronicDiseases: "Aucune",
  majorSurgeries: "Appendicectomie (2010)",
  hospitalizations: "Aucune",
  allergies: "Pénicilline",
  bloodType: "A+",
  familyMedicalHistory: "Antécédents de diabète type 2 côté maternel.",
  profileImageUrl: "/placeholder-avatar.png", // Utilisez une image placeholder si vous en avez une
};

export default function PatientProfilePage() {
  const [profileData, setProfileData] = useState<PatientProfileData>(mockProfileData);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const [showPassword, setShowPassword] = useState(false); // Pour un potentiel champ de mot de passe (non requis par le prompt, mais utile si on l'ajoute)

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: keyof PatientProfileData, value: string) => {
    setProfileData((prev) => ({ ...prev, [name]: value }));
  };

   const handleDateChange = (date: Date | undefined) => {
    setProfileData((prev) => ({ ...prev, dateOfBirth: date }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImageFile(e.target.files[0]);
      // Optionnel: Afficher un aperçu de l'image si nécessaire
      // const reader = new FileReader();
      // reader.onload = (event) => { setProfileData(prev => ({...prev, profileImageUrl: event.target?.result as string})) };
      // reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    // TODO: Implémenter la logique de sauvegarde (appel API, etc.)
    console.log("Sauvegarde des données du profil :", profileData);
     if (profileImageFile) {
      console.log("Fichier image de profil à uploader :", profileImageFile);
      // TODO: Logique d'upload de l'image
    }
    await new Promise(resolve => setTimeout(resolve, 1500)); // Simuler une attente
    setIsSaving(false);
    alert("Profil sauvegardé (simulation)!"); // Remplacer par un Toast
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-primary-blue mb-6">Mon Profil</h1>

      {/* Section Informations d'identification de base */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informations d'identification de base</CardTitle>
          <CardDescription>Modifiez vos informations personnelles essentielles.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar / Upload */}
          <div className="flex items-center space-x-4">
            <Avatar className="w-20 h-20">
              {/* Utilise l'image uploadée en priorité, sinon l'URL existante, sinon un fallback */}
              <AvatarImage src={profileImageFile ? URL.createObjectURL(profileImageFile) : profileData.profileImageUrl} alt="Avatar" />
               <AvatarFallback>
                {profileData.fullName ? profileData.fullName.split(' ').map(n => n[0]).join('').substring(0, 2) : <UserCircle2 className="w-full h-full text-neutral-medium-gray" />}
              </AvatarFallback>
            </Avatar>
            <div>
              <Label htmlFor="profile-image">Image de profil</Label>
              <Input id="profile-image" type="file" accept="image/*" onChange={handleFileChange} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fullName">Nom complet</Label>
              <Input id="fullName" name="fullName" value={profileData.fullName} onChange={handleInputChange} />
            </div>
             <div className="space-y-2">
              <Label htmlFor="dateOfBirth">Date de naissance</Label>
               <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={"outline"}
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !profileData.dateOfBirth && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {profileData.dateOfBirth ? format(profileData.dateOfBirth, "PPP", { locale: fr }) : <span>Sélectionner une date</span>}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={profileData.dateOfBirth}
                    onSelect={(date) => handleDateChange(date)}
                    initialFocus
                    locale={fr}
                  />
                </PopoverContent>
              </Popover>
            </div>
            <div className="space-y-2">
              <Label htmlFor="gender">Sexe</Label>
               <Select onValueChange={(value) => handleSelectChange('gender', value)} value={profileData.gender}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner le sexe" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="male">Homme</SelectItem>
                  <SelectItem value="female">Femme</SelectItem>
                  <SelectItem value="other">Autre</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="placeOfBirth">Lieu de naissance</Label>
              <Input id="placeOfBirth" name="placeOfBirth" value={profileData.placeOfBirth} onChange={handleInputChange} />
            </div>
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="currentAddress">Adresse actuelle</Label>
              <Input id="currentAddress" name="currentAddress" value={profileData.currentAddress} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone">Numéro de téléphone</Label>
              <Input id="phone" name="phone" type="tel" value={profileData.phone} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Adresse e-mail</Label>
              <Input id="email" name="email" type="email" value={profileData.email} onChange={handleInputChange} disabled /> {/* Email souvent non modifiable */}
            </div>
             <div className="space-y-2">
              <Label htmlFor="profession">Profession (facultatif)</Label>
              <Input id="profession" name="profession" value={profileData.profession} onChange={handleInputChange} />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Informations administratives et sociales */}
       <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informations administratives et sociales</CardTitle>
          <CardDescription>Ajoutez ou modifiez vos informations administratives et de contact d'urgence.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="space-y-2">
              <Label htmlFor="uniqueId">Numéro d'identification unique (ex: Sécurité Sociale)</Label>
              <Input id="uniqueId" name="uniqueId" value={profileData.uniqueId} onChange={handleInputChange} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="treatingPhysician">Médecin traitant (facultatif)</Label>
              <Input id="treatingPhysician" name="treatingPhysician" value={profileData.treatingPhysician} onChange={handleInputChange} />
            </div>
             <div className="md:col-span-2 space-y-2">
              <Label htmlFor="insuranceInfo">Informations sur la couverture sociale/assurance maladie</Label>
              <Input id="insuranceInfo" name="insuranceInfo" value={profileData.insuranceInfo} onChange={handleInputChange} />
            </div>
          </div>
          <div className="space-y-2 border-t pt-4 mt-4">
             <h3 className="text-lg font-semibold">Personne à contacter en cas d'urgence</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Nom</Label>
                <Input id="emergencyContactName" name="emergencyContactName" value={profileData.emergencyContactName} onChange={handleInputChange} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactRelation">Lien de parenté</Label>
                <Input id="emergencyContactRelation" name="emergencyContactRelation" value={profileData.emergencyContactRelation} onChange={handleInputChange} />
              </div>
               <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">Numéro de téléphone</Label>
                <Input id="emergencyContactPhone" name="emergencyContactPhone" type="tel" value={profileData.emergencyContactPhone} onChange={handleInputChange} />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Antécédents médicaux personnels majeurs */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Antécédents médicaux personnels majeurs</CardTitle>
          <CardDescription>Listez vos maladies chroniques, chirurgies, hospitalisations et allergies.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="chronicDiseases">Maladies chroniques diagnostiquées</Label>
            <Input id="chronicDiseases" name="chronicDiseases" value={profileData.chronicDiseases} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="majorSurgeries">Interventions chirurgicales majeures</Label>
            <Input id="majorSurgeries" name="majorSurgeries" value={profileData.majorSurgeries} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hospitalizations">Hospitalisations significatives</Label>
            <Input id="hospitalizations" name="hospitalizations" value={profileData.hospitalizations} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies connues</Label>
            <Input id="allergies" name="allergies" value={profileData.allergies} onChange={handleInputChange} />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bloodType">Groupe sanguin et Rhésus</Label>
             <Select onValueChange={(value) => handleSelectChange('bloodType', value)} value={profileData.bloodType}>
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Sélectionner le groupe sanguin" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A+">A+</SelectItem>
                  <SelectItem value="A-">A-</SelectItem>
                  <SelectItem value="B+">B+</SelectItem>
                  <SelectItem value="B-">B-</SelectItem>
                  <SelectItem value="AB+">AB+</SelectItem>
                  <SelectItem value="AB-">AB-</SelectItem>
                  <SelectItem value="O+">O+</SelectItem>
                  <SelectItem value="O-">O-</SelectItem>
                </SelectContent>
              </Select>
          </div>
        </CardContent>
      </Card>

      {/* Section Antécédents familiaux pertinents */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Antécédents familiaux pertinents</CardTitle>
          <CardDescription>Informations sur les maladies héréditaires ou à forte composante génétique dans votre famille.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="familyMedicalHistory">Décrivez les antécédents familiaux pertinents</Label>
             <Input id="familyMedicalHistory" name="familyMedicalHistory" value={profileData.familyMedicalHistory} onChange={handleInputChange} /> {/* Peut-être un textarea pour plus d'espace */}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? 'Sauvegarde...' : 'Sauvegarder les modifications'}
        </Button>
      </div>
    </div>
  );
} 