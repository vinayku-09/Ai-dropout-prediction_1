import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from './prisma'

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        instituteCode: { label: 'Institute Code', type: 'text' },
        role: { label: 'Role', type: 'text' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        try {
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: { institute: true }
          })

          if (!user) {
            return null
          }

          const isPasswordValid = await bcrypt.compare(credentials.password, user.password!)
          if (!isPasswordValid) {
            return null
          }

          // Verify institute code for non-admin users
          if (user.role !== 'ADMIN' && credentials.instituteCode) {
            if (user.institute?.code !== credentials.instituteCode) {
              return null
            }
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            instituteId: user.instituteId, 
            instituteName: user.institute?.name,
            instituteCode: user.institute?.code,
            facultyId: user.facultyId,
            studentId: user.studentId
          }
        } catch (error) {
          console.error('Auth error:', error)
          return null
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
  },
  pages: {
    signIn: '/auth/signin',
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role
        token.instituteId = user.instituteId
        token.instituteName = user.instituteName
        token.instituteCode = user.instituteCode
        token.facultyId = user.facultyId
        token.studentId = user.studentId
      }
      
      if (trigger === "update" && session?.name) {
        token.name = session.name
      }
      
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.sub!
        session.user.role = token.role as string
        session.user.instituteId = token.instituteId as string
        session.user.instituteName = token.instituteName as string
        session.user.instituteCode = token.instituteCode as string
        session.user.facultyId = token.facultyId as string
        session.user.studentId = token.studentId as string
      }
      return session
    },
  },
}