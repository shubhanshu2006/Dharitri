-- AlterTable
ALTER TABLE "Project" ADD COLUMN     "alignmentEndLat" DECIMAL(10,8),
ADD COLUMN     "alignmentEndLng" DECIMAL(11,8),
ADD COLUMN     "alignmentStartLat" DECIMAL(10,8),
ADD COLUMN     "alignmentStartLng" DECIMAL(11,8),
ADD COLUMN     "corridorWidthMeters" INTEGER;
