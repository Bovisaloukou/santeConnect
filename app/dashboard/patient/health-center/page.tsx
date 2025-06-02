"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Building2, Users, Stethoscope, FileText, Phone, Mail, MapPin, Building, Pencil } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

// Données fictives du centre de santé
const initialHealthCenterData = {
  type: "DOCTOR_OFFICE",
  name: "Centre Médical Saint-Joseph",
  fullAddress: "123 Avenue de la Santé",
  department: "Paris",
  municipality: "75001",
  phoneNumber: "01 23 45 67 89",
  email: "contact@stjoseph-medical.fr"
}

export default function HealthCenterPage() {
  const [isEditing, setIsEditing] = useState(false)
  const [healthCenterData, setHealthCenterData] = useState(initialHealthCenterData)

  const handleSave = () => {
    // Ici, vous pourriez ajouter la logique pour sauvegarder les données
    setIsEditing(false)
  }

  return (
    <div className="container mx-auto p-6">
      {/* Section Informations du Centre */}
      <Card className="mb-8">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-xl font-semibold">Informations du Centre</CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-2"
          >
            <Pencil className="h-4 w-4" />
            {isEditing ? "Annuler" : "Modifier"}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Building className="h-5 w-5 text-[#3498DB]" />
                <div className="flex-1">
                  <Label className="text-sm font-medium text-[#34495E]">Nom du Centre</Label>
                  {isEditing ? (
                    <Input
                      value={healthCenterData.name}
                      onChange={(e) => setHealthCenterData({ ...healthCenterData, name: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-base">{healthCenterData.name}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Building2 className="h-5 w-5 text-[#3498DB]" />
                <div className="flex-1">
                  <Label className="text-sm font-medium text-[#34495E]">Type</Label>
                  {isEditing ? (
                    <Input
                      value={healthCenterData.type}
                      onChange={(e) => setHealthCenterData({ ...healthCenterData, type: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-base">{healthCenterData.type}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-5 w-5 text-[#3498DB]" />
                <div className="flex-1">
                  <Label className="text-sm font-medium text-[#34495E]">Téléphone</Label>
                  {isEditing ? (
                    <Input
                      value={healthCenterData.phoneNumber}
                      onChange={(e) => setHealthCenterData({ ...healthCenterData, phoneNumber: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-base">{healthCenterData.phoneNumber}</p>
                  )}
                </div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Mail className="h-5 w-5 text-[#3498DB]" />
                <div className="flex-1">
                  <Label className="text-sm font-medium text-[#34495E]">Email</Label>
                  {isEditing ? (
                    <Input
                      value={healthCenterData.email}
                      onChange={(e) => setHealthCenterData({ ...healthCenterData, email: e.target.value })}
                      className="mt-1"
                    />
                  ) : (
                    <p className="text-base">{healthCenterData.email}</p>
                  )}
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-5 w-5 text-[#3498DB]" />
                <div className="flex-1">
                  <Label className="text-sm font-medium text-[#34495E]">Adresse</Label>
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={healthCenterData.fullAddress}
                        onChange={(e) => setHealthCenterData({ ...healthCenterData, fullAddress: e.target.value })}
                        placeholder="Adresse complète"
                        className="mt-1"
                      />
                      <div className="grid grid-cols-2 gap-2">
                        <Input
                          value={healthCenterData.municipality}
                          onChange={(e) => setHealthCenterData({ ...healthCenterData, municipality: e.target.value })}
                          placeholder="Code postal"
                        />
                        <Input
                          value={healthCenterData.department}
                          onChange={(e) => setHealthCenterData({ ...healthCenterData, department: e.target.value })}
                          placeholder="Ville"
                        />
                      </div>
                    </div>
                  ) : (
                    <>
                      <p className="text-base">{healthCenterData.fullAddress}</p>
                      <p className="text-sm text-[#95A5A6]">{healthCenterData.municipality}, {healthCenterData.department}</p>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
          {isEditing && (
            <div className="mt-6 flex justify-end">
              <Button onClick={handleSave} className="bg-[#3498DB] hover:bg-[#2980B9]">
                Enregistrer les modifications
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Services</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Services actifs</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Médecins</CardTitle>
            <Stethoscope className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Médecins affiliés</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Patients</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Patients suivis</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Demandes</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">0</div>
            <p className="text-xs text-muted-foreground">Demandes en attente</p>
          </CardContent>
        </Card>
      </div>
    </div>
  )
} 