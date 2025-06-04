"use client"

import { useState, useRef, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/lib/user-context"
import { Send, Search } from "lucide-react"
import { ScrollArea } from "@/components/ui/scroll-area"
import { ContactItem } from "./components/ContactItem"
import { MessageBubble } from "./components/MessageBubble"
import { mockContacts, mockMessages } from "./mockData"
import { Contact, Message } from "./types"
import LoadingSpinner from "@/components/ui/loading-spinner"

export default function PatientMessagesPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { user, isLoading } = useUser()
  const [contacts, setContacts] = useState<Contact[]>(mockContacts)
  const [selectedContact, setSelectedContact] = useState<Contact | null>(null)
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState("")
  const [searchQuery, setSearchQuery] = useState("")
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isLoading && !user) {
      router.push("/login")
    } else if (user && user.role !== "patient") {
      router.push(`/dashboard/${user.role}`)
    }
  }, [user, isLoading, router])

  useEffect(() => {
    if (selectedContact) {
      setMessages(mockMessages[selectedContact.id] || [])
    }
  }, [selectedContact])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (!newMessage.trim() || !selectedContact) return

    const newMsg: Message = {
      id: `msg-${Date.now()}`,
      content: newMessage,
      senderId: "user",
      timestamp: new Date(),
      status: 'sent'
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
  }

  const filteredContacts = contacts.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  return (
    <div className="flex h-[calc(100vh-80px)] overflow-hidden">
      <div className="flex-1 flex flex-col">
        <h1 className="text-2xl font-bold mb-6">Mes Messages</h1>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 h-[calc(100vh-200px)]">
          {/* Liste des contacts */}
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
            <ScrollArea className="h-[calc(100%-70px)]">
              {filteredContacts.length === 0 ? (
                <p className="text-center text-gray-500 p-4">Aucun contact trouvé</p>
              ) : (
                filteredContacts.map((contact) => (
                  <ContactItem
                    key={contact.id}
                    contact={contact}
                    isSelected={selectedContact?.id === contact.id}
                    onClick={() => setSelectedContact(contact)}
                  />
                ))
              )}
            </ScrollArea>
          </div>

          {/* Fenêtre de chat */}
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

                <ScrollArea className="flex-1 p-4 bg-gray-50">
                  {messages.length === 0 ? (
                    <p className="text-center text-gray-500">Aucun message</p>
                  ) : (
                    messages.map((message) => (
                      <MessageBubble
                        key={message.id}
                        message={message}
                        isOwnMessage={message.senderId === "user"}
                      />
                    ))
                  )}
                  <div ref={messagesEndRef} />
                </ScrollArea>

                <div className="p-4 border-t bg-white">
                  <div className="flex items-center">
                    <Input
                      placeholder="Tapez votre message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                      className="flex-1"
                    />
                    <Button
                      onClick={handleSendMessage}
                      disabled={!newMessage.trim()}
                      className="ml-2"
                      size="icon"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <h3 className="font-medium text-gray-500">
                    Sélectionnez un contact pour commencer une conversation
                  </h3>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
