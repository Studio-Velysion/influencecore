import NextAuth, { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import KeycloakProvider from 'next-auth/providers/keycloak'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export const authOptions: NextAuthOptions = {
  // CapRover / reverse proxy: permet à NextAuth d'utiliser x-forwarded-host/proto
  // pour construire automatiquement les URLs quand NEXTAUTH_URL n'est pas défini.
  trustHost: true,
  providers: [
    // Keycloak (SSO + rôles)
    ...(process.env.KEYCLOAK_ISSUER &&
    process.env.KEYCLOAK_CLIENT_ID &&
    process.env.KEYCLOAK_CLIENT_SECRET
      ? [
          KeycloakProvider({
            clientId: process.env.KEYCLOAK_CLIENT_ID,
            clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
            issuer: process.env.KEYCLOAK_ISSUER,
          }),
        ]
      : []),
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email,
          },
        })

        if (!user) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.passwordHash
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          name: user.name,
          pseudo: user.pseudo,
          isAdmin: user.isAdmin,
        }
      },
    }),
  ],
  pages: {
    signIn: '/login',
    signOut: '/login',
  },
  session: {
    strategy: 'jwt',
  },
  callbacks: {
    async jwt({ token, user, account, profile }) {
      // Keycloak: extraire les rôles (realm roles)
      if (account?.provider === 'keycloak') {
        const roles =
          (profile as any)?.realm_access?.roles ||
          (profile as any)?.resource_access?.[process.env.KEYCLOAK_CLIENT_ID || '']?.roles ||
          []
        token.roles = Array.isArray(roles) ? roles.map(String) : []
        token.isAdmin =
          token.roles.includes('influencecore-admin') ||
          token.roles.includes('admin')
      }

      if (user) {
        token.id = user.id
        token.email = user.email
        token.name = user.name
        token.pseudo = user.pseudo
        token.isAdmin = user.isAdmin
        token.roles = (user as any).roles || token.roles
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        session.user.email = token.email as string
        session.user.name = token.name as string
        session.user.pseudo = token.pseudo as string
        session.user.isAdmin = token.isAdmin as boolean
        session.user.roles = (token.roles as string[]) || []
      }
      return session
    },
  },
  secret: process.env.NEXTAUTH_SECRET,
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

