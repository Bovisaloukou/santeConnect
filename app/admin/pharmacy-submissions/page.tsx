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
import { ArrowLeft } from 'lucide-react';
import { useRouter } from 'next/navigation';

// Données fictives pour les soumissions de pharmacies
const initialSubmissions = [
  {
    id: '1',
    pharmacyName: 'Pharmacie du Bonheur',
    responsibleName: 'M. Pierre Martin',
    status: 'En attente',
    submissionDate: '2024-03-20',
    details: {
      address: '123 Rue des Médicaments, Cotonou',
      departement: 'Littoral',
      commune: 'Cotonou',
      phone: '+229 90 00 00 00',
      email: 'contact@pharmaciedubonheur.bj',
      nifNumber: 'NIF-2024-001',
      services: ['Vente de médicaments', 'Conseil pharmaceutique', 'Livraison à domicile'],
      horaires: [
        'Lundi: 8h-20h',
        'Mardi: 8h-20h',
        'Mercredi: 8h-20h',
        'Jeudi: 8h-20h',
        'Vendredi: 8h-20h',
        'Samedi: 8h-18h',
        'Dimanche: 9h-13h'
      ],
      documents: {
        extraitRegistreDeCommerce: '/documents/erc-1.pdf',
        attestationImatriculation: '/documents/ai-1.pdf',
        annonceLegale: '/documents/al-1.pdf',
        declarationEtablissement: '/documents/de-1.pdf',
        carteProfessionnelle: '/documents/cp-1.pdf'
      },
      responsible: {
        lastName: 'Martin',
        firstName: 'Pierre',
        function: 'Pharmacien',
        phone: '+229 90 00 00 01',
        email: 'pierre.martin@pharmaciedubonheur.bj'
      }
    }
  },
  {
    id: '2',
    pharmacyName: 'Pharmacie de la Paix',
    responsibleName: 'Mme Sophie Dubois',
    status: 'Validé',
    submissionDate: '2024-03-19',
    details: {
      address: '456 Avenue de la Santé, Porto-Novo',
      departement: 'Ouémé',
      commune: 'Porto-Novo',
      phone: '+229 90 00 00 02',
      email: 'contact@pharmaciedelapaix.bj',
      nifNumber: 'NIF-2024-002',
      services: ['Vente de médicaments', 'Conseil pharmaceutique'],
      horaires: [
        'Lundi: 8h-19h',
        'Mardi: 8h-19h',
        'Mercredi: 8h-19h',
        'Jeudi: 8h-19h',
        'Vendredi: 8h-19h',
        'Samedi: 8h-17h',
        'Dimanche: Fermé'
      ],
      documents: {
        extraitRegistreDeCommerce: '/documents/erc-2.pdf',
        attestationImatriculation: '/documents/ai-2.pdf',
        annonceLegale: '/documents/al-2.pdf',
        declarationEtablissement: '/documents/de-2.pdf',
        carteProfessionnelle: '/documents/cp-2.pdf'
      },
      responsible: {
        lastName: 'Dubois',
        firstName: 'Sophie',
        function: 'Pharmacienne',
        phone: '+229 90 00 00 03',
        email: 'sophie.dubois@pharmaciedelapaix.bj'
      }
    }
  }
];

const PharmacySubmissionsPage = () => {
  const router = useRouter();
  const [submissions, setSubmissions] = useState(initialSubmissions);
  const [selectedSubmission, setSelectedSubmission] = useState<typeof initialSubmissions[0] | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState('');

  const handleValidate = (id: string) => {
    setSubmissions(submissions.map(submission =>
      submission.id === id ? { ...submission, status: 'Validé' } : submission
    ));
    setIsModalOpen(false);
  };

  const handleReject = (id: string) => {
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
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="outline"
            size="sm"
            onClick={() => router.push('/admin')}
            className="flex items-center gap-2"
          >
            <ArrowLeft className="h-4 w-4" />
            Retour
          </Button>
          <h1 className="text-2xl font-bold text-center flex-1">Gestion des soumissions de pharmacies</h1>
        </div>
        <Card>
          <CardHeader>
            <CardTitle>Soumissions reçues</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nom de la pharmacie</TableHead>
                  <TableHead>Responsable</TableHead>
                  <TableHead>Date de soumission</TableHead>
                  <TableHead>Statut</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {submissions.map(submission => (
                  <TableRow key={submission.id}>
                    <TableCell>{submission.pharmacyName}</TableCell>
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
                <TabsList className="grid w-full grid-cols-4">
                  <TabsTrigger value="identification">Identification</TabsTrigger>
                  <TabsTrigger value="legal">Informations légales</TabsTrigger>
                  <TabsTrigger value="services">Services & Horaires</TabsTrigger>
                  <TabsTrigger value="documents">Documents</TabsTrigger>
                </TabsList>

                <TabsContent value="identification" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold">Nom de la pharmacie</h3>
                      <p>{selectedSubmission.pharmacyName}</p>
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
                      <p>{selectedSubmission.details.phone}</p>
                    </div>
                    <div>
                      <h3 className="font-semibold">Email</h3>
                      <p>{selectedSubmission.details.email}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="legal" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold">Numéro NIF</h3>
                      <p>{selectedSubmission.details.nifNumber}</p>
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="services" className="space-y-4">
                  <div>
                    <h3 className="font-semibold">Services proposés</h3>
                    <div className="flex flex-wrap gap-2 mt-2">
                      {selectedSubmission.details.services.map((service, index) => (
                        <Badge key={index} variant="secondary">{service}</Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-semibold">Horaires d'ouverture</h3>
                    <div className="mt-2 space-y-1">
                      {selectedSubmission.details.horaires.map((horaire, index) => (
                        <p key={index}>{horaire}</p>
                      ))}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="documents" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-semibold">Extrait du registre de commerce</h3>
                      <Button variant="outline" size="sm" className="mt-2">
                        Voir le document
                      </Button>
                    </div>
                    <div>
                      <h3 className="font-semibold">Attestation d'immatriculation</h3>
                      <Button variant="outline" size="sm" className="mt-2">
                        Voir le document
                      </Button>
                    </div>
                    <div>
                      <h3 className="font-semibold">Annonce légale</h3>
                      <Button variant="outline" size="sm" className="mt-2">
                        Voir le document
                      </Button>
                    </div>
                    <div>
                      <h3 className="font-semibold">Déclaration d'établissement</h3>
                      <Button variant="outline" size="sm" className="mt-2">
                        Voir le document
                      </Button>
                    </div>
                    <div>
                      <h3 className="font-semibold">Carte professionnelle</h3>
                      <Button variant="outline" size="sm" className="mt-2">
                        Voir le document
                      </Button>
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

export default PharmacySubmissionsPage; 