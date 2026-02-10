import NextAuth from "next-auth"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: string
      instituteId?: string | null
      instituteName?: string | null
      instituteCode?: string | null
      facultyId?: string | null
      studentId?: string | null
    }
  }

  interface User {
    role: string
    instituteId?: string | null
    instituteName?: string | null
    instituteCode?: string | null
    facultyId?: string | null
    studentId?: string | null
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    role: string
    instituteId?: string | null
    instituteName?: string | null
    instituteCode?: string | null
    facultyId?: string | null
    studentId?: string | null
  }
}