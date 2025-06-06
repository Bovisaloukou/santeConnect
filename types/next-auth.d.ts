import "next-auth"

declare module "next-auth" {
  interface User {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
    accessToken?: string
    isEnabled?: boolean
    is2FAEnabled?: boolean
    is2FAVerified?: boolean
    roles?: string[]
    pharmacyUuid?: string
    healthCenterUuid?: string
    healthServiceUuid?: string
    error?: any
  }
  
  interface Session {
    user: {
      id?: string
      name?: string | null
      email?: string | null
      image?: string | null
      accessToken?: string
      isEnabled?: boolean
      is2FAEnabled?: boolean
      is2FAVerified?: boolean
      roles?: string[]
      pharmacyUuid?: string
      healthCenterUuid?: string
      healthServiceUuid?: string
      error?: any
    }
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id?: string
    name?: string | null
    email?: string | null
    image?: string | null
    accessToken?: string
    isEnabled?: boolean
    is2FAEnabled?: boolean
    is2FAVerified?: boolean
    roles?: string[]
    pharmacyUuid?: string
    healthCenterUuid?: string
    healthServiceUuid?: string
    error?: any
  }
} 