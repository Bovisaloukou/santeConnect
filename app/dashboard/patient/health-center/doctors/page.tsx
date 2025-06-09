"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Check, X, UserPlus } from "lucide-react"
import { healthCenterApi } from "@/lib/api/healthCenter"

interface Doctor {
  uuid: string
  numeroOrdre: string
  role: string
  specialite: string
  userProfile: {
    firstName: string
    lastName: string
    email: string
  }
}

interface HealthService {
  uuid: string
  serviceName: string
  medecins: Doctor[]
}

interface HealthCenter {
  uuid: string
  name: string
  healthServices: HealthService[]
}

export default function DoctorsPage() {
  const { data: session, status } = useSession()
  const [healthCenter, setHealthCenter] = useState<HealthCenter | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  useEffect(() => {
    const fetchHealthCenter = async () => {
      if (status === "loading") return
      
      try {
        if (session?.user?.healthCenterUuid) {
          const response = await healthCenterApi.getById(session.user.healthCenterUuid)
          setHealthCenter(response.data)
        }
      } catch (error) {
        console.error("Erreur lors de la récupération du centre de santé:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchHealthCenter()
  }, [session?.user?.healthCenterUuid, status])

  const handleApproveDoctor = (id: string) => {
    setHealthCenter(prevHealthCenter => ({
      ...prevHealthCenter!,
      healthServices: prevHealthCenter!.healthServices.map(service => ({
        ...service,
        medecins: service.medecins.map(d => 
          d.uuid === id ? { ...d, role: "approved" } : d
        )
      }))
    }))
  }

  const handleRejectDoctor = (id: string) => {
    setHealthCenter(prevHealthCenter => ({
      ...prevHealthCenter!,
      healthServices: prevHealthCenter!.healthServices.map(service => ({
        ...service,
        medecins: service.medecins.map(d => 
          d.uuid === id ? { ...d, role: "rejected" } : d
        )
      }))
    }))
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { label: "En attente", variant: "warning" },
      approved: { label: "Approuvé", variant: "success" },
      rejected: { label: "Rejeté", variant: "destructive" },
    }

    const config = statusConfig[status as keyof typeof statusConfig]
    return (
      <Badge variant={config.variant as any}>
        {config.label}
      </Badge>
    )
  }

  if (status === "loading" || loading) {
    return <div className="container mx-auto p-6">Chargement...</div>
  }

  if (status === "unauthenticated") {
    return <div className="container mx-auto p-6">Veuillez vous connecter pour accéder à cette page.</div>
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gestion des Médecins</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Demandes d'affiliation</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Spécialité</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell colSpan={5} className="text-center py-8">
                  Aucune demande d'affiliation
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card className="mt-6">
        <CardHeader>
          <CardTitle>Médecins affiliés</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Spécialité</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Services</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {healthCenter?.healthServices.map((service) => (
                service.medecins.map((doctor) => (
                  <TableRow key={doctor.uuid}>
                    <TableCell>{`${doctor.userProfile.lastName} ${doctor.userProfile.firstName}`}</TableCell>
                    <TableCell>{doctor.specialite}</TableCell>
                    <TableCell>{doctor.userProfile.email}</TableCell>
                    <TableCell>
                      <Badge variant="outline">{service.serviceName}</Badge>
                    </TableCell>
                  </TableRow>
                ))
              ))}
              {!healthCenter?.healthServices.some(service => service.medecins.length > 0) && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-8">
                    Aucun médecin affilié
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Gérer les services du médecin</DialogTitle>
          </DialogHeader>
          {selectedDoctor && (
            <div className="space-y-4">
              <p>
                Gérer les services pour le Dr. {selectedDoctor.userProfile.firstName} {selectedDoctor.userProfile.lastName}
              </p>
              {/* Ajouter ici la liste des services disponibles avec des cases à cocher */}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
} 