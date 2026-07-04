/*
  Warnings:

  - A unique constraint covering the columns `[githubId]` on the table `installations` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[githubId]` on the table `pull_requests` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[githubId]` on the table `repositories` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `githubId` to the `installations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `githubId` to the `pull_requests` table without a default value. This is not possible if the table is not empty.
  - Added the required column `githubId` to the `repositories` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
CREATE SEQUENCE installations_id_seq;
ALTER TABLE "installations" ADD COLUMN     "githubId" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('installations_id_seq');
ALTER SEQUENCE installations_id_seq OWNED BY "installations"."id";

-- AlterTable
CREATE SEQUENCE pull_requests_id_seq;
ALTER TABLE "pull_requests" ADD COLUMN     "githubId" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('pull_requests_id_seq');
ALTER SEQUENCE pull_requests_id_seq OWNED BY "pull_requests"."id";

-- AlterTable
CREATE SEQUENCE repositories_id_seq;
ALTER TABLE "repositories" ADD COLUMN     "githubId" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('repositories_id_seq');
ALTER SEQUENCE repositories_id_seq OWNED BY "repositories"."id";

-- CreateIndex
CREATE UNIQUE INDEX "installations_githubId_key" ON "installations"("githubId");

-- CreateIndex
CREATE UNIQUE INDEX "pull_requests_githubId_key" ON "pull_requests"("githubId");

-- CreateIndex
CREATE UNIQUE INDEX "repositories_githubId_key" ON "repositories"("githubId");
