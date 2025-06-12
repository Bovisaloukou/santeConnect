"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { useSession } from "next-auth/react";
import { patientApi } from "@/lib/api/patient";

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
  consultations: any[];
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

  if (status === "loading" || loading) {
    return <div>Chargement...</div>;
  }

  if (status === "unauthenticated") {
    return <div>Veuillez vous connecter pour accéder à cette page</div>;
  }

  if (error) {
    return <div>Erreur: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dossier Professionnel</h1>
      
      <Tabs defaultValue="patients" className="space-y-4">
        <TabsList>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="dossiers">Dossiers Médicaux</TabsTrigger>
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
      </Tabs>
    </div>
  );
} 