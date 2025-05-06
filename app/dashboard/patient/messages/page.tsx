"use client"

import { useEffect, useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/lib/user-context"
import { Send, Search } from "lucide-react"

// Types pour les messages et les contacts
interface Message {
  id: string
  senderId: string
  receiverId: string
  content: string
  read: boolean
  createdAt: Date
}

interface Contact {
  id: string
  name: string
  role: string
  avatar?: string
  lastMessage?: string
  lastMessageTime?: Date
  unreadCount: number
}

export default function PatientMessagesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isLoading } = useUser()
  const [contacts, setContacts] = useState<Contact[]>([])
  const [messages, setMessages] = useState<Message[]>([])
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (user && user.role !== "patient") {
      router.push(`/dashboard/${user.role}`)
    } else if (user) {
      fetchContacts()
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (selectedContact) {
      fetchMessages(selectedContact.id)
    }
  }, [selectedContact])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const fetchContacts = async () => {
    try {
      // Dans une application réelle, nous ferions un appel API
      // Simuler des contacts pour l'exemple
      setContacts([
        {
          id: "user-2",
          name: "Dr. Marie Koné",
          role: "Médecin généraliste",
          avatar: "/placeholder-user.jpg",
          lastMessage: "Bonjour, comment vous sentez-vous après notre dernière consultation?",
          lastMessageTime: new Date("2023-05-18T14:30:00"),
          unreadCount: 1,
        },
        {
          id: "user-3",
          name: "Pharmacie Centrale",
          role: "Pharmacie",
          avatar: "/placeholder-user.jpg",
          lastMessage: "Votre médicament est disponible. Vous pouvez venir le récupérer.",
          lastMessageTime: new Date("2023-05-17T10:15:00"),
          unreadCount: 0,
        },
        {
          id: "user-6",
          name: "Dr. Amadou Diallo",
          role: "Cardiologue",
          avatar: "/placeholder-user.jpg",
          lastMessage: "N'oubliez pas votre rendez-vous demain à 15h.",
          lastMessageTime: new Date("2023-05-16T09:45:00"),
          unreadCount: 0,
        },
      ])
    } catch (error) {
      console.error("Erreur lors de la récupération des contacts:", error)
      toast({
        title: "Erreur",
        description: "Impossible de récupérer vos contacts. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  const fetchMessages = async (contactId: string) => {
    try {
      // Dans une application réelle, nous ferions un appel API
      // Simuler des messages pour l'exemple
      if (contactId === "user-2") {
        setMessages([
          {
            id: "msg-1",
            senderId: "user-2",
            receiverId: "user-1",
            content: "Bonjour, comment allez-vous aujourd'hui?",
            read: true,
            createdAt: new Date("2023-05-18T10:00:00"),
          },
          {
            id: "msg-2",
            senderId: "user-1",
            receiverId: "user-2",
            content: "Bonjour Docteur, je vais mieux. La fièvre a baissé.",
            read: true,
            createdAt: new Date("2023-05-18T10:05:00"),
          },
          {
            id: "msg-3",
            senderId: "user-2",
            receiverId: "user-1",
            content: "Excellent! Continuez à prendre vos médicaments comme prescrit.",
            read: true,
            createdAt: new Date("2023-05-18T10:10:00"),
          },
          {
            id: "msg-4",
            senderId: "user-2",
            receiverId: "user-1",
            content: "Bonjour, comment vous sentez-vous après notre dernière consultation?",
            read: false,
            createdAt: new Date("2023-05-18T14:30:00"),
          },
        ])
      } else if (contactId === "user-3") {
        setMessages([
          {
            id: "msg-5",
            senderId: "user-3",
            receiverId: "user-1",
            content: "Bonjour, nous avons reçu votre ordonnance.",
            read: true,
            createdAt: new Date("2023-05-17T09:30:00"),
          },
          {
            id: "msg-6",
            senderId: "user-1",
            receiverId: "user-3",
            content: "Merci. Quand puis-je venir chercher mes médicaments?",
            read: true,
            createdAt: new Date("2023-05-17T09:45:00"),
          },
          {
            id: "msg-7",
            senderId: "user-3",
            receiverId: "user-1",
            content: "Votre médicament est disponible. Vous pouvez venir le récupérer.",
            read: true,
            createdAt: new Date("2023-05-17T10:15:00"),
          },
        ])
      } else {
        setMessages([
          {
            id: "msg-8",
            senderId: "user-6",
            receiverId: "user-1",
            content: "Bonjour, je suis le Dr. Amadou Diallo, cardiologue.",
            read: true,
            createdAt: new Date("2023-05-16T09:00:00"),
          },
          {
            id: "msg-9",
            senderId: "user-6",
            receiverId: "user-1",
            content: "Votre médecin traitant m'a transmis votre dossier.",
            read: true,
            createdAt: new Date("2023-05-16T09:05:00"),
          },
          {
            id: "msg-10",
            senderId: "user-1",
            receiverId: "user-6",
            content: "Bonjour Docteur, merci de me contacter.",
            read: true,
            createdAt: new Date("2023-05-16T09:15:00"),
          },
          {
            id: "msg-11",
            senderId: "user-6",
            receiverId: "user-1",
            content: "N'oubliez pas votre rendez-vous demain à 15h.",
            read: true,
            createdAt: new Date("2023-05-16T09:45:00"),
          },
        ])
      }

      // Marquer les messages comme lus
      if (selectedContact) {
        const updatedContacts = contacts.map((contact) => {
          if (contact.id === selectedContact.id) {
            return { ...contact, unreadCount: 0 }
          }
          return contact
        })
        setContacts(updatedContacts)
      }
    } catch (error) {
      console.error("Erreur lors de la récupération des messages:", error)
      toast({
        title: "Erreur",
        description: "Impossible de récupérer vos messages. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedContact) return

    try {
      // Dans une application réelle, nous ferions un appel API pour envoyer le message
      // Simuler l'envoi d'un message
      const newMsg: Message = {
        id: `msg-${Date.now()}`,
        senderId: user?.id || "user-1",
        receiverId: selectedContact.id,
        content: newMessage,
        read: false,
        createdAt: new Date(),
      }

      setMessages([...messages, newMsg])
      setNewMessage("")

      // Mettre à jour le dernier message dans les contacts
      const updatedContacts = contacts.map((contact) => {
        if (contact.id === selectedContact.id) {
          return {
            ...contact,
            lastMessage: newMessage,
            lastMessageTime: new Date(),
          }
        }
        return contact
      })
      setContacts(updatedContacts)
    } catch (error) {
      console.error("Erreur lors de l'envoi du message:", error)
      toast({
        title: "Erreur",
        description: "Impossible d'envoyer votre message. Veuillez réessayer.",
        variant: "destructive",
      })
    }
  }

  const filteredContacts = contacts.filter((contact) => contact.name.toLowerCase().includes(searchQuery.toLowerCase()))

  if (isLoading) {
    return <div className="flex items-center justify-center min-h-screen">Chargement...</div>
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Messagerie</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
        <div className="md:col-span-1 border rounded-lg overflow-hidden">
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Rechercher un contact"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="overflow-y-auto h-[calc(100%-70px)]">
            {filteredContacts.length === 0 ? (
              <p className="text-center text-gray-500 p-4">Aucun contact trouvé</p>
            ) : (
              filteredContacts.map((contact) => (
                <div
                  key={contact.id}
                  className={`p-4 border-b cursor-pointer hover:bg-gray-50 ${
                    selectedContact?.id === contact.id ? "bg-gray-100" : ""
                  }`}
                  onClick={() => setSelectedContact(contact)}
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-semibold">
                      {contact.name.charAt(0)}
                    </div>
                    <div className="ml-3 flex-1">
                      <div className="flex justify-between items-center">
                        <h3 className="font-medium">{contact.name}</h3>
                        {contact.lastMessageTime && (
                          <span className="text-xs text-gray-500">
                            {new Date(contact.lastMessageTime).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-gray-500 truncate">{contact.role}</p>
                      {contact.lastMessage && <p className="text-sm text-gray-500 truncate">{contact.lastMessage}</p>}
                    </div>
                    {contact.unreadCount > 0 && (
                      <div className="ml-2 bg-emerald-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {contact.unreadCount}
                      </div>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        <div className="md:col-span-2 border rounded-lg overflow-hidden flex flex-col">
          {selectedContact ? (
            <>
              <div className="p-4 border-b bg-white">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-semibold">
                    {selectedContact.name.charAt(0)}
                  </div>
                  <div className="ml-3">
                    <h3 className="font-medium">{selectedContact.name}</h3>
                    <p className="text-sm text-gray-500">{selectedContact.role}</p>
                  </div>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
                {messages.length === 0 ? (
                  <p className="text-center text-gray-500">Aucun message</p>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`mb-4 flex ${
                        message.senderId === (user?.id || "user-1") ? "justify-end" : "justify-start"
                      }`}
                    >
                      <div
                        className={`max-w-[70%] rounded-lg p-3 ${
                          message.senderId === (user?.id || "user-1") ? "bg-emerald-500 text-white" : "bg-white border"
                        }`}
                      >
                        <p>{message.content}</p>
                        <p
                          className={`text-xs mt-1 ${
                            message.senderId === (user?.id || "user-1") ? "text-emerald-100" : "text-gray-500"
                          }`}
                        >
                          {new Date(message.createdAt).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 border-t bg-white">
                <div className="flex items-center">
                  <Input
                    placeholder="Tapez votre message..."
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                    className="flex-1"
                  />
                  <Button onClick={handleSendMessage} disabled={!newMessage.trim()} className="ml-2" size="icon">
                    <Send className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <h3 className="font-medium text-gray-500">Sélectionnez un contact pour commencer une conversation</h3>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
