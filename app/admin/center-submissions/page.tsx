"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

// Exemple de données de soumissions de centres (à remplacer par les données réelles)
const initialSubmissions = [
  {
    id: '1',
    centerName: 'Centre Médical Alpha',
    responsibleName: 'Dr. Jean Dupont',
    status: 'En attente',
    submissionDate: '2023-10-26',
    details: {
      structureType: 'Clinique',
      address: '123 Rue de la Santé, Cotonou',
      departement: 'Littoral',
      commune: 'Cotonou',
      centerPhone: '+229 90 00 00 00',
      centerEmail: 'contact@centrealpha.bj',
      agreementNumber: 'AGR-2023-001',
      nifNumber: 'NIF-2023-001',
      specialties: ['Médecine générale', 'Gynécologie', 'Pédiatrie'],
      hasTeleconsultation: true,
      documents: {
        openingAuthorization: '/documents/auth-1.pdf',
        responsibleId: '/documents/id-1.pdf',
        centerLogo: '/documents/logo-1.png',
        centerPhotos: ['/documents/photo-1.jpg', '/documents/photo-2.jpg']
      },
      responsible: {
        lastName: 'Dupont',
        firstName: 'Jean',
        function: 'Médecin Directeur',
        phone: '+229 90 00 00 01',
        email: 'jean.dupont@centrealpha.bj'
      }
    }
  },
  {
    id: '2',
    centerName: 'Clinique Beta',
    responsibleName: 'Dr. Marie Curie',
    status: 'Validé',
    submissionDate: '2023-10-25',
    details: {
      structureType: 'Cabinet médical',
      address: '456 Avenue de la Paix, Porto-Novo',
      departement: 'Ouémé',
      commune: 'Porto-Novo',
      centerPhone: '+229 90 00 00 02',
      centerEmail: 'contact@clinicbeta.bj',
      agreementNumber: 'AGR-2023-002',
      nifNumber: 'NIF-2023-002',
      specialties: ['Médecine générale', 'Dermatologie'],
      hasTeleconsultation: false,
      documents: {
        openingAuthorization: '/documents/auth-2.pdf',
        responsibleId: '/documents/id-2.pdf',
        centerLogo: '/documents/logo-2.png',
        centerPhotos: ['/documents/photo-3.jpg']
      },
      responsible: {
        lastName: 'Curie',
        firstName: 'Marie',
        function: 'Médecin',
        phone: '+229 90 00 00 03',
        email: 'marie.curie@clinicbeta.bj'
      }
    }
  },
  {
    id: '3',
    centerName: 'Centre de Santé Gamma',
    responsibleName: 'Mme Sophie Martin',
    status: 'Rejeté',
    submissionDate: '2023-10-24',
    details: {
      structureType: 'Centre de santé',
      address: '789 Boulevard de la Santé, Parakou',
      departement: 'Borgou',
      commune: 'Parakou',
      centerPhone: '+229 90 00 00 04',
      centerEmail: 'contact@centregamma.bj',
      agreementNumber: 'AGR-2023-003',
      nifNumber: 'NIF-2023-003',
      specialties: ['Médecine générale', 'Pédiatrie'],
      hasTeleconsultation: true,
      documents: {
        openingAuthorization: '/documents/auth-3.pdf',
        responsibleId: '/documents/id-3.pdf',
        centerLogo: '/documents/logo-3.png',
        centerPhotos: ['/documents/photo-4.jpg', '/documents/photo-5.jpg']
      },
      responsible: {
        lastName: 'Martin',
        firstName: 'Sophie',
        function: 'Directrice',
        phone: '+229 90 00 00 05',
        email: 'sophie.martin@centregamma.bj'
      }
    }
  },
];

const CenterSubmissionsPage = () => {
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState<typeof initialSubmissions[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleValidate = (id: string) => {
    console.log(`Validation de la soumission ${id}`);
    setSubmissions(submissions.map(submission =>
      submission.id === id ? { ...submission, status: 'Validé' } : submission
    ));
    setIsModalOpen(false);
  };

  const handleReject = (id: string) => {
    console.log(`Rejet de la soumission ${id}`, { reason: rejectionReason });
    setSubmissions(submissions.map(submission =>
      submission.id === id ? { ...submission, status: 'Rejeté' } : submission
    ));
    setRejectionReason('');
    setIsModalOpen(false);
  };

  const handleViewDetails = (submission: typeof initialSubmissions[0]) => {
    setSelectedSubmission(submission);
    setIsModalOpen(true);
  };

  return (
    <div className="flex flex-col min-h-screen bg-neutral-light-gray">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold mb-6 text-center">Gestion des soumissions de centres de santé</h1>
        <Card>
          <CardHeader>
            <CardTitle>Soumissions reçues</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom du centre</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Date de soumission</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map(submission => (
                  <TableRow key={submission.id}>
                    <TableCell>{submission.centerName}</TableCell>
                    <TableCell>{submission.responsibleName}</TableCell>
                    <TableCell>{submission.submissionDate}</TableCell>
                    <TableCell>
                      <Badge variant={submission.status === 'Validé' ? 'default' : submission.status === 'Rejeté' ? 'destructive' : 'secondary'}>
                        {submission.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-2">
                        <Button variant="outline" size="sm" onClick={() => handleViewDetails(submission)}>
                          Voir détails
                        </Button>
                        {submission.status === 'En attente' && (
                          <>
                            <Button variant="outline" size="sm" onClick={() => handleValidate(submission.id)}>Valider</Button>
                            <Button variant="destructive" size="sm" onClick={() => handleReject(submission.id)}>Rejeter</Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>

      {/* Modal de détails */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Détails de la soumission</DialogTitle>
          </DialogHeader>
          {selectedSubmission && (
            <ScrollArea className="h-[calc(90vh-8rem)]">
              <Tabs defaultValue="identification" className="w-full">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="identification">Identification</TabsTrigger>
                  <TabsTrigger value="legal">Informations légales</TabsTrigger>
                  <TabsTrigger value="services">Services</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                  <TabsTrigger value="responsible">Responsable</TabsTrigger>
                </TabsList>

                <TabsContent value="identification" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold">Nom du centre</h3>
                      <p>{selectedSubmission.centerName}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Type de structure</h3>
                      <p>{selectedSubmission.details.structureType}</p>
                    </div>
                    <div className="col-span-2">
                      <h3 className="font-semibold">Adresse</h3>
                      <p>{selectedSubmission.details.address}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Département</h3>
                      <p>{selectedSubmission.details.departement}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Commune</h3>
                      <p>{selectedSubmission.details.commune}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Téléphone</h3>
                      <p>{selectedSubmission.details.centerPhone}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p>{selectedSubmission.details.centerEmail}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="legal" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold">Numéro d'agrément</h3>
                      <p>{selectedSubmission.details.agreementNumber}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Numéro NIF</h3>
                      <p>{selectedSubmission.details.nifNumber}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="services" className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Spécialités</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedSubmission.details.specialties.map((specialty, index) => (
                        <Badge key={index} variant="secondary">{specialty}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">Téléconsultation</h3>
                    <p>{selectedSubmission.details.hasTeleconsultation ? 'Disponible' : 'Non disponible'}</p>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold">Autorisation d'ouverture</h3>
                      <Button variant="outline" size="sm" className="mt-2">
                        Voir le document
                      </Button>
                    </div>
                    <div>
                      <h3 className="font-semibold">Carte d'identité du responsable</h3>
                      <Button variant="outline" size="sm" className="mt-2">
                        Voir le document
                      </Button>
                    </div>
                    {selectedSubmission.details.documents.centerLogo && (
                      <div>
                        <h3 className="font-semibold">Logo du centre</h3>
                        <Button variant="outline" size="sm" className="mt-2">
                          Voir le logo
                        </Button>
                      </div>
                    )}
                    {selectedSubmission.details.documents.centerPhotos && (
                      <div>
                        <h3 className="font-semibold">Photos du centre</h3>
                        <div className="flex gap-2 mt-2">
                          {selectedSubmission.details.documents.centerPhotos.map((photo, index) => (
                            <Button key={index} variant="outline" size="sm">
                              Photo {index + 1}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </TabsContent>

                <TabsContent value="responsible" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold">Nom</h3>
                      <p>{selectedSubmission.details.responsible.lastName}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Prénom</h3>
                      <p>{selectedSubmission.details.responsible.firstName}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Fonction</h3>
                      <p>{selectedSubmission.details.responsible.function}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Téléphone</h3>
                      <p>{selectedSubmission.details.responsible.phone}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p>{selectedSubmission.details.responsible.email}</p>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>

              {selectedSubmission.status === 'En attente' && (
                <div className="mt-6 space-y-4">
                  <div>
                    <Label htmlFor="rejectionReason">Raison du rejet (si applicable)</Label>
                    <Textarea
                      id="rejectionReason"
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Entrez la raison du rejet..."
                    />
                  </div>
                  <div className="flex justify-end gap-2">
                    <Button variant="outline" onClick={() => setIsModalOpen(false)}>
                      Fermer
                    </Button>
                    <Button variant="outline" onClick={() => handleValidate(selectedSubmission.id)}>
                      Valider
                    </Button>
                    <Button variant="destructive" onClick={() => handleReject(selectedSubmission.id)}>
                      Rejeter
                    </Button>
                  </div>
                </div>
              )}
            </ScrollArea>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default CenterSubmissionsPage; 