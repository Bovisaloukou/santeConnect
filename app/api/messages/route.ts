import { type NextRequest, NextResponse } from "next/server"
import { withAuth } from "@/lib/auth"

// Simuler une base de données de messages
const messages = [
  {
    id: "message-1",
    senderId: "user-1", // Patient
    receiverId: "user-2", // Médecin
    content: "Bonjour Docteur, comment dois-je prendre mon médicament?",
    read: true,
    createdAt: new Date("2023-05-15T10:30:00"),
  },
  {
    id: "message-2",
    senderId: "user-2", // Médecin
    receiverId: "user-1", // Patient
    content: "Bonjour, prenez un comprimé matin et soir avec un repas.",
    read: true,
    createdAt: new Date("2023-05-15T11:15:00"),
  },
  {
    id: "message-3",
    senderId: "user-1", // Patient
    receiverId: "user-2", // Médecin
    content: "Merci pour votre réponse. Y a-t-il des effets secondaires à surveiller?",
    read: false,
    createdAt: new Date("2023-05-15T14:20:00"),
  },
]

// Récupérer les messages d'un utilisateur
async function getMessages(req: NextRequest, user: any) {
  const { searchParams } = new URL(req.url)
  const otherUserId = searchParams.get("userId")

  let filteredMessages = [...messages]

  // Filtrer les messages de l'utilisateur
  filteredMessages = filteredMessages.filter(
    (message) => message.senderId === user.id || message.receiverId === user.id,
  )

  // Filtrer par conversation avec un autre utilisateur
  if (otherUserId) {
    filteredMessages = filteredMessages.filter(
      (message) =>
        (message.senderId === user.id && message.receiverId === otherUserId) ||
        (message.senderId === otherUserId && message.receiverId === user.id),
    )
  }

  // Trier par date
  filteredMessages.sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime())

  return NextResponse.json(filteredMessages)
}

// Envoyer un message
async function sendMessage(req: NextRequest, user: any) {
  const messageData = await req.json()

  // Validation des données
  if (!messageData.receiverId || !messageData.content) {
    return NextResponse.json({ error: "Données de message incomplètes" }, { status: 400 })
  }

  // Créer un nouveau message
  const newMessage = {
    id: `message-${messages.length + 1}`,
    senderId: user.id,
    receiverId: messageData.receiverId,
    content: messageData.content,
    read: false,
    createdAt: new Date(),
  }

  // Dans une application réelle, nous ajouterions le message à la base de données
  messages.push(newMessage)

  return NextResponse.json({
    message: newMessage,
    status: "Message envoyé avec succès",
  })
}

// Marquer un message comme lu
async function markMessageAsRead(req: NextRequest, user: any) {
  const { searchParams } = new URL(req.url)
  const messageId = searchParams.get("id")

  if (!messageId) {
    return NextResponse.json({ error: "ID de message manquant" }, { status: 400 })
  }

  // Trouver le message
  const messageIndex = messages.findIndex((message) => message.id === messageId)

  if (messageIndex === -1) {
    return NextResponse.json({ error: "Message non trouvé" }, { status: 404 })
  }

  // Vérifier que l'utilisateur est le destinataire
  if (messages[messageIndex].receiverId !== user.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 })
  }

  // Marquer le message comme lu
  messages[messageIndex].read = true

  return NextResponse.json({
    message: messages[messageIndex],
    status: "Message marqué comme lu",
  })
}

export const GET = withAuth(getMessages)
export const POST = withAuth(sendMessage)
export const PUT = withAuth(markMessageAsRead)
