import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { User } from "@/lib/types"; // Assurez-vous que ce chemin est correct
import { authApi } from "@/lib/apiClient";

// RENOMMEZ CECI et ne l'exportez pas directement si ce n'est pas nécessaire ailleurs.
// Si vous devez l'exporter, utilisez un autre nom comme `authOptions`.
const authConfig: NextAuthConfig = { // <--- Changement ici (plus d'export direct en tant que 'config')
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

          try {
            const data = await authApi.login(email, password);

            if (!data.user || !data.access_token) {
              console.error("Backend login response missing user or access_token:", data);
              throw new Error("Réponse du serveur invalide");
            }
            
            const user = {
              id: data.user.id.toString(),
              email: data.user.email,
              firstName: data.user.firstName,
              lastName: data.user.lastName,
              name: `${data.user.firstName} ${data.user.lastName}`.trim() || data.user.email,
              accessToken: data.access_token,
            };

            console.log("Backend login successful, user:", user);
            return user as User;
          } catch (error: any) {
            console.error("Error calling backend login API:", error);
            if (error?.response?.status === 401) {
              throw new Error("Identifiants invalides");
            }
            throw new Error("Erreur lors de la connexion");
          }
        } catch (error) {
          console.error("Error in authorize:", error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user, account }) { // account peut être utile ici
      if (account && user) { // Souvent, le accessToken vient avec `account` lors de la connexion OAuth ou d'un retour `authorize`
        // Pour le provider Credentials, l'accessToken est ajouté à l'objet `user` dans `authorize`
        token.accessToken = (user as any).accessToken;
        token.id = user.id; // Stockez l'ID utilisateur dans le token si besoin
        // Ajoutez d'autres propriétés de l'utilisateur au token si nécessaire
        // token.firstName = (user as any).firstName;
        // token.lastName = (user as any).lastName;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).accessToken = token.accessToken;
        (session.user as any).id = token.id; // Exposez l'ID à la session
        // (session.user as any).firstName = token.firstName;
        // (session.user as any).lastName = token.lastName;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  session: { strategy: "jwt" }, // C'est une bonne pratique de le spécifier
};

// Initialisez NextAuth avec la configuration renommée
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig); // <--- Utilisez authConfig ici

// Exporter les gestionnaires pour les routes API
// NextAuth v5 retourne directement les handlers GET et POST dans l'objet `handlers`
export const GET = handlers.GET;
export const POST = handlers.POST;