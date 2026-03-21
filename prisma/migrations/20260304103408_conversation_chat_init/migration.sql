-- CreateEnum
CREATE TYPE "ChatRole" AS ENUM ('USER', 'AI');

-- DropIndex
DROP INDEX "Workflow_name_idx";

-- DropIndex
DROP INDEX "Workflow_userId_idx";

-- CreateTable
CREATE TABLE "Conversation" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "workflowId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Conversation_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Chat" (
    "id" TEXT NOT NULL,
    "role" "ChatRole" NOT NULL,
    "message" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "conversationId" TEXT NOT NULL,

    CONSTRAINT "Chat_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Conversation_workflowId_createdAt_idx" ON "Conversation"("workflowId", "createdAt" DESC);

-- CreateIndex
CREATE UNIQUE INDEX "Conversation_workflowId_title_key" ON "Conversation"("workflowId", "title");

-- CreateIndex
CREATE INDEX "Chat_conversationId_createdAt_idx" ON "Chat"("conversationId", "createdAt" DESC);

-- CreateIndex
CREATE INDEX "Credential_userId_updatedAt_idx" ON "Credential"("userId", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "Execution_workflowId_startedAt_idx" ON "Execution"("workflowId", "startedAt" DESC);

-- CreateIndex
CREATE INDEX "Node_workflowId_idx" ON "Node"("workflowId");

-- CreateIndex
CREATE INDEX "Workflow_userId_updatedAt_idx" ON "Workflow"("userId", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "Workflow_userId_name_idx" ON "Workflow"("userId", "name");

-- AddForeignKey
ALTER TABLE "Conversation" ADD CONSTRAINT "Conversation_workflowId_fkey" FOREIGN KEY ("workflowId") REFERENCES "Workflow"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Chat" ADD CONSTRAINT "Chat_conversationId_fkey" FOREIGN KEY ("conversationId") REFERENCES "Conversation"("id") ON DELETE CASCADE ON UPDATE CASCADE;
