import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      name?: string | null
      pseudo?: string | null
      isAdmin?: boolean
      roles?: string[]
    }
  }

  interface User {
    id: string
    email: string
    name?: string | null
    pseudo?: string | null
    isAdmin?: boolean
    roles?: string[]
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    email: string
    name?: string | null
    pseudo?: string | null
    isAdmin?: boolean
    roles?: string[]
  }
}

