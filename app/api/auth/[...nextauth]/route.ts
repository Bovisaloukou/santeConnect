import NextAuth from "next-auth";
import type { NextAuthConfig } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import CredentialsProvider from "next-auth/providers/credentials";
import type { User } from "@/lib/types";
import { authApi } from "@/lib/api/auth";

// RENOMMEZ CECI et ne l'exportez pas directement si ce n'est pas nécessaire ailleurs.
// Si vous devez l'exporter, utilisez un autre nom comme `authOptions`.
export const authConfig: NextAuthConfig = {
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

            if (!data.user || !data.accessToken) {
              console.error("Backend login response missing user or access_token:", data);
              return null;
            }
            
            const user = {
              id: data.user.id.toString(),
              createdAt: data.user.createdAt,
              email: data.user.email,
              firstName: data.user.firstName,
              lastName: data.user.lastName,
              name: `${data.user.firstName} ${data.user.lastName}`.trim() || data.user.email,
              gender: data.user.gender || "Non spécifié",
              birthDate: data.user.birthDate || new Date().toISOString(),
              contact: data.user.contact || "",
              isEnabled: data.user.isEnabled || false,
              is2FAEnabled: data.user.is2FAEnabled || false,
              is2FAVerified: data.user.is2FAVerified || false,
              accessToken: data.accessToken,
              roles: data.user.roles || ['PATIENT'],
              pharmacyUuid: data.user.pharmacies?.[0]?.uuid || null,
              healthCenterUuid: data.user.healthCenters?.[0]?.uuid || null,
              healthServiceUuid: data.user.healthCenters?.[0]?.healthServices?.[0]?.uuid || null,
            };

            if (!user.isEnabled) {
              return null;
            }

            return user as User;
          } catch (error: any) {
            console.error("Error calling backend login API:", error);
            return null;
          }
        } catch (error) {
          console.error("Error in authorize:", error);
          return null;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async signIn({ user, account, profile, email, credentials }) {
      if (!user) {
        // Récupérer les informations d'erreur depuis la requête
        const error = (credentials as any)?.error;
        if (error) {
          // Stocker l'erreur dans la session
          (user as any).error = error;
        }
        return false;
      }
      return true;
    },
    async jwt({ token, user, account, trigger, session }) {
      if (account && user) {
        token.accessToken = (user as any).accessToken;
        token.id = user.id;
        token.name = (user as any).name;
        token.isEnabled = (user as any).isEnabled;
        token.is2FAEnabled = (user as any).is2FAEnabled;
        token.is2FAVerified = (user as any).is2FAVerified;
        token.error = (user as any).error;
        token.roles = (user as any).roles;
        token.pharmacyUuid = (user as any).pharmacyUuid;
        token.healthCenterUuid = (user as any).healthCenterUuid;
        token.healthServiceUuid = (user as any).healthServiceUuid;
      }
      
      // Mise à jour du token si la session a été mise à jour
      if (trigger === "update" && session) {
        token.is2FAVerified = session.user.is2FAVerified;
        token.roles = session.user.roles;
        token.pharmacyUuid = session.user.pharmacyUuid;
        token.healthCenterUuid = session.user.healthCenterUuid;
        token.healthServiceUuid = session.user.healthServiceUuid;
      }
      
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        (session.user as any).accessToken = token.accessToken;
        (session.user as any).id = token.id;
        (session.user as any).name = token.name;
        (session.user as any).isEnabled = token.isEnabled;
        (session.user as any).is2FAEnabled = token.is2FAEnabled;
        (session.user as any).is2FAVerified = token.is2FAVerified;
        (session.user as any).error = token.error;
        (session.user as any).roles = token.roles;
        (session.user as any).pharmacyUuid = token.pharmacyUuid;
        (session.user as any).healthCenterUuid = token.healthCenterUuid;
        (session.user as any).healthServiceUuid = token.healthServiceUuid;
      }
      return session;
    },
  },
  secret: process.env.AUTH_SECRET,
  session: { 
    strategy: "jwt",
    maxAge: 24 * 60 * 60 // 24 heures en secondes
  },
  useSecureCookies: process.env.NODE_ENV === "production",
};

// Initialisez NextAuth avec la configuration renommée
export const { handlers, auth, signIn, signOut } = NextAuth(authConfig); // <--- Utilisez authConfig ici

// Exporter les gestionnaires pour les routes API
// NextAuth v5 retourne directement les handlers GET et POST dans l'objet `handlers`
export const GET = handlers.GET;
export const POST = handlers.POST;