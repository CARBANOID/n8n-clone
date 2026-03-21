-- AlterEnum
ALTER TYPE "NodeType" ADD VALUE 'EXCEL';

-- CreateIndex
CREATE INDEX "Workflow_userId_idx" ON "Workflow"("userId");

-- CreateIndex
CREATE INDEX "Workflow_name_idx" ON "Workflow"("name");
