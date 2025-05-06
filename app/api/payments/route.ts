import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth"

// Simuler une base de données de paiements
const payments = [
  {
    id: "payment-1",
    userId: "user-1",
    amount: 50.0,
    currency: "XOF",
    method: "mtn",
    status: "completed",
    reference: "MTN123456789",
    relatedTo: {
      type: "appointment",
      id: "appointment-1",
    },
    createdAt: new Date("2023-05-20"),
    updatedAt: new Date("2023-05-20"),
  },
  {
    id: "payment-2",
    userId: "user-2",
    amount: 25.0,
    currency: "XOF",
    method: "moov",
    status: "completed",
    reference: "MOOV987654321",
    relatedTo: {
      type: "prescription",
      id: "prescription-1",
    },
    createdAt: new Date("2023-05-15"),
    updatedAt: new Date("2023-05-15"),
  },
]

// Récupérer les paiements d'un utilisateur
async function getPayments(req: NextRequest, user: any) {
  // Filtrer les paiements de l'utilisateur
  const userPayments = payments.filter((payment) => payment.userId === user.id)

  return NextResponse.json(userPayments)
}

// Créer un paiement
async function createPayment(req: NextRequest, user: any) {
  const paymentData = await req.json()

  // Validation des données
  if (
    !paymentData.amount ||
    !paymentData.currency ||
    !paymentData.method ||
    !paymentData.relatedTo?.type ||
    !paymentData.relatedTo?.id
  ) {
    return NextResponse.json({ error: "Données de paiement incomplètes" }, { status: 400 })
  }

  // Simuler l'intégration avec une passerelle de paiement
  const paymentReference = `${paymentData.method.toUpperCase()}${Date.now()}`

  // Créer un nouveau paiement
  const newPayment = {
    id: `payment-${payments.length + 1}`,
    userId: user.id,
    amount: paymentData.amount,
    currency: paymentData.currency,
    method: paymentData.method,
    status: "pending", // Initialement en attente
    reference: paymentReference,
    relatedTo: paymentData.relatedTo,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  // Dans une application réelle, nous ajouterions le paiement à la base de données
  payments.push(newPayment)

  // Simuler un paiement réussi après 2 secondes
  setTimeout(() => {
    const paymentIndex = payments.findIndex((payment) => payment.id === newPayment.id)
    if (paymentIndex !== -1) {
      payments[paymentIndex].status = "completed"
      payments[paymentIndex].updatedAt = new Date()
    }
  }, 2000)

  return NextResponse.json({
    payment: newPayment,
    redirectUrl: `/payment/confirm?reference=${paymentReference}`,
    message: "Paiement initié avec succès",
  })
}

// Vérifier le statut d'un paiement
async function checkPaymentStatus(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const reference = searchParams.get("reference")

  if (!reference) {
    return NextResponse.json({ error: "Référence de paiement manquante" }, { status: 400 })
  }

  // Trouver le paiement
  const payment = payments.find((payment) => payment.reference === reference)

  if (!payment) {
    return NextResponse.json({ error: "Paiement non trouvé" }, { status: 404 })
  }

  return NextResponse.json({
    payment,
    message: `Statut du paiement: ${payment.status}`,
  })
}

export const GET = withAuth(getPayments)
export const POST = withAuth(createPayment)
export const PUT = checkPaymentStatus
