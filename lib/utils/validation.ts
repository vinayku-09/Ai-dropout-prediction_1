import { z } from 'zod'

export const adminRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  instituteName: z.string().min(2, 'Institute name is required'),
  phone: z.string().optional(),
  address: z.string().optional(),
  website: z.string().url().optional().or(z.literal(''))
})

export const teacherRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  instituteCode: z.string().min(8, 'Institute code must be 8 characters'),
  facultyId: z.string().min(1, 'Faculty ID is required'),
  department: z.string().min(1, 'Department is required'),
  phone: z.string().optional()
})

export const studentRegistrationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  instituteCode: z.string().min(8, 'Institute code must be 8 characters'),
  studentId: z.string().min(1, 'Student ID is required'),
  department: z.string().min(1, 'Department is required'),
  phone: z.string().optional()
})