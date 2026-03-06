-- AlterTable
ALTER TABLE "User" ADD COLUMN     "phone" TEXT;

-- CreateTable
CREATE TABLE "PromptOptimization" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "originalPrompt" TEXT NOT NULL,
    "clientRequest" TEXT NOT NULL,
    "evaluation" TEXT NOT NULL,
    "optimizedPrompt" TEXT NOT NULL,
    "sentViaWhatsApp" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PromptOptimization_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PromptOptimization_userId_idx" ON "PromptOptimization"("userId");

-- AddForeignKey
ALTER TABLE "PromptOptimization" ADD CONSTRAINT "PromptOptimization_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
