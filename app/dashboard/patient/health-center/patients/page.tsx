"use client"

import { useState } from "react"
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { UserPlus, MessageSquare } from "lucide-react"

interface Patient {
  id: string
  name: string
  email: string
  status: "pending" | "assigned" | "in_progress"
  assignedDoctor?: string
  assignedService?: string
  chatHistory?: string
  date_visite: string
  motif: string
  anamnese: string
  antecedents_medicaux: string
  enquete_socioculturelle: string
  service_suggere?: string
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "1",
      name: "Marie Dubois",
      email: "marie.dubois@email.com",
      status: "pending",
      date_visite: "2025-05-28T10:00:00.000Z",
      motif: "Forte fièvre accompagnée de courbatures et grande fatigue",
      anamnese: "Patient de 45 ans se plaignant de fatigue intense débutée progressivement il y a trois jours, associée à une fièvre élevée, des courbatures généralisées et des maux de tête légers. Pas d'antécédents médicaux chroniques notables. Pas d'allergies autres que la pénicilline. Aucun membre de la famille proche n'a de problèmes de santé similaires.",
      antecedents_medicaux: "Pas d'antécédent chronique. Allergie à la pénicilline.",
      enquete_socioculturelle: "Pas de consommation de tabac. Consommation d'alcool très occasionnelle.",
      service_suggere: "Médecine générale"
    },
    {
      id: "2",
      name: "Jean Martin",
      email: "jean.martin@email.com",
      status: "pending",
      date_visite: "2025-05-28T11:30:00.000Z",
      motif: "Douleur thoracique et essoufflement",
      anamnese: "Patient de 58 ans présentant des douleurs thoraciques depuis 2 jours, aggravées à l'effort. Essoufflement progressif. Antécédent d'hypertension artérielle traitée.",
      antecedents_medicaux: "Hypertension artérielle, hypercholestérolémie",
      enquete_socioculturelle: "Ancien fumeur (arrêté il y a 5 ans), pas de consommation d'alcool",
      service_suggere: "Cardiologie"
    },
    {
      id: "3",
      name: "Sophie Bernard",
      email: "sophie.bernard@email.com",
      status: "pending",
      date_visite: "2025-05-28T14:00:00.000Z",
      motif: "Douleurs abdominales et nausées",
      anamnese: "Patient de 32 ans avec douleurs abdominales diffuses depuis 24h, associées à des nausées et une perte d'appétit. Pas de fièvre.",
      antecedents_medicaux: "Aucun antécédent notable",
      enquete_socioculturelle: "Non fumeuse, consommation d'alcool modérée",
      service_suggere: "Gastro-entérologie"
    }
  ])
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null)
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false)
  const [isChatDialogOpen, setIsChatDialogOpen] = useState(false)
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false)

  const handleAssignPatient = (patientId: string, doctorId: string, serviceId: string) => {
    setPatients(patients.map(p => 
      p.id === patientId 
        ? { ...p, status: "assigned", assignedDoctor: doctorId, assignedService: serviceId }
        : p
    ))
    setIsAssignDialogOpen(false)
  }

  const getStatusBadge = (status: Patient["status"]) => {
    const statusConfig = {
      pending: { label: "En attente", variant: "warning" },
      assigned: { label: "Assigné", variant: "success" },
      in_progress: { label: "En cours", variant: "info" },
    }

    const config = statusConfig[status]
    return (
      <Badge variant={config.variant as any}>
        {config.label}
      </Badge>
    )
  }

  return (
    <div className="container mx-auto p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-bold">Gestion des Patients</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Patients en attente</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nom</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Date de visite</TableHead>
                <TableHead>Motif</TableHead>
                <TableHead>Statut</TableHead>
                <TableHead>Service suggéré</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {patients.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8">
                    Aucun patient en attente
                  </TableCell>
                </TableRow>
              ) : (
                patients.map((patient) => (
                  <TableRow key={patient.id}>
                    <TableCell>
                      <button
                        className="text-blue-600 hover:text-blue-800 hover:underline"
                        onClick={() => {
                          setSelectedPatient(patient)
                          setIsDetailsDialogOpen(true)
                        }}
                      >
                        {patient.name}
                      </button>
                    </TableCell>
                    <TableCell>{patient.email}</TableCell>
                    <TableCell>{new Date(patient.date_visite).toLocaleDateString('fr-FR')}</TableCell>
                    <TableCell className="max-w-xs truncate">{patient.motif}</TableCell>
                    <TableCell>{getStatusBadge(patient.status)}</TableCell>
                    <TableCell>{patient.service_suggere}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedPatient(patient)
                            setIsAssignDialogOpen(true)
                          }}
                        >
                          <UserPlus className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            setSelectedPatient(patient)
                            setIsChatDialogOpen(true)
                          }}
                        >
                          <MessageSquare className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assigner un patient</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4">
              <div className="space-y-2">
                <label>Service suggéré</label>
                <p className="text-sm text-gray-500">{selectedPatient.service_suggere}</p>
              </div>
              <div className="space-y-2">
                <label>Service</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un service" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="medecine-generale">Médecine générale</SelectItem>
                    <SelectItem value="cardiologie">Cardiologie</SelectItem>
                    <SelectItem value="gastro-enterologie">Gastro-entérologie</SelectItem>
                    <SelectItem value="pneumologie">Pneumologie</SelectItem>
                    <SelectItem value="dermatologie">Dermatologie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <label>Médecin</label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un médecin" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="dr-dubois">Dr. Dubois - Médecine générale</SelectItem>
                    <SelectItem value="dr-martin">Dr. Martin - Cardiologie</SelectItem>
                    <SelectItem value="dr-bernard">Dr. Bernard - Gastro-entérologie</SelectItem>
                    <SelectItem value="dr-petit">Dr. Petit - Pneumologie</SelectItem>
                    <SelectItem value="dr-robert">Dr. Robert - Dermatologie</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex justify-end space-x-2">
                <Button
                  variant="outline"
                  onClick={() => setIsAssignDialogOpen(false)}
                >
                  Annuler
                </Button>
                <Button>
                  Assigner
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isChatDialogOpen} onOpenChange={setIsChatDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Historique du chat</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-4">
              <div className="bg-gray-50 p-4 rounded-lg max-h-96 overflow-y-auto">
                {/* Afficher l'historique du chat ici */}
                <p className="text-sm text-gray-500">
                  Historique des conversations avec le chatbot...
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailsDialogOpen} onOpenChange={setIsDetailsDialogOpen}>
        <DialogContent className="max-w-3xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>Détails du patient</DialogTitle>
          </DialogHeader>
          {selectedPatient && (
            <div className="space-y-6 overflow-y-auto pr-2">
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-semibold mb-2 text-lg">Informations personnelles</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Nom :</span> {selectedPatient.name}</p>
                    <p><span className="font-medium">Email :</span> {selectedPatient.email}</p>
                    <p><span className="font-medium">Date de visite :</span> {new Date(selectedPatient.date_visite).toLocaleString('fr-FR')}</p>
                    <p><span className="font-medium">Statut :</span> {getStatusBadge(selectedPatient.status)}</p>
                  </div>
                </div>
                <div className="bg-white p-4 rounded-lg border">
                  <h3 className="font-semibold mb-2 text-lg">Informations médicales</h3>
                  <div className="space-y-2">
                    <p><span className="font-medium">Service suggéré :</span> {selectedPatient.service_suggere}</p>
                    <p><span className="font-medium">Motif de consultation :</span> {selectedPatient.motif}</p>
                  </div>
                </div>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold mb-2 text-lg">Anamnèse</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedPatient.anamnese}</p>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold mb-2 text-lg">Antécédents médicaux</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedPatient.antecedents_medicaux}</p>
              </div>

              <div className="bg-white p-4 rounded-lg border">
                <h3 className="font-semibold mb-2 text-lg">Enquête socioculturelle</h3>
                <p className="text-gray-700 whitespace-pre-wrap">{selectedPatient.enquete_socioculturelle}</p>
              </div>
            </div>
          )}
          <div className="flex justify-end space-x-2 mt-4 flex-shrink-0 border-t pt-4">
            <Button
              variant="outline"
              onClick={() => setIsDetailsDialogOpen(false)}
            >
              Fermer
            </Button>
            <Button
              onClick={() => {
                setIsDetailsDialogOpen(false)
                setIsAssignDialogOpen(true)
              }}
            >
              Assigner un médecin
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
} 