-- CreateTable
CREATE TABLE "reviews" (
    "id" SERIAL NOT NULL,
    "pullRequestId" INTEGER NOT NULL,
    "summary" TEXT NOT NULL,
    "findings" JSONB NOT NULL,
    "provider" TEXT NOT NULL,
    "commentUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "reviews_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "reviews" ADD CONSTRAINT "reviews_pullRequestId_fkey" FOREIGN KEY ("pullRequestId") REFERENCES "pull_requests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
