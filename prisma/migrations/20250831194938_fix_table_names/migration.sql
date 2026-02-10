/*
  Warnings:

  - The values [ALUMNI,PARENT] on the enum `Role` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "public"."Role_new" AS ENUM ('ADMIN', 'TEACHER', 'STUDENT');
ALTER TABLE "public"."User" ALTER COLUMN "role" DROP DEFAULT;
ALTER TABLE "public"."User" ALTER COLUMN "role" TYPE "public"."Role_new" USING ("role"::text::"public"."Role_new");
ALTER TYPE "public"."Role" RENAME TO "Role_old";
ALTER TYPE "public"."Role_new" RENAME TO "Role";
DROP TYPE "public"."Role_old";
ALTER TABLE "public"."User" ALTER COLUMN "role" SET DEFAULT 'STUDENT';
COMMIT;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "department" TEXT,
ADD COLUMN     "emailVerified" TIMESTAMP(3),
ADD COLUMN     "image" TEXT,
ADD COLUMN     "instituteId" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "studentId" TEXT,
ALTER COLUMN "password" DROP NOT NULL;

-- CreateTable
CREATE TABLE "public"."Account" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerAccountId" TEXT NOT NULL,
    "refresh_token" TEXT,
    "access_token" TEXT,
    "expires_at" INTEGER,
    "token_type" TEXT,
    "scope" TEXT,
    "id_token" TEXT,
    "session_state" TEXT,

    CONSTRAINT "Account_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Session" (
    "id" TEXT NOT NULL,
    "sessionToken" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Session_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."VerificationToken" (
    "identifier" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "expires" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "public"."Institute" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "address" TEXT,
    "phone" TEXT,
    "website" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Institute_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InstituteConfig" (
    "id" TEXT NOT NULL,
    "instituteId" TEXT NOT NULL,
    "attendanceCutoff" INTEGER NOT NULL DEFAULT 75,
    "ia1Cutoff" INTEGER NOT NULL DEFAULT 40,
    "ia2Cutoff" INTEGER NOT NULL DEFAULT 40,
    "midSemCutoff" INTEGER NOT NULL DEFAULT 40,
    "finalSemCutoff" INTEGER NOT NULL DEFAULT 40,
    "emailNotifications" BOOLEAN NOT NULL DEFAULT true,
    "whatsappNotifications" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InstituteConfig_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."StudentProfile" (
    "id" TEXT NOT NULL,
    "instituteId" TEXT NOT NULL,
    "student_id" TEXT NOT NULL,
    "course" TEXT,
    "department" TEXT,
    "admission_year" INTEGER,
    "entry_exam_percentile" DOUBLE PRECISION,
    "first_generation_learner" BOOLEAN,
    "current_semester" INTEGER,
    "phone" TEXT,
    "parentPhone" TEXT,
    "address" TEXT,
    "userId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "StudentProfile_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Attendance" (
    "id" TEXT NOT NULL,
    "instituteId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "is_present" BOOLEAN NOT NULL,
    "subject_code" TEXT,
    "subject_name" TEXT,
    "total_classes" INTEGER,
    "attended_classes" INTEGER,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Assessment" (
    "id" TEXT NOT NULL,
    "instituteId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "assessment_name" TEXT NOT NULL,
    "assessment_type" TEXT,
    "subject_code" TEXT,
    "subject_name" TEXT,
    "due_date" TIMESTAMP(3),
    "submission_date" TIMESTAMP(3),
    "max_score" DOUBLE PRECISION NOT NULL,
    "score_obtained" DOUBLE PRECISION NOT NULL,
    "date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Assessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Activity" (
    "id" TEXT NOT NULL,
    "instituteId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "activity_type" TEXT NOT NULL,
    "activity_name" TEXT,
    "duration" INTEGER,
    "points" INTEGER,

    CONSTRAINT "Activity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Fee" (
    "id" TEXT NOT NULL,
    "instituteId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "fee_type" TEXT NOT NULL,
    "due_date" TIMESTAMP(3) NOT NULL,
    "amount_due" DOUBLE PRECISION NOT NULL,
    "amount_paid" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "payment_date" TIMESTAMP(3),
    "payment_method" TEXT,
    "reminders_sent" INTEGER NOT NULL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'PENDING',

    CONSTRAINT "Fee_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."DropoutPrediction" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "prediction_date" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "risk_score" DOUBLE PRECISION NOT NULL,
    "risk_level" TEXT NOT NULL,
    "confidence" DOUBLE PRECISION NOT NULL,
    "contributing_factors" JSONB NOT NULL,
    "recommendations" JSONB,
    "model_version" TEXT,

    CONSTRAINT "DropoutPrediction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."InterventionLog" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "action_type" TEXT NOT NULL,
    "description" TEXT,
    "assigned_to" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InterventionLog_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PredictionAudit" (
    "id" TEXT NOT NULL,
    "model_version" TEXT NOT NULL,
    "trained_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "features_used" JSONB NOT NULL,
    "accuracy" DOUBLE PRECISION,
    "notes" TEXT,

    CONSTRAINT "PredictionAudit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Notification" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "sent_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "status" TEXT NOT NULL,
    "recipient" TEXT NOT NULL,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Account_provider_providerAccountId_key" ON "public"."Account"("provider", "providerAccountId");

-- CreateIndex
CREATE UNIQUE INDEX "Session_sessionToken_key" ON "public"."Session"("sessionToken");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_token_key" ON "public"."VerificationToken"("token");

-- CreateIndex
CREATE UNIQUE INDEX "VerificationToken_identifier_token_key" ON "public"."VerificationToken"("identifier", "token");

-- CreateIndex
CREATE UNIQUE INDEX "Institute_code_key" ON "public"."Institute"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Institute_adminId_key" ON "public"."Institute"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "InstituteConfig_instituteId_key" ON "public"."InstituteConfig"("instituteId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_userId_key" ON "public"."StudentProfile"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "StudentProfile_instituteId_student_id_key" ON "public"."StudentProfile"("instituteId", "student_id");

-- CreateIndex
CREATE UNIQUE INDEX "Attendance_studentId_date_subject_code_key" ON "public"."Attendance"("studentId", "date", "subject_code");

-- CreateIndex
CREATE INDEX "Assessment_studentId_assessment_name_idx" ON "public"."Assessment"("studentId", "assessment_name");

-- CreateIndex
CREATE INDEX "Activity_studentId_activity_type_idx" ON "public"."Activity"("studentId", "activity_type");

-- CreateIndex
CREATE INDEX "Fee_studentId_status_idx" ON "public"."Fee"("studentId", "status");

-- CreateIndex
CREATE INDEX "DropoutPrediction_studentId_prediction_date_idx" ON "public"."DropoutPrediction"("studentId", "prediction_date");

-- CreateIndex
CREATE UNIQUE INDEX "DropoutPrediction_studentId_prediction_date_key" ON "public"."DropoutPrediction"("studentId", "prediction_date");

-- CreateIndex
CREATE INDEX "Notification_studentId_sent_at_idx" ON "public"."Notification"("studentId", "sent_at");

-- AddForeignKey
ALTER TABLE "public"."Account" ADD CONSTRAINT "Account_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "public"."Institute"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InstituteConfig" ADD CONSTRAINT "InstituteConfig_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "public"."Institute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentProfile" ADD CONSTRAINT "StudentProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."StudentProfile" ADD CONSTRAINT "StudentProfile_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "public"."Institute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attendance" ADD CONSTRAINT "Attendance_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."StudentProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Attendance" ADD CONSTRAINT "Attendance_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "public"."Institute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Assessment" ADD CONSTRAINT "Assessment_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."StudentProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Assessment" ADD CONSTRAINT "Assessment_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "public"."Institute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Activity" ADD CONSTRAINT "Activity_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."StudentProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Activity" ADD CONSTRAINT "Activity_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "public"."Institute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Fee" ADD CONSTRAINT "Fee_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."StudentProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Fee" ADD CONSTRAINT "Fee_instituteId_fkey" FOREIGN KEY ("instituteId") REFERENCES "public"."Institute"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."DropoutPrediction" ADD CONSTRAINT "DropoutPrediction_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."StudentProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."InterventionLog" ADD CONSTRAINT "InterventionLog_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "public"."StudentProfile"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
