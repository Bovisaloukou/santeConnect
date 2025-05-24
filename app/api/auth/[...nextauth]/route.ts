import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
// N'importe plus la fonction de vérification du mot de passe locale car le backend s'en chargera
// import { verifyPassword } from "./lib/auth";
import type { UserRole, User } from "@/lib/types"; // Assurez-vous que ce chemin est correct

// Supprimez la simulation de la base de données locale
// const users = [...];

// Configurez les options d'authentification
export const config: NextAuthConfig = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
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
            return null;
          }

          const email = credentials.email as string;
          const password = credentials.password as string;

          // Appeler votre API backend pour la connexion
          const response = await fetch("https://med-api-exy6.onrender.com/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, password }),
          });

          // Vérifier si la réponse est OK (statut 200 ou 201)
          if (!response.ok) {
            const errorData = await response.json();
            console.error("Backend login failed:", errorData);
            return null; // Retourner null si l'API signale un échec de connexion
          }

          const data = await response.json();

          // L'API backend a réussi la connexion, retourner l'objet utilisateur et l'access_token
          // Assurez-vous que l'objet retourné ici correspond à la structure User attendue ou est compatible
          // J'ajoute l'access_token à l'objet utilisateur temporairement pour le passer aux callbacks
          const user = {
            id: data.user.id,
            email: data.user.email,
            firstName: data.user.firstName,
            lastName: data.user.lastName,
            name: `${data.user.firstName} ${data.user.lastName}`.trim() || data.user.email, // Créer un nom si possible
            accessToken: data.access_token, // Stocker l'access_token
            // Ajoutez d'autres champs de l'utilisateur si nécessaire
          };

          console.log("Backend login successful, user:", user);
          return user as User; // Retourner l'objet utilisateur pour que NextAuth crée une session

        } catch (error) {
          console.error("Error calling backend login API:", error);
          return null; // Retourner null en cas d'erreur pendant l'appel API
        }
      },
    }),
  ],
  // Ajoutez d'autres configurations comme les pages personnalisées, les callbacks, etc.
  pages: {
    signIn: "/login", // Redirige vers votre page de connexion personnalisée si non authentifié
  },
  callbacks: {
    async jwt({ token, user }) {
      // Ajouter des informations utilisateur et l'access_token au token JWT
      if (user) {
        (token as any).accessToken = (user as any).accessToken; // Ajouter l'access_token au token
      }
      return token;
    },
    async session({ session, token }) {
      // Exposer les informations du token (y compris access_token) à la session côté client
      if (session.user) {
        (session.user as any).accessToken = (token as any).accessToken; // Exposer l'access_token à la session
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  // Ajouter cette option pour les environnements de production
  // session: { strategy: "jwt" }, // Utiliser la stratégie JWT pour les sessions
};

// Initialisez NextAuth avec la configuration
export const { handlers, auth, signIn, signOut } = NextAuth(config);

// Exporter les gestionnaires pour les routes API
export const GET = handlers.GET;
export const POST = handlers.POST; 