import "next-auth"

declare module "next-auth" {
  interface User {
    is2FAEnabled?: boolean
  }
  
  interface Session {
    user: User & {
      is2FAEnabled?: boolean
    }
  }
} 