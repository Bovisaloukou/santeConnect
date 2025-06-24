"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { patientApi } from "@/lib/api/patient";
import LoadingSpinner from "@/components/ui/loading-spinner";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ordonnanceApi } from "@/lib/api/ordonnance";
import Editor from "react-simple-wysiwyg";
import { createNotification } from "@/lib/api/notification";

interface UserProfile {
  uuid: string;
  firstName: string;
  lastName: string;
  gender: string;
  email: string;
  birthDate: string;
  contact: string;
}

interface HealthCenter {
  uuid: string;
  name: string;
  type: string;
  fullAddress: string;
  department: string;
  municipality: string;
}

interface Service {
  uuid: string;
  serviceName: string;
  description: string | null;
  healthCenter: HealthCenter;
}

interface Visite {
  uuid: string;
  date_visite: string;
  motif: string;
  anamnese: string;
  antecedants_medicaux: string;
  enquete_socioculturelle: string;
  prises_en_charges: any[];
  consultations: Consultation[];
}

interface Consultation {
  uuid: string;
  motif: string;
  date_heure: string;
  symptomes: string | null;
  diagnostic: string | null;
  examens_physique: string | null;
  observations: string | null;
  medecin: Medecin;
}

interface Medecin {
  uuid: string;
  specialite: string;
  userProfile: {
    uuid: string;
    firstName: string;
    lastName: string;
    gender: string;
    email: string;
    contact: string;
  };
}

interface Dossier {
  uuid: string;
  date_creation: string;
  visites: Visite[];
  service: Service;
}

interface Patient {
  uuid: string;
  createdAt: string;
  userProfile: UserProfile;
  dossiers: Dossier[];
}

interface ApiResponse {
  success: boolean;
  data: Patient[];
}

export default function ProfessionalFolder() {
  const { data: session, status } = useSession();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openDialog, setOpenDialog] = useState<string | null>(null);
  const [ordonnanceContent, setOrdonnanceContent] = useState("");
  const [expirationDate, setExpirationDate] = useState<string>("");
  const [ordonnanceLoading, setOrdonnanceLoading] = useState(false);
  const [ordonnanceError, setOrdonnanceError] = useState<string | null>(null);
  const [ordonnanceSuccess, setOrdonnanceSuccess] = useState<string | null>(null);

  useEffect(() => {
    const fetchPatients = async () => {
      if (status !== "authenticated" || !session?.user?.healthServiceUuid) {
        setLoading(false);
        return;
      }

      try {
        const response = await patientApi.getByServiceUuid(session.user.healthServiceUuid);
        if (response.success) {
          setPatients(response.data);
        } else {
          setError("Erreur lors de la récupération des patients");
        }
      } catch (err) {
        setError("Une erreur est survenue");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchPatients();
  }, [status, session?.user?.healthServiceUuid]);

  // Fonction pour calculer la date d'expiration par défaut (J+15)
  const getDefaultExpiration = () => {
    const date = new Date();
    date.setDate(date.getDate() + 15);
    return date.toISOString().slice(0, 10);
  };

  // Ouvre le dialog et initialise la date d'expiration
  const handleOpenDialog = (consultationUuid: string) => {
    setOpenDialog(consultationUuid);
    setOrdonnanceContent("");
    setExpirationDate(getDefaultExpiration());
    setOrdonnanceError(null);
    setOrdonnanceSuccess(null);
  };

  // Soumission de l'ordonnance
  const handleCreateOrdonnance = async (consultation: Consultation) => {
    setOrdonnanceLoading(true);
    setOrdonnanceError(null);
    setOrdonnanceSuccess(null);
    try {
      const now = new Date();
      const data = {
        type: "MEDICAMENT" as const,
        contenu: ordonnanceContent,
        date_emission: now.toISOString(),
        date_expiration: expirationDate,
        est_delivree: false,
        consultation_uuid: consultation.uuid,
        medecin_uuid: consultation.medecin.uuid,
      };
      await ordonnanceApi.create(data);
      setOrdonnanceSuccess("Ordonnance créée avec succès !");
      setOrdonnanceContent("");

      // Appel de la notification après création de l'ordonnance
      if (session?.user?.id) {
        await createNotification({
          type: "prescription",
          titre: "Nouvelle ordonnance",
          message: "Votre médecin vous a prescrit une nouvelle ordonnance.",
          statut: "pending",
          est_urgente: false,
          destinataires_uuids: [[session.user.id]],
        });
      }
    } catch (err) {
      setOrdonnanceError("Erreur lors de la création de l'ordonnance");
    } finally {
      setOrdonnanceLoading(false);
    }
  };

  if (status === "loading" || loading) {
    return (
      <div className="flex flex-col min-h-screen bg-neutral-light-gray">
        <main className="flex-1 py-8 md:py-12">
          <div className="container mx-auto px-4 text-center">
            <div className="flex items-center justify-center min-h-[60vh]">
              <LoadingSpinner size="lg" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex flex-col min-h-screen bg-neutral-light-gray">
        <main className="flex-1 py-8 md:py-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-red-500">Veuillez vous connecter pour accéder à cette page</p>
          </div>
        </main>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col min-h-screen bg-neutral-light-gray">
        <main className="flex-1 py-8 md:py-12">
          <div className="container mx-auto px-4 text-center">
            <p className="text-red-500">{error}</p>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dossier Professionnel</h1>
      
      <Tabs defaultValue="patients" className="space-y-4">
        <TabsList>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="dossiers">Dossiers Médicaux</TabsTrigger>
          <TabsTrigger value="consultations">Consultations</TabsTrigger>
        </TabsList>

        <TabsContent value="patients">
          <div className="grid gap-4">
            {patients.map((patient) => (
              <Card key={patient.uuid}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{`${patient.userProfile.firstName} ${patient.userProfile.lastName}`}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="ml-2">
                        {new Date(patient.userProfile.birthDate).toLocaleDateString('fr-FR')} - {patient.userProfile.gender}
                      </Badge>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold">Contact</h3>
                      <p className="text-muted-foreground">{patient.userProfile.contact}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p className="text-muted-foreground">{patient.userProfile.email}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Dernière visite</h3>
                      <p className="text-muted-foreground">
                        {patient.dossiers[0]?.visites[0]?.date_visite 
                          ? new Date(patient.dossiers[0].visites[0].date_visite).toLocaleDateString('fr-FR')
                          : 'Aucune visite'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="dossiers">
          <div className="grid gap-4">
            {patients.map((patient) => (
              <div key={patient.uuid}>
                <h2 className="text-xl font-semibold mb-4">{`${patient.userProfile.firstName} ${patient.userProfile.lastName}`}</h2>
                {patient.dossiers.map((dossier) => (
                  <Card key={dossier.uuid} className="mb-4">
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>Dossier créé le {new Date(dossier.date_creation).toLocaleDateString('fr-FR')}</span>
                        <Badge variant="outline" className="ml-2">
                          {dossier.service.serviceName}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {dossier.visites.map((visite) => (
                          <div key={visite.uuid} className="border-t pt-4">
                            <h3 className="font-semibold">Visite du {new Date(visite.date_visite).toLocaleDateString('fr-FR')}</h3>
                            <div className="space-y-2">
                              <div>
                                <h4 className="font-medium">Motif</h4>
                                <p className="text-muted-foreground">{visite.motif}</p>
                              </div>
                              <div>
                                <h4 className="font-medium">Anamnèse</h4>
                                <p className="text-muted-foreground">{visite.anamnese}</p>
                              </div>
                              <div>
                                <h4 className="font-medium">Antécédents médicaux</h4>
                                <p className="text-muted-foreground">{visite.antecedants_medicaux}</p>
                              </div>
                              <div>
                                <h4 className="font-medium">Enquête socioculturelle</h4>
                                <p className="text-muted-foreground">{visite.enquete_socioculturelle}</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="consultations">
          <div className="grid gap-4">
            {patients.map((patient) => (
              <div key={patient.uuid}>
                <h2 className="text-xl font-semibold mb-4">{`${patient.userProfile.firstName} ${patient.userProfile.lastName}`}</h2>
                {patient.dossiers.map((dossier) => (
                  <div key={dossier.uuid}>
                    {dossier.visites.map((visite) => (
                      <div key={visite.uuid}>
                        {visite.consultations.map((consultation) => (
                          <Card key={consultation.uuid} className="mb-4">
                            <CardHeader>
                              <CardTitle className="flex justify-between items-center">
                                <span>Consultation du {new Date(consultation.date_heure).toLocaleDateString('fr-FR')} à {new Date(consultation.date_heure).toLocaleTimeString('fr-FR')}</span>
                                <div className="flex items-center gap-2">
                                  <Badge variant="outline" className="ml-2">
                                    {consultation.motif}
                                  </Badge>
                                  <Badge variant="secondary" className="ml-2">
                                    {dossier.service.serviceName}
                                  </Badge>
                                  <Dialog open={openDialog === consultation.uuid} onOpenChange={(open) => !open && setOpenDialog(null)}>
                                    <DialogTrigger asChild>
                                      <Button variant="outline" size="sm" onClick={() => handleOpenDialog(consultation.uuid)}>
                                        Créer une ordonnance
                                      </Button>
                                    </DialogTrigger>
                                    <DialogContent className="max-h-[80vh] max-w-2xl w-full m-4">
                                      <DialogHeader>
                                        <DialogTitle>Nouvelle ordonnance</DialogTitle>
                                      </DialogHeader>
                                      <div className="space-y-4">
                                        <label className="block text-sm font-medium">Contenu de l'ordonnance</label>
                                        <Editor
                                          value={ordonnanceContent}
                                          onChange={e => setOrdonnanceContent(e.target.value)}
                                          placeholder="Rédigez l'ordonnance ici..."
                                          style={{ minHeight: '150px', height: '200px' }}
                                        />
                                        <label className="block text-sm font-medium mt-2">Date d'expiration</label>
                                        <input
                                          type="date"
                                          className="w-full border rounded p-2"
                                          value={expirationDate}
                                          onChange={e => setExpirationDate(e.target.value)}
                                        />
                                        {ordonnanceError && <p className="text-red-500 text-sm">{ordonnanceError}</p>}
                                        {ordonnanceSuccess && <p className="text-green-600 text-sm">{ordonnanceSuccess}</p>}
                                      </div>
                                      <DialogFooter>
                                        <Button
                                          onClick={() => handleCreateOrdonnance(consultation)}
                                          disabled={ordonnanceLoading || !ordonnanceContent.trim()}
                                        >
                                          {ordonnanceLoading ? "Création..." : "Valider l'ordonnance"}
                                        </Button>
                                        <DialogClose asChild>
                                          <Button variant="ghost">Annuler</Button>
                                        </DialogClose>
                                      </DialogFooter>
                                    </DialogContent>
                                  </Dialog>
                                </div>
                              </CardTitle>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                <div>
                                  <h3 className="font-semibold">Médecin</h3>
                                  <p className="text-muted-foreground">
                                    Dr. {consultation.medecin.userProfile.firstName} {consultation.medecin.userProfile.lastName} - {consultation.medecin.specialite}
                                  </p>
                                  <p className="text-sm text-muted-foreground">
                                    Contact: {consultation.medecin.userProfile.contact}
                                  </p>
                                </div>
                                
                                {consultation.symptomes && (
                                  <div>
                                    <h3 className="font-semibold">Symptômes</h3>
                                    <p className="text-muted-foreground">{consultation.symptomes}</p>
                                  </div>
                                )}
                                
                                {consultation.diagnostic && (
                                  <div>
                                    <h3 className="font-semibold">Diagnostic</h3>
                                    <p className="text-muted-foreground">{consultation.diagnostic}</p>
                                  </div>
                                )}
                                
                                {consultation.examens_physique && (
                                  <div>
                                    <h3 className="font-semibold">Examens physiques</h3>
                                    <p className="text-muted-foreground">{consultation.examens_physique}</p>
                                  </div>
                                )}
                                
                                {consultation.observations && (
                                  <div>
                                    <h3 className="font-semibold">Observations</h3>
                                    <p className="text-muted-foreground">{consultation.observations}</p>
                                  </div>
                                )}
                                
                                <div className="border-t pt-4">
                                  <h3 className="font-semibold">Contexte de la visite</h3>
                                  <p className="text-sm text-muted-foreground">
                                    Visite du {new Date(visite.date_visite).toLocaleDateString('fr-FR')} - {visite.motif}
                                  </p>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 