/*
  Warnings:

  - A unique constraint covering the columns `[whatsappInstance]` on the table `AgentContext` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "AgentContext" ADD COLUMN     "whatsappInstance" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "AgentContext_whatsappInstance_key" ON "AgentContext"("whatsappInstance");
