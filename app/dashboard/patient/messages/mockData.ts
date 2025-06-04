import { Contact, Message } from './types';

export const mockContacts: Contact[] = [
  {
    id: "1",
    name: "Dr. Marie Koné",
    role: "Médecin généraliste",
    lastMessage: "Bonjour, comment allez-vous ?",
    lastMessageTime: new Date(),
    unreadCount: 2
  },
  {
    id: "2",
    name: "Pharmacie Centrale",
    role: "Pharmacie",
    lastMessage: "Votre médicament est disponible",
    lastMessageTime: new Date(Date.now() - 3600000),
    unreadCount: 0
  },
  {
    id: "3",
    name: "Dr. Amadou Diallo",
    role: "Cardiologue",
    lastMessage: "N'oubliez pas votre rendez-vous",
    lastMessageTime: new Date(Date.now() - 7200000),
    unreadCount: 1
  }
];

export const mockMessages: Record<string, Message[]> = {
  "1": [
    {
      id: "1",
      content: "Bonjour, comment allez-vous ?",
      senderId: "1",
      timestamp: new Date(Date.now() - 3600000),
      status: 'read'
    },
    {
      id: "2",
      content: "Je vais bien, merci docteur",
      senderId: "user",
      timestamp: new Date(Date.now() - 3500000),
      status: 'read'
    }
  ],
  "2": [
    {
      id: "3",
      content: "Votre médicament est disponible",
      senderId: "2",
      timestamp: new Date(Date.now() - 3600000),
      status: 'read'
    }
  ],
  "3": [
    {
      id: "4",
      content: "N'oubliez pas votre rendez-vous",
      senderId: "3",
      timestamp: new Date(Date.now() - 7200000),
      status: 'delivered'
    }
  ]
}; 