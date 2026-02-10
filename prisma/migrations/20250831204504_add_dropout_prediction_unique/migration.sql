-- DropIndex
DROP INDEX "public"."DropoutPrediction_studentId_prediction_date_idx";

-- AlterTable
ALTER TABLE "public"."DropoutPrediction" ALTER COLUMN "prediction_date" DROP DEFAULT;
