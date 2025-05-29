"use client";

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, Settings, FileText } from 'lucide-react';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { useRouter } from 'next/navigation';

const AdminDashboard = () => {
  const router = useRouter();

  const adminFeatures = [
    {
      title: "Soumissions de centres",
      description: "Gérer les demandes d'inscription des centres de santé",
      icon: Building2,
      badge: "3 en attente",
      path: "/admin/center-submissions",
      color: "bg-blue-100"
    },
    {
      title: "Gestion des utilisateurs",
      description: "Gérer les comptes utilisateurs et leurs permissions",
      icon: Users,
      badge: "Nouveau",
      path: "/admin/users",
      color: "bg-green-100"
    },
    {
      title: "Rapports",
      description: "Consulter les statistiques et rapports d'activité",
      icon: FileText,
      badge: "Bientôt disponible",
      path: "/admin/reports",
      color: "bg-purple-100"
    },
    {
      title: "Paramètres",
      description: "Configurer les paramètres du système",
      icon: Settings,
      badge: "Bientôt disponible",
      path: "/admin/settings",
      color: "bg-orange-100"
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-neutral-light-gray">
      <Header />
      <main className="flex-1 container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8 text-center">Tableau de bord administrateur</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
          {adminFeatures.map((feature, index) => (
            <Card key={index} className={`hover:shadow-lg transition-shadow duration-200 ${feature.color}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-xl font-bold">{feature.title}</CardTitle>
                <feature.icon className="h-6 w-6" />
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">{feature.description}</p>
                <div className="flex items-center justify-between">
                  <Badge variant="secondary" className="text-xs">
                    {feature.badge}
                  </Badge>
                  <Button 
                    onClick={() => router.push(feature.path)}
                    variant="outline"
                    className="hover:bg-[#3498DB] hover:text-white transition-colors duration-200"
                  >
                    Accéder
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default AdminDashboard; 