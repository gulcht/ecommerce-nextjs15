/*
  Warnings:

  - The `sizes` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `colors` column on the `Product` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "sizes",
ADD COLUMN     "sizes" TEXT[],
DROP COLUMN "colors",
ADD COLUMN     "colors" TEXT[];
