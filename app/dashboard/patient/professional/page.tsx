"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PrescriptionForm } from "./prescription-form";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface Patient {
  id: string;
  name: string;
  age: number;
  gender: string;
  medicalRecords: MedicalRecord[];
}

interface MedicalRecord {
  id: string;
  date: string;
  motif: string;
  anamnese: string;
  antecedents_medicaux: string;
  enquete_socioculturelle: string;
  service: string;
  diagnostic: string;
  traitement: string;
  notes: string;
  doctor: {
    name: string;
    specialty: string;
  };
}

export default function ProfessionalFolder() {
  const [patients] = useState<Patient[]>([
    {
      id: "1",
      name: "Jean Dupont",
      age: 45,
      gender: "M",
      medicalRecords: [
        {
          id: "1",
          date: "2024-03-15T10:00:00.000Z",
          motif: "Forte fièvre accompagnée de courbatures et grande fatigue",
          anamnese: "Patient de 45 ans se plaignant de fatigue intense débutée progressivement il y a trois jours, associée à une fièvre élevée, des courbatures généralisées et des maux de tête légers.",
          antecedents_medicaux: "Pas d'antécédent chronique. Allergie à la pénicilline.",
          enquete_socioculturelle: "Pas de consommation de tabac. Consommation d'alcool très occasionnelle.",
          service: "Médecine générale",
          diagnostic: "Grippe saisonnière",
          traitement: "Paracétamol 1g toutes les 6h, repos, hydratation abondante",
          notes: "Surveillance de la température. Retour prévu dans 5 jours si persistance des symptômes.",
          doctor: {
            name: "Martin",
            specialty: "Médecine générale"
          }
        }
      ]
    },
    {
      id: "2",
      name: "Marie Dubois",
      age: 58,
      gender: "F",
      medicalRecords: [
        {
          id: "2",
          date: "2024-02-28T14:30:00.000Z",
          motif: "Douleur thoracique et essoufflement",
          anamnese: "Patient de 58 ans présentant des douleurs thoraciques depuis 2 jours, aggravées à l'effort. Essoufflement progressif.",
          antecedents_medicaux: "Hypertension artérielle, hypercholestérolémie",
          enquete_socioculturelle: "Ancien fumeur (arrêté il y a 5 ans), pas de consommation d'alcool",
          service: "Cardiologie",
          diagnostic: "Angine de poitrine",
          traitement: "Aspirine 100mg/jour, bêta-bloquants, consultation cardiologue",
          notes: "Éviter les efforts intenses. Suivi cardiologique programmé.",
          doctor: {
            name: "Dubois",
            specialty: "Cardiologie"
          }
        }
      ]
    }
  ]);

  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const [showPrescriptionForm, setShowPrescriptionForm] = useState(false);

  const handlePrescriptionSubmit = (prescription: any) => {
    setShowPrescriptionForm(false);
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Dossier Professionnel</h1>
      
      <Tabs defaultValue="patients" className="space-y-4">
        <TabsList>
          <TabsTrigger value="patients">Patients</TabsTrigger>
          <TabsTrigger value="records">Dossiers Médicaux</TabsTrigger>
          <TabsTrigger value="prescriptions">Ordonnances</TabsTrigger>
        </TabsList>

        <TabsContent value="patients">
          <div className="grid gap-4">
            {patients.map((patient) => (
              <Card key={patient.id}>
                <CardHeader>
                  <CardTitle className="flex justify-between items-center">
                    <span>{patient.name}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline" className="ml-2">
                        {patient.age} ans - {patient.gender === 'M' ? 'Homme' : 'Femme'}
                      </Badge>
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button 
                            variant="outline"
                            onClick={() => setSelectedPatient(patient)}
                          >
                            Nouvelle ordonnance
                          </Button>
                        </DialogTrigger>
                        <DialogContent className="max-w-3xl">
                          {selectedPatient && (
                            <PrescriptionForm
                              patientId={selectedPatient.id}
                              patientName={selectedPatient.name}
                              onSubmit={handlePrescriptionSubmit}
                            />
                          )}
                        </DialogContent>
                      </Dialog>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <h3 className="font-semibold">Dernière consultation</h3>
                      <p className="text-muted-foreground">
                        {patient.medicalRecords[0]?.date 
                          ? new Date(patient.medicalRecords[0].date).toLocaleDateString('fr-FR')
                          : 'Aucune consultation'}
                      </p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Service</h3>
                      <p className="text-muted-foreground">
                        {patient.medicalRecords[0]?.service || 'Non spécifié'}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="records">
          <div className="grid gap-4">
            {patients.map((patient) => (
              <div key={patient.id}>
                <h2 className="text-xl font-semibold mb-4">{patient.name}</h2>
                {patient.medicalRecords.map((record) => (
                  <Card key={record.id} className="mb-4">
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>Consultation du {new Date(record.date).toLocaleDateString('fr-FR')}</span>
                        <Badge variant="outline" className="ml-2">
                          {record.service}
                        </Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold">Motif de consultation</h3>
                          <p className="text-muted-foreground">{record.motif}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold">Anamnèse</h3>
                          <p className="text-muted-foreground">{record.anamnese}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold">Antécédents médicaux</h3>
                          <p className="text-muted-foreground">{record.antecedents_medicaux}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold">Enquête socioculturelle</h3>
                          <p className="text-muted-foreground">{record.enquete_socioculturelle}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold">Diagnostic</h3>
                          <p className="text-muted-foreground">{record.diagnostic}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold">Traitement</h3>
                          <p className="text-muted-foreground">{record.traitement}</p>
                        </div>
                        <div>
                          <h3 className="font-semibold">Notes</h3>
                          <p className="text-muted-foreground">{record.notes}</p>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-sm text-muted-foreground">
                            Médecin : Dr. {record.doctor.name} - {record.doctor.specialty}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="prescriptions">
          <div className="grid gap-4">
            {patients.map((patient) => (
              <div key={patient.id}>
                <h2 className="text-xl font-semibold mb-4">{patient.name}</h2>
                {patient.medicalRecords.map((record) => (
                  <Card key={record.id} className="mb-4">
                    <CardHeader>
                      <CardTitle className="flex justify-between items-center">
                        <span>Ordonnance du {new Date(record.date).toLocaleDateString('fr-FR')}</span>
                        <Badge variant="outline">{record.service}</Badge>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <h3 className="font-semibold">Traitement</h3>
                          <p className="text-muted-foreground">{record.traitement}</p>
                        </div>
                        <div className="pt-2 border-t">
                          <p className="text-sm text-muted-foreground">
                            Médecin : Dr. {record.doctor.name} - {record.doctor.specialty}
                          </p>
                        </div>
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