"use client";

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CalendarIcon, Eye, EyeOff, Camera, UserCircle2 } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useSession } from "next-auth/react";
import { userApi, UserProfile } from "@/lib/apiClient";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast"

// Interface pour les données du profil patient
interface PatientProfileData {
  firstName: string;
  lastName: string;
  dateOfBirth: Date | undefined;
  gender: string;
  placeOfBirth?: string;
  currentAddress?: string;
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

export default function PatientProfilePage() {
  const { data: session } = useSession();
  const [profileData, setProfileData] = useState<PatientProfileData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast()

  useEffect(() => {
    const fetchProfileData = async () => {
      if (!session?.user?.id) return;
      
      try {
        setIsLoading(true);
        const userData = await userApi.getProfile(session.user.id);
        
        // Transformer les données de l'API en format PatientProfileData
        const transformedData: PatientProfileData = {
          firstName: userData.firstName,
          lastName: userData.lastName,
          dateOfBirth: new Date(userData.birthDate),
          gender: userData.gender,
          phone: userData.contact,
          email: userData.email,
          // Les autres champs restent vides car non fournis par l'API
          placeOfBirth: "",
          currentAddress: "",
          profession: "",
          uniqueId: "",
          emergencyContactName: "",
          emergencyContactRelation: "",
          emergencyContactPhone: "",
          treatingPhysician: "",
          insuranceInfo: "",
          chronicDiseases: "",
          majorSurgeries: "",
          hospitalizations: "",
          allergies: "",
          bloodType: "",
          familyMedicalHistory: "",
          profileImageUrl: "",
        };
        
        setProfileData(transformedData);
      } catch (error) {
        console.error("Erreur lors du chargement du profil:", error);
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les données du profil. Veuillez réessayer.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [session?.user?.id, toast]);

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (!profileData) return;
    const { name, value } = e.target;
    setProfileData((prev) => prev ? ({ ...prev, [name]: value }) : null);
  };

  const handleSelectChange = (
    name: keyof PatientProfileData,
    value: string
  ) => {
    if (!profileData) return;
    setProfileData((prev) => prev ? ({ ...prev, [name]: value }) : null);
  };

  const handleDateChange = (date: Date | undefined) => {
    if (!profileData) return;
    setProfileData((prev) => prev ? ({ ...prev, dateOfBirth: date }) : null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImageFile(e.target.files[0]);
    }
  };

  const handleSave = async () => {
    if (!profileData || !session?.user?.id) return;
    
    setIsSaving(true);
    try {
      // Préparer les données pour l'API
      const userData = {
        firstName: profileData.firstName,
        lastName: profileData.lastName,
        gender: profileData.gender,
        birthDate: profileData.dateOfBirth?.toISOString(),
        contact: profileData.phone,
        email: profileData.email,
      };

      // Appeler l'API pour mettre à jour le profil
      await userApi.updateProfile(session.user.id, userData);

      if (profileImageFile) {
        console.log("Fichier image de profil à uploader :", profileImageFile);
        // TODO: Implémenter l'upload de l'image
      }
      
      toast({
        title: "Succès",
        description: "Votre profil a été mis à jour avec succès.",
      });
    } catch (error) {
      console.error("Erreur lors de la sauvegarde:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Une erreur est survenue lors de la sauvegarde. Veuillez réessayer.",
      });
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>
        <div className="space-y-6">
          <Skeleton className="h-[200px] w-full" />
          <Skeleton className="h-[300px] w-full" />
          <Skeleton className="h-[200px] w-full" />
        </div>
      </div>
    );
  }

  if (!profileData) {
    return (
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>
        <div className="text-center">
          <p>Impossible de charger les données du profil.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-2xl font-bold mb-6">Mon Profil</h1>

      {/* Section Informations d'identification de base */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informations d'identification de base</CardTitle>
          <CardDescription>
            Modifiez vos informations personnelles essentielles.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Avatar / Upload */}
          <div className="flex items-center space-x-4">
            <Popover>
              <PopoverTrigger asChild>
                <div className="cursor-pointer">
                  <Avatar className="w-20 h-20">
                    <AvatarImage
                      src={
                        profileImageFile
                          ? URL.createObjectURL(profileImageFile)
                          : profileData.profileImageUrl
                      }
                      alt="Avatar"
                    />
                    <AvatarFallback>
                      {profileData.firstName && profileData.lastName ? (
                        profileData.firstName[0] + profileData.lastName[0]
                      ) : (
                        <UserCircle2 className="w-full h-full text-neutral-medium-gray" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-4" side="right">
                <div className="flex flex-col items-center space-y-4">
                  <Avatar className="w-32 h-32">
                    <AvatarImage
                      src={
                        profileImageFile
                          ? URL.createObjectURL(profileImageFile)
                          : profileData.profileImageUrl
                      }
                      alt="Avatar preview"
                    />
                    <AvatarFallback>
                      {profileData.firstName && profileData.lastName ? (
                        profileData.firstName[0] + profileData.lastName[0]
                      ) : (
                        <UserCircle2 className="w-full h-full text-neutral-medium-gray" />
                      )}
                    </AvatarFallback>
                  </Avatar>
                  <Button onClick={() => fileInputRef.current?.click()}>
                    Modifier l'image
                  </Button>
                  <Input
                    id="profile-image"
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                    className="hidden"
                  />
                </div>
              </PopoverContent>
            </Popover>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">Prénom</Label>
              <Input
                id="firstName"
                name="firstName"
                value={profileData.firstName}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Nom</Label>
              <Input
                id="lastName"
                name="lastName"
                value={profileData.lastName}
                onChange={handleInputChange}
              />
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
                    {profileData.dateOfBirth ? (
                      format(profileData.dateOfBirth, "PPP", { locale: fr })
                    ) : (
                      <span>Sélectionner une date</span>
                    )}
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
              <Select
                onValueChange={(value) => handleSelectChange("gender", value)}
                value={profileData.gender}
              >
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
              <Label htmlFor="phone">Numéro de téléphone</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                value={profileData.phone}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Adresse e-mail</Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={profileData.email}
                onChange={handleInputChange}
                disabled
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Informations administratives et sociales */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Informations administratives et sociales</CardTitle>
          <CardDescription>
            Ajoutez ou modifiez vos informations administratives et de contact
            d'urgence.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="uniqueId">
                Numéro d'identification unique (ex: Sécurité Sociale)
              </Label>
              <Input
                id="uniqueId"
                name="uniqueId"
                value={profileData.uniqueId}
                onChange={handleInputChange}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="insuranceInfo">
                Informations sur la couverture sociale/assurance maladie
              </Label>
              <Input
                id="insuranceInfo"
                name="insuranceInfo"
                value={profileData.insuranceInfo}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <div className="space-y-2 border-t pt-4 mt-4">
            <h3 className="text-lg font-semibold">
              Personne à contacter en cas d'urgence
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="emergencyContactName">Nom et Prénom</Label>
                <Input
                  id="emergencyContactName"
                  name="emergencyContactName"
                  value={profileData.emergencyContactName}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactRelation">
                  Lien de parenté
                </Label>
                <Input
                  id="emergencyContactRelation"
                  name="emergencyContactRelation"
                  value={profileData.emergencyContactRelation}
                  onChange={handleInputChange}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="emergencyContactPhone">
                  Numéro de téléphone
                </Label>
                <Input
                  id="emergencyContactPhone"
                  name="emergencyContactPhone"
                  type="tel"
                  value={profileData.emergencyContactPhone}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Section Antécédents médicaux personnels majeurs */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Antécédents médicaux personnels majeurs</CardTitle>
          <CardDescription>
            Listez vos maladies chroniques, chirurgies, hospitalisations et
            allergies.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="chronicDiseases">
              Maladies chroniques diagnostiquées
            </Label>
            <Input
              id="chronicDiseases"
              name="chronicDiseases"
              value={profileData.chronicDiseases}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="majorSurgeries">
              Interventions chirurgicales majeures
            </Label>
            <Input
              id="majorSurgeries"
              name="majorSurgeries"
              value={profileData.majorSurgeries}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="hospitalizations">
              Hospitalisations significatives
            </Label>
            <Input
              id="hospitalizations"
              name="hospitalizations"
              value={profileData.hospitalizations}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="allergies">Allergies connues</Label>
            <Input
              id="allergies"
              name="allergies"
              value={profileData.allergies}
              onChange={handleInputChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="bloodType">Groupe sanguin et Rhésus</Label>
            <Select
              onValueChange={(value) => handleSelectChange("bloodType", value)}
              value={profileData.bloodType}
            >
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
          <CardDescription>
            Informations sur les maladies héréditaires ou à forte composante
            génétique dans votre famille.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="familyMedicalHistory">
              Décrivez les antécédents familiaux pertinents
            </Label>
            <Input
              id="familyMedicalHistory"
              name="familyMedicalHistory"
              value={profileData.familyMedicalHistory}
              onChange={handleInputChange}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving}>
          {isSaving ? "Sauvegarde..." : "Sauvegarder les modifications"}
        </Button>
      </div>
    </div>
  );
}
