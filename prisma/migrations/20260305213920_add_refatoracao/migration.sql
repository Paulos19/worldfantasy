/*
  Warnings:

  - You are about to drop the `Document` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Document";

-- CreateTable
CREATE TABLE "AgentContext" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "companyName" TEXT NOT NULL DEFAULT 'World Fantasy',
    "personality" TEXT NOT NULL,
    "knowledgeBase" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AgentContext_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "AgentContext_userId_key" ON "AgentContext"("userId");

-- AddForeignKey
ALTER TABLE "AgentContext" ADD CONSTRAINT "AgentContext_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
