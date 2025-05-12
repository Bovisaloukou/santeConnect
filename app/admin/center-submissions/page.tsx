"use client";

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';

// Exemple de données de soumissions de centres (à remplacer par les données réelles)
const initialSubmissions = [
  {
    id: '1',
    centerName: 'Centre Médical Alpha',
    responsibleName: 'Dr. Jean Dupont',
    status: 'En attente',
    submissionDate: '2023-10-26',
    details: { /* ... détails du formulaire ... */ }
  },
  {
    id: '2',
    centerName: 'Clinique Beta',
    responsibleName: 'Dr. Marie Curie',
    status: 'Validé',
    submissionDate: '2023-10-25',
    details: { /* ... détails du formulaire ... */ }
  },
  {
    id: '3',
    centerName: 'Centre de Santé Gamma',
    responsibleName: 'Mme Sophie Martin',
    status: 'Rejeté',
    submissionDate: '2023-10-24',
    details: { /* ... détails du formulaire ... */ }
  },
];

const CenterSubmissionsPage = () => {
  const [submissions, setSubmissions] = useState(initialSubmissions);

  const handleValidate = (id: string) => {
    // Logique de validation (simulée)
    console.log(`Validation de la soumission ${id}`);
    setSubmissions(submissions.map(submission =>
      submission.id === id ? { ...submission, status: 'Validé' } : submission
    ));
  };

  const handleReject = (id: string) => {
    // Logique de rejet (simulée)
    console.log(`Rejet de la soumission ${id}`);
     setSubmissions(submissions.map(submission =>
      submission.id === id ? { ...submission, status: 'Rejeté' } : submission
    ));
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
                      {submission.status === 'En attente' && (
                        <div className="flex gap-2">
                          <Button variant="outline" size="sm" onClick={() => handleValidate(submission.id)}>Valider</Button>
                          <Button variant="destructive" size="sm" onClick={() => handleReject(submission.id)}>Rejeter</Button>
                        </div>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  );
};

export default CenterSubmissionsPage; 