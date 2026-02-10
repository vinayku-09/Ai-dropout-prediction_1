// // prisma/seed.ts
// import { PrismaClient } from '@prisma/client'
// import bcrypt from 'bcryptjs'

// const prisma = new PrismaClient()

// async function main() {
//   console.log('🌱 Seeding database...')

//   // Create demo institute
//   const demoInstitute = await prisma.institute.create({
//     data: {
//       name: 'Demo Engineering College',
//       code: 'demo1234',
//       adminId: '', // Will be updated after admin creation
//       address: '123 Education Street, Learning City, State 12345',
//       phone: '+91 9876543210',
//       website: 'https://demo-college.edu.in'
//     }
//   })

//   // Create demo admin
//   const adminPassword = await bcrypt.hash('demo123', 12)
//   const admin = await prisma.user.create({
//     data: {
//       name: 'Demo Admin',
//       email: 'admin@demo.edu',
//       password: adminPassword,
//       role: 'ADMIN',
//       instituteId: demoInstitute.id,
//       phone: '+91 9876543210'
//     }
//   })

//   // Update institute with admin ID
//   await prisma.institute.update({
//     where: { id: demoInstitute.id },
//     data: { adminId: admin.id }
//   })

//   // Create institute config
//   await prisma.instituteConfig.create({
//     data: {
//       instituteId: demoInstitute.id,
//       attendanceCutoff: 75,
//       ia1Cutoff: 40,
//       ia2Cutoff: 40,
//       midSemCutoff: 40,
//       finalSemCutoff: 40,
//       emailNotifications: true,
//       whatsappNotifications: false
//     }
//   })

//   // Create demo teacher
//   const teacherPassword = await bcrypt.hash('demo123', 12)
//   const teacher = await prisma.user.create({
//     data: {
//       name: 'Demo Teacher',
//       email: 'teacher@demo.edu',
//       password: teacherPassword,
//       role: 'TEACHER',
//       instituteId: demoInstitute.id,
//       facultyId: 'FAC001',
//       department: 'Computer Science',
//       phone: '+91 9876543211'
//     }
//   })

//   // Create demo students
//   const studentPassword = await bcrypt.hash('demo123', 12)
  
//   // Sample student profiles
//   const studentProfiles = [
//     {
//       student_id: 'SID23001',
//       name: 'Rahul Sharma',
//       course: 'B.Tech Computer Science',
//       department: 'Computer Science',
//       admission_year: 2021,
//       entry_exam_percentile: 85.5,
//       first_generation_learner: false,
//       email: 'student@demo.edu',
//       phone: '+91 9876543212'
//     },
//     {
//       student_id: 'SID23002',
//       name: 'Priya Patel',
//       course: 'B.Tech Information Technology',
//       department: 'Information Technology',
//       admission_year: 2021,
//       entry_exam_percentile: 78.2,
//       first_generation_learner: true,
//       email: 'priya.patel@demo.edu',
//       phone: '+91 9876543213'
//     },
//     {
//       student_id: 'SID23003',
//       name: 'Amit Kumar',
//       course: 'B.Tech Electronics',
//       department: 'Electronics',
//       admission_year: 2021,
//       entry_exam_percentile: 92.1,
//       first_generation_learner: false,
//       email: 'amit.kumar@demo.edu',
//       phone: '+91 9876543214'
//     }
//   ]

//   for (const studentData of studentProfiles) {
//     // Create user account
//     const student = await prisma.user.create({
//       data: {
//         name: studentData.name,
//         email: studentData.email,
//         password: studentPassword,
//         role: 'STUDENT',
//         department: studentData.department,
//         phone: studentData.phone
//       }
//     })

//     // Create student profile
//     const profile = await prisma.studentProfile.create({
//       data: {
//         instituteId: demoInstitute.id,
//         student_id: studentData.student_id,
//         course: studentData.course,
//         department: studentData.department,
//         admission_year: studentData.admission_year,
//         entry_exam_percentile: studentData.entry_exam_percentile,
//         first_generation_learner: studentData.first_generation_learner,
//         current_semester: 6,
//         phone: studentData.phone,
//         userId: student.id
//       }
//     })

//     // Create sample attendance data
//     const dates = [-30, -29, -28, -25, -24, -22, -21, -18, -17, -15, -14, -11, -10, -8, -7, -4, -3, -1]
//     for (const dayOffset of dates) {
//       const date = new Date()
//       date.setDate(date.getDate() + dayOffset)
      
//       await prisma.attendance.create({
//         data: {
//           instituteId: demoInstitute.id,
//           studentId: profile.id,
//           date,
//           is_present: Math.random() > 0.25, // 75% attendance rate
//           subject_code: 'CS101'
//         }
//       })
//     }

//     // Create sample assessment data
//     const assessments = [
//       { type: 'IA1', max_score: 50, score_obtained: Math.floor(Math.random() * 20) + 30 },
//       { type: 'IA2', max_score: 50, score_obtained: Math.floor(Math.random() * 20) + 25 },
//       { type: 'MidSem', max_score: 100, score_obtained: Math.floor(Math.random() * 30) + 40 },
//       { type: 'MidSem', max_score: 100, score_obtained: Math.floor(Math.random() * 30) + 40 },
//       { type: 'FinalSem', max_score: 100, score_obtained: Math.floor(Math.random() * 40) + 35 }
//     ]

//     for (const assessment of assessments) {
//       await prisma.assessment.create({
//         data: {
//           instituteId: demoInstitute.id,
//           studentId: profile.id,
//           subject_code: 'CS101',
//           // Replace 'type' with the actual field name from your Prisma schema, e.g., 'assessment_type'
//           assessment_type: assessment.type,
//           max_score: assessment.max_score,
//           score_obtained: assessment.score_obtained,
//         //   date: new Date()
//         }
//       })
//     }
//   }

//   console.log('✅ Seeding completed!')
// }

// main()
//   .catch((e) => {
//     console.error('❌ Seeding failed:', e)
//     process.exit(1)
//   })
//   .finally(async () => {
//     await prisma.$disconnect()
//   })


import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("🧹 Clearing Excel-related tables...")

  await prisma.$executeRaw`TRUNCATE TABLE "Attendance", "Assessment", "Activity", "Fee", "StudentProfile" RESTART IDENTITY CASCADE`

  console.log("✅ Excel data cleared!")
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
