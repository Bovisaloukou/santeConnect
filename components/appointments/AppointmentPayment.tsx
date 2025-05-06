"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { CreditCard, CheckCircle, Wallet, Smartphone } from "lucide-react"
import { useToast } from "@/components/ui/use-toast"
import type { Appointment } from "@/lib/types"

interface AppointmentPaymentProps {
  appointments: Appointment[]
  onUpdatePayment: (appointmentId: string, paymentStatus: "pending" | "paid" | "refunded") => void
}

export default function AppointmentPayment({ appointments, onUpdatePayment }: AppointmentPaymentProps) {
  const { toast } = useToast()
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null)
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false)
  const [paymentMethod, setPaymentMethod] = useState<"card" | "mobile" | "cash">("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardDetails, setCardDetails] = useState({
    number: "",
    name: "",
    expiry: "",
    cvc: "",
  })

  // Filtrer les rendez-vous qui nécessitent un paiement
  const appointmentsRequiringPayment = appointments.filter(
    (appointment) =>
      appointment.status !== "cancelled" && (!appointment.paymentStatus || appointment.paymentStatus === "pending"),
  )

  // Trier par date (les plus proches d'abord)
  const sortedAppointments = [...appointmentsRequiringPayment].sort((a, b) => {
    return new Date(a.date).getTime() - new Date(b.date).getTime()
  })

  // Formater la date pour l'affichage
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString("fr-FR", {
      weekday: "long",
      day: "numeric",
      month: "long",
    })
  }

  // Calculer le prix du rendez-vous (fictif)
  const calculateAppointmentPrice = (appointment: Appointment) => {
    // Dans un cas réel, cela viendrait du backend
    const basePrice = appointment.type.includes("urgente") ? 50 : 35
    return basePrice
  }

  // Gérer le paiement
  const handlePayment = async () => {
    if (!selectedAppointment) return

    setIsProcessing(true)

    try {
      // Simuler un appel API
      await new Promise((resolve) => setTimeout(resolve, 2000))

      onUpdatePayment(selectedAppointment.id, "paid")

      toast({
        title: "Paiement effectué",
        description: "Votre paiement a été traité avec succès.",
      })

      setIsPaymentDialogOpen(false)
      setSelectedAppointment(null)
    } catch (error) {
      toast({
        title: "Erreur de paiement",
        description: "Une erreur est survenue lors du traitement du paiement.",
        variant: "destructive",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <CreditCard className="h-5 w-5 mr-2 text-emerald-600" />
            Paiements en attente
          </CardTitle>
        </CardHeader>
        <CardContent>
          {sortedAppointments.length === 0 ? (
            <div className="text-center py-6 bg-gray-50 rounded-lg">
              <p className="text-gray-500">Aucun paiement en attente.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {sortedAppointments.map((appointment) => (
                <div key={appointment.id} className="p-4 border rounded-lg">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-3">
                    <div>
                      <h3 className="font-medium">{appointment.type}</h3>
                      <p className="text-sm text-gray-500">
                        {formatDate(appointment.date)} • {appointment.time}
                      </p>
                    </div>
                    <Badge className="bg-amber-500 mt-2 sm:mt-0">Paiement en attente</Badge>
                  </div>

                  <div className="flex justify-between items-center">
                    <div className="text-lg font-semibold">{calculateAppointmentPrice(appointment)} €</div>
                    <Button
                      onClick={() => {
                        setSelectedAppointment(appointment)
                        setIsPaymentDialogOpen(true)
                      }}
                    >
                      Payer maintenant
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog de paiement */}
      <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Paiement du rendez-vous</DialogTitle>
          </DialogHeader>

          {selectedAppointment && (
            <div className="py-4">
              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Rendez-vous:</span>
                  <span className="font-medium">{selectedAppointment.type}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Date:</span>
                  <span>{formatDate(selectedAppointment.date)}</span>
                </div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Heure:</span>
                  <span>{selectedAppointment.time}</span>
                </div>
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>{calculateAppointmentPrice(selectedAppointment)} €</span>
                </div>
              </div>

              <Tabs defaultValue="card" onValueChange={(value) => setPaymentMethod(value as any)}>
                <TabsList className="grid grid-cols-3 mb-4">
                  <TabsTrigger value="card">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Carte
                  </TabsTrigger>
                  <TabsTrigger value="mobile">
                    <Smartphone className="h-4 w-4 mr-2" />
                    Mobile
                  </TabsTrigger>
                  <TabsTrigger value="cash">
                    <Wallet className="h-4 w-4 mr-2" />
                    Espèces
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="card" className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="card-number">Numéro de carte</Label>
                    <Input
                      id="card-number"
                      placeholder="1234 5678 9012 3456"
                      value={cardDetails.number}
                      onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="card-name">Nom sur la carte</Label>
                    <Input
                      id="card-name"
                      placeholder="J. DUPONT"
                      value={cardDetails.name}
                      onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Date d'expiration</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/AA"
                        value={cardDetails.expiry}
                        onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvc">CVC</Label>
                      <Input
                        id="cvc"
                        placeholder="123"
                        value={cardDetails.cvc}
                        onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
                      />
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="mobile">
                  <div className="space-y-4">
                    <div className="bg-amber-50 p-3 rounded-md border border-amber-200">
                      <p className="text-sm text-amber-800">
                        Vous recevrez un SMS avec un lien pour effectuer le paiement via votre opérateur mobile.
                      </p>
                    </div>
                    <RadioGroup defaultValue="mtn">
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="mtn" id="mtn" />
                        <Label htmlFor="mtn">MTN Mobile Money</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="orange" id="orange" />
                        <Label htmlFor="orange">Orange Money</Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="moov" id="moov" />
                        <Label htmlFor="moov">Moov Money</Label>
                      </div>
                    </RadioGroup>
                  </div>
                </TabsContent>

                <TabsContent value="cash">
                  <div className="space-y-4">
                    <div className="bg-blue-50 p-3 rounded-md border border-blue-200">
                      <p className="text-sm text-blue-800">
                        Vous pourrez payer en espèces directement au cabinet médical avant votre rendez-vous.
                      </p>
                    </div>
                    <div className="flex items-center p-3 border rounded-md">
                      <CheckCircle className="h-5 w-5 text-emerald-500 mr-3" />
                      <div>
                        <p className="font-medium">Paiement sur place</p>
                        <p className="text-sm text-gray-500">Veuillez arriver 15 minutes avant votre rendez-vous</p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsPaymentDialogOpen(false)}>
              Annuler
            </Button>
            <Button onClick={handlePayment} disabled={isProcessing}>
              {isProcessing
                ? "Traitement..."
                : `Payer ${selectedAppointment ? calculateAppointmentPrice(selectedAppointment) : 0} €`}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
