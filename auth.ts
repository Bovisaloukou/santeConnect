import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google"; // Importez le fournisseur Google
import CredentialsProvider from "next-auth/providers/credentials"; // Importez le fournisseur Credentials
import { verifyPassword } from "./lib/auth"; // Importez la fonction de vérification du mot de passe
import type { UserRole, User } from "./lib/types"; // Importez UserRole et User

// Simuler une base de données d'utilisateurs avec mots de passe hachés
// Dans une application réelle, ces données seraient dans une base de données
const users = [
  {
    id: "user-1",
    email: "patient@example.com",
    // Le mot de passe serait haché dans une vraie application
    password: "$2a$10$8r5tFBr5M1VVj84bpU6QR.Y1YhVE4mHnbcqRL9Oty/9qJGTQV2Ope", // "password123" haché
    name: "Jean Dupont",
    role: "patient" as UserRole,
  },
  {
    id: "user-2",
    email: "doctor@example.com",
    password: "$2a$10$8r5tFBr5M1VVj84bpU6QR.Y1YhVE4mHnbcqRL9Oty/9qJGTQV2Ope", // "password123" haché
    name: "Dr. Marie Koné",
    role: "healthcare" as UserRole,
  },
  {
    id: "user-3",
    email: "pharmacy@example.com",
    password: "$2a$10$8r5tFBr5M1VVj84bpU6QR.Y1YhVE4mHnbcqRL9Oty/9qJGTQV2Ope", // "password123" haché
    name: "Pharmacie Centrale",
    role: "pharmacy" as UserRole,
  },
  {
    id: "user-4",
    email: "admin@example.com",
    password: "$2a$10$8r5tFBr5M1VVj84bpU6QR.Y1YhVE4mHnbcqRL9Oty/9qJGTQV2Ope", // "password123" haché
    name: "Admin",
    role: "admin" as UserRole,
  },
];

// Configurez les options d'authentification
export const config: NextAuthConfig = {
  providers: [
    // Ajoutez ici vos fournisseurs d'authentification
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID, // Utilise la variable d'environnement
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Utilise la variable d'environnement
    }),
    // Ajoutez d'autres fournisseurs ou un fournisseur de credentials ici si nécessaire
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Mot de passe", type: "password" },
      },
      async authorize(credentials, req): Promise<User | null> {
        try {
          if (!credentials?.email || !credentials?.password) {
            console.error("Authorize error: Missing credentials.");
            return null; // Aucune information d'identification fournie
          }

          const email = credentials.email as string;
          const password = credentials.password as string;

          // N'affichez PAS le mot de passe en clair dans les logs en production pour des raisons de sécurité,
          // mais pour le débogage local c'est acceptable. Soyez prudent.

          // Gérer le cas de l'utilisateur de démo
          let user = users.find((u) => u.email === email);

          if (email === "demo") {
            // Trouver un utilisateur de démo basé sur le mot de passe (simplifié pour la démo)
            if (password === "demo" || password === "password123") {
              // Ici, on pourrait choisir un utilisateur par défaut pour la démo si l'email est 'demo'
              // Pour l'instant, utilisons patient par défaut si 'demo' est utilisé comme email
              user = users.find(u => u.email === "patient@example.com");
            }
          }
          

          // Si l'utilisateur n'est toujours pas trouvé (pas un utilisateur de démo valide)
          if (!user) {
            return null; // Utilisateur non trouvé
          }

          // Vérifier le mot de passe (en utilisant votre fonction personnalisée)
          const passwordValid = await verifyPassword(password, user.password);


          if (!passwordValid) {
            return null; // Mot de passe incorrect
          }

          // Retourner l'objet utilisateur si l'authentification réussit
          // C'est l'objet qui sera ajouté au token et à la session
          return {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          };
        } catch (error) {
          console.error("Error during authorize:", error);
          return null; // Retourner null en cas d'erreur
        }
      },
    }),
  ],
  // Ajoutez d'autres configurations comme les pages personnalisées, les callbacks, etc.
  // pages: {
  //   signIn: "/login", // Redirige vers votre page de connexion personnalisée
  // },
  callbacks: {
    async jwt({ token, user }) {
      try {
        // Ajouter des informations utilisateur au token JWT
        if (user) {
          token.id = user.id;
          token.role = (user as any).role; // Ajouter le rôle au token
        }
        return token;
      } catch (error) {
        console.error("Error during jwt callback:", error);
        return token; // Retourner le token actuel même en cas d'erreur
      }
    },
    async session({ session, token }) {
      try {
        // Exposer les informations du token à la session côté client
        if (session.user) {
          session.user.id = token.id as string;
          (session.user as any).role = token.role; // Exposer le rôle à la session
        }
        return session;
      } catch (error) {
        console.error("Error during session callback:", error);
        return session; // Retourner la session actuelle même en cas d'erreur
      }
    },
  },
  secret: process.env.AUTH_SECRET, // Assurez-vous d'avoir cette variable dans votre .env.local
};

// Initialisez NextAuth avec la configuration
export const { handlers, auth, signIn, signOut } = NextAuth(config); 