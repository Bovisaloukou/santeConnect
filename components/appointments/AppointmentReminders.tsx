"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Bell, Calendar } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Appointment } from "@/lib/types"

interface AppointmentRemindersProps {
  appointments: Appointment[]
}

export default function AppointmentReminders({ appointments }: AppointmentRemindersProps) {
  const { toast } = useToast()
  const [reminderSettings, setReminderSettings] = useState({
    enabled: true,
    emailEnabled: true,
    smsEnabled: false,
    reminderTime: "1day",
  })

  // Filtrer les rendez-vous à venir
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  const upcomingAppointments = appointments.filter((appointment) => {
    const appointmentDate = new Date(appointment.date)
    return appointmentDate >= today && appointment.status !== "cancelled"
  })

  // Trier par date (les plus proches d'abord)
  const sortedAppointments = [...upcomingAppointments].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

  // Prendre les 3 prochains rendez-vous
  const nextAppointments = sortedAppointments.slice(0, 3)

  // Gérer le changement de paramètres
  const handleSettingChange = (setting: string, value: boolean | string) => {
    setReminderSettings({
      ...reminderSettings,
      [setting]: value,
    })

    toast({
      title: "Paramètres mis à jour",
      description: "Vos préférences de rappel ont été mises à jour.",
    })
  }

  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
  }

  // Obtenir le texte pour le délai de rappel
  const getReminderTimeText = (reminderTime: string) => {
    switch (reminderTime) {
      case "1hour":
        return "1 heure avant"
      case "3hours":
        return "3 heures avant"
      case "1day":
        return "1 jour avant"
      case "2days":
        return "2 jours avant"
      case "1week":
        return "1 semaine avant"
      default:
        return "1 jour avant"
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center">
          <Bell className="h-5 w-5 mr-2 text-emerald-600" />
          Rappels de rendez-vous
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="space-y-0.5">
            <Label htmlFor="reminder-toggle">Activer les rappels</Label>
            <p className="text-sm text-gray-500">Recevez des notifications pour vos rendez-vous</p>
          </div>
          <Switch
            id="reminder-toggle"
            checked={reminderSettings.enabled}
            onCheckedChange={(checked) => handleSettingChange("enabled", checked)}
          />
        </div>

        {reminderSettings.enabled && (
          <>
            <div className="flex flex-col space-y-2">
              <Label htmlFor="reminder-time">Quand souhaitez-vous être notifié ?</Label>
              <Select
                value={reminderSettings.reminderTime}
                onValueChange={(value) => handleSettingChange("reminderTime", value)}
              >
                <SelectTrigger id="reminder-time">
                  <SelectValue placeholder="Sélectionnez un délai" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1hour">1 heure avant</SelectItem>
                  <SelectItem value="3hours">3 heures avant</SelectItem>
                  <SelectItem value="1day">1 jour avant</SelectItem>
                  <SelectItem value="2days">2 jours avant</SelectItem>
                  <SelectItem value="1week">1 semaine avant</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Méthodes de notification</Label>
              <div className="flex items-center justify-between">
                <Label htmlFor="email-toggle" className="cursor-pointer">
                  Email
                </Label>
                <Switch
                  id="email-toggle"
                  checked={reminderSettings.emailEnabled}
                  onCheckedChange={(checked) => handleSettingChange("emailEnabled", checked)}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label htmlFor="sms-toggle" className="cursor-pointer">
                  SMS
                </Label>
                <Switch
                  id="sms-toggle"
                  checked={reminderSettings.smsEnabled}
                  onCheckedChange={(checked) => handleSettingChange("smsEnabled", checked)}
                />
              </div>
            </div>

            <div className="pt-2">
              <h3 className="text-sm font-medium mb-2">Prochains rappels</h3>
              {nextAppointments.length > 0 ? (
                <div className="space-y-3">
                  {nextAppointments.map((appointment) => (
                    <div key={appointment.id} className="flex items-start p-2 border rounded-md bg-gray-50">
                      <div className="bg-emerald-100 p-2 rounded-md mr-3">
                        <Calendar className="h-4 w-4 text-emerald-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium">{appointment.type}</p>
                        <p className="text-xs text-gray-500">
                          {formatDate(appointment.date)} • {appointment.time}
                        </p>
                        <p className="text-xs text-emerald-600 mt-1">
                          Rappel prévu {getReminderTimeText(reminderSettings.reminderTime)}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-500">Aucun rendez-vous à venir</p>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
