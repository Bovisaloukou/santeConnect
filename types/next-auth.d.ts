import "next-auth"

declare module "next-auth" {
  interface User {
    is2FAEnabled?: boolean
    is2FAVerified?: boolean
  }
  
  interface Session {
    user: User & {
      is2FAEnabled?: boolean
      is2FAVerified?: boolean
    }
  }
} 