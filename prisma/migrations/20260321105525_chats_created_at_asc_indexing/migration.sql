-- DropIndex
DROP INDEX "Chat_conversationId_createdAt_idx";

-- CreateIndex
CREATE INDEX "Chat_conversationId_createdAt_idx" ON "Chat"("conversationId", "createdAt" ASC);
