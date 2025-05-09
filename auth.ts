import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google"; // Importez le fournisseur Google

// Configurez les options d'authentification
export const config: NextAuthConfig = {
  providers: [
    // Ajoutez ici vos fournisseurs d'authentification
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID, // Utilise la variable d'environnement
      clientSecret: process.env.GOOGLE_CLIENT_SECRET, // Utilise la variable d'environnement
    }),
    // Ajoutez d'autres fournisseurs ou un fournisseur de credentials ici si nécessaire
  ],
  // Ajoutez d'autres configurations comme les pages personnalisées, les callbacks, etc.
  // pages: {
  //   signIn: "/login", // Redirige vers votre page de connexion personnalisée
  // },
  // callbacks: {
  //   async jwt({ token, user }) {
  //     // Ajouter des informations utilisateur au token JWT
  //     if (user) {
  //       token.id = user.id;
  //       // Ajoutez d'autres champs utilisateur si nécessaire
  //     }
  //     return token;
  //   },
  //   async session({ session, token }) {
  //     // Exposer les informations du token à la session côté client
  //     if (session.user) {
  //       session.user.id = token.id as string;
  //       // Exposez d'autres champs utilisateur si nécessaire
  //     }
  //     return session;
  //   },
  // },
  // secret: process.env.AUTH_SECRET, // Assurez-vous d'avoir cette variable dans votre .env.local
};

// Initialisez NextAuth avec la configuration
export const { handlers, auth, signIn, signOut } = NextAuth(config); 