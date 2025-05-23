"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useUser } from "@/lib/user-context"
import {
  Bell,
  Calendar,
  FileText,
  Home,
  LogOut,
  MessageSquare,
  Pill,
  Search,
  Settings,
  User,
  Users,
} from "lucide-react"

export default function HealthcareDashboard() {
  const router = useRouter()
  const { user, isLoading } = useUser()
  const [searchQuery, setSearchQuery] = useState("")

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (user && user.role !== "healthcare") {
      router.push(`/dashboard/${user.role}`)
    }
  }, [user, isLoading, router])

  if (isLoading || !user) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    window.location.href = "/login"
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-white border-r">
        <div className="p-4 border-b">
          <Link href="/" className="flex items-center space-x-2">
            <Pill className="h-6 w-6 text-emerald-600" />
            <span className="text-xl font-bold text-emerald-600">SantéConnect</span>
          </Link>
        </div>
        <nav className="flex-1 p-4 space-y-1">
          <Link
            href="/dashboard/healthcare"
            className="flex items-center space-x-2 px-3 py-2 rounded-md bg-emerald-50 text-emerald-600"
          >
            <Home className="h-5 w-5" />
            <span>Tableau de bord</span>
          </Link>
          <Link
            href="/dashboard/healthcare/patients"
            className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            <Users className="h-5 w-5" />
            <span>Patients</span>
          </Link>
          <Link
            href="/dashboard/healthcare/appointments"
            className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            <Calendar className="h-5 w-5" />
            <span>Rendez-vous</span>
          </Link>
          <Link
            href="/dashboard/healthcare/prescriptions"
            className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            <FileText className="h-5 w-5" />
            <span>Ordonnances</span>
          </Link>
          <Link
            href="/dashboard/healthcare/messages"
            className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            <MessageSquare className="h-5 w-5" />
            <span>Messages</span>
          </Link>
          <Link
            href="/dashboard/healthcare/profile"
            className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            <User className="h-5 w-5" />
            <span>Profil</span>
          </Link>
          <Link
            href="/dashboard/healthcare/settings"
            className="flex items-center space-x-2 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100"
          >
            <Settings className="h-5 w-5" />
            <span>Paramètres</span>
          </Link>
        </nav>
        <div className="p-4 border-t">
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" />
            Déconnexion
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white border-b p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-[#34495E]">Tableau de bord professionnel</h1>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" size="icon" className="relative">
              <Bell className="h-5 w-5" />
              <span className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"></span>
            </Button>
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-semibold">
                {user.name.charAt(0)}
              </div>
              <span className="text-sm font-medium">{user.name}</span>
            </div>
          </div>
        </header>

        {/* Dashboard Content */}
        <main className="flex-1 p-6 overflow-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Rendez-vous aujourd'hui</CardTitle>
                <CardDescription>Vos consultations du jour</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-emerald-600">8</div>
                  <div className="text-sm text-gray-500">3 consultations terminées</div>
                  <div className="text-sm text-gray-500">5 consultations à venir</div>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    Voir l'agenda du jour
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Patients en attente</CardTitle>
                <CardDescription>Patients en salle d'attente</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-amber-600">3</div>
                  <div className="text-sm text-gray-500">Temps d'attente moyen: 15 min</div>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    Gérer la file d'attente
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Messages non lus</CardTitle>
                <CardDescription>Vos messages récents</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-blue-600">5</div>
                  <div className="text-sm text-gray-500">2 messages urgents</div>
                  <Button variant="outline" size="sm" className="w-full mt-2">
                    Voir tous les messages
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Rechercher un patient</h2>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher par nom, ID ou numéro de téléphone"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <Tabs defaultValue="upcoming">
            <TabsList className="mb-4">
              <TabsTrigger value="upcoming">Prochains rendez-vous</TabsTrigger>
              <TabsTrigger value="patients">Patients récents</TabsTrigger>
              <TabsTrigger value="prescriptions">Ordonnances récentes</TabsTrigger>
            </TabsList>
            <TabsContent value="upcoming">
              <Card>
                <CardHeader>
                  <CardTitle>Vos prochains rendez-vous</CardTitle>
                  <CardDescription>Consultez et gérez vos rendez-vous à venir</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <DoctorAppointmentItem
                      patient="Jean Dupont"
                      age="45 ans"
                      date="Aujourd'hui"
                      time="14:30"
                      type="Consultation générale"
                      status="upcoming"
                    />
                    <DoctorAppointmentItem
                      patient="Marie Koné"
                      age="32 ans"
                      date="Aujourd'hui"
                      time="15:15"
                      type="Suivi traitement"
                      status="upcoming"
                    />
                    <DoctorAppointmentItem
                      patient="Amadou Diallo"
                      age="28 ans"
                      date="Aujourd'hui"
                      time="16:00"
                      type="Première consultation"
                      status="upcoming"
                    />
                    <DoctorAppointmentItem
                      patient="Fatou Sow"
                      age="52 ans"
                      date="Demain"
                      time="09:30"
                      type="Résultats d'analyses"
                      status="upcoming"
                    />
                    <div className="flex justify-center mt-4">
                      <Button variant="outline">Voir tous les rendez-vous</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="patients">
              <Card>
                <CardHeader>
                  <CardTitle>Patients récemment consultés</CardTitle>
                  <CardDescription>Accédez rapidement aux dossiers de vos patients récents</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <PatientItem
                      name="Sophie Touré"
                      age="38 ans"
                      lastVisit="Hier, 10:15"
                      reason="Douleurs abdominales"
                      status="follow-up"
                    />
                    <PatientItem
                      name="Ibrahim Camara"
                      age="42 ans"
                      lastVisit="12 Mai 2023"
                      reason="Hypertension"
                      status="stable"
                    />
                    <PatientItem
                      name="Aminata Bah"
                      age="29 ans"
                      lastVisit="10 Mai 2023"
                      reason="Grossesse - 2ème trimestre"
                      status="monitoring"
                    />
                    <PatientItem
                      name="Ousmane Diop"
                      age="65 ans"
                      lastVisit="5 Mai 2023"
                      reason="Diabète type 2"
                      status="chronic"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            <TabsContent value="prescriptions">
              <Card>
                <CardHeader>
                  <CardTitle>Ordonnances récentes</CardTitle>
                  <CardDescription>Les dernières ordonnances que vous avez prescrites</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <DoctorPrescriptionItem
                      patient="Sophie Touré"
                      date="Hier"
                      medication="Paracétamol, Spasfon"
                      duration="7 jours"
                    />
                    <DoctorPrescriptionItem
                      patient="Ibrahim Camara"
                      date="12 Mai 2023"
                      medication="Amlodipine, Hydrochlorothiazide"
                      duration="30 jours"
                    />
                    <DoctorPrescriptionItem
                      patient="Aminata Bah"
                      date="10 Mai 2023"
                      medication="Acide folique, Fer"
                      duration="90 jours"
                    />
                    <DoctorPrescriptionItem
                      patient="Ousmane Diop"
                      date="5 Mai 2023"
                      medication="Metformine, Gliclazide"
                      duration="30 jours"
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </main>
      </div>
    </div>
  )
}

function DoctorAppointmentItem({
  patient,
  age,
  date,
  time,
  type,
  status,
}: {
  patient: string
  age: string
  date: string
  time: string
  type: string
  status: "upcoming" | "completed" | "cancelled"
}) {
  const statusMap = {
    upcoming: { text: "À venir", color: "text-emerald-600 bg-emerald-50" },
    completed: { text: "Terminé", color: "text-blue-600 bg-blue-50" },
    cancelled: { text: "Annulé", color: "text-red-600 bg-red-50" },
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="space-y-1">
        <div className="font-medium">{patient}</div>
        <div className="text-sm text-gray-500">{age}</div>
        <div className="flex items-center text-sm text-gray-500">
          <Calendar className="h-4 w-4 mr-1" />
          {date} - {time}
        </div>
        <div className="text-sm text-gray-500">{type}</div>
      </div>
      <div className="flex flex-col items-end space-y-2">
        <span className={`text-sm px-2 py-1 rounded-full ${statusMap[status].color}`}>{statusMap[status].text}</span>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            Voir dossier
          </Button>
          <Button variant="outline" size="sm">
            Commencer
          </Button>
        </div>
      </div>
    </div>
  )
}

function PatientItem({
  name,
  age,
  lastVisit,
  reason,
  status,
}: {
  name: string
  age: string
  lastVisit: string
  reason: string
  status: "stable" | "follow-up" | "monitoring" | "chronic"
}) {
  const statusMap = {
    stable: { text: "Stable", color: "text-emerald-600 bg-emerald-50" },
    "follow-up": { text: "Suivi requis", color: "text-amber-600 bg-amber-50" },
    monitoring: { text: "Surveillance", color: "text-blue-600 bg-blue-50" },
    chronic: { text: "Chronique", color: "text-purple-600 bg-purple-50" },
  }

  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="space-y-1">
        <div className="font-medium">{name}</div>
        <div className="text-sm text-gray-500">{age}</div>
        <div className="text-sm text-gray-500">Dernière visite: {lastVisit}</div>
        <div className="text-sm text-gray-500">Motif: {reason}</div>
      </div>
      <div className="flex flex-col items-end space-y-2">
        <span className={`text-sm px-2 py-1 rounded-full ${statusMap[status].color}`}>{statusMap[status].text}</span>
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            Dossier
          </Button>
          <Button variant="outline" size="sm">
            Contacter
          </Button>
        </div>
      </div>
    </div>
  )
}

function DoctorPrescriptionItem({
  patient,
  date,
  medication,
  duration,
}: {
  patient: string
  date: string
  medication: string
  duration: string
}) {
  return (
    <div className="flex items-center justify-between p-4 border rounded-lg">
      <div className="space-y-1">
        <div className="font-medium">{patient}</div>
        <div className="text-sm text-gray-500">Prescrit le: {date}</div>
        <div className="text-sm text-gray-500">Médicaments: {medication}</div>
        <div className="text-sm text-gray-500">Durée: {duration}</div>
      </div>
      <div className="flex space-x-2">
        <Button variant="outline" size="sm">
          Voir
        </Button>
        <Button variant="outline" size="sm">
          Renouveler
        </Button>
      </div>
    </div>
  )
}
