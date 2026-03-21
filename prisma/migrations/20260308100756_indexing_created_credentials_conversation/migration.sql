-- DropIndex
DROP INDEX "Conversation_workflowId_createdAt_idx";

-- DropIndex
DROP INDEX "Conversation_workflowId_title_key";

-- CreateIndex
CREATE INDEX "Conversation_workflowId_userId_updatedAt_idx" ON "Conversation"("workflowId", "userId", "updatedAt" DESC);

-- CreateIndex
CREATE INDEX "Credential_userId_type_updatedAt_idx" ON "Credential"("userId", "type", "updatedAt" DESC);
