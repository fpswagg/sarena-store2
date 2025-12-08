-- ============================================
-- Sarena Store Database Schema
-- Generated from Prisma schema
-- ============================================

-- Drop existing tables if they exist (in reverse dependency order)
DROP TABLE IF EXISTS "Log" CASCADE;
DROP TABLE IF EXISTS "ProductStat" CASCADE;
DROP TABLE IF EXISTS "Interaction" CASCADE;
DROP TABLE IF EXISTS "Complaint" CASCADE;
DROP TABLE IF EXISTS "Rating" CASCADE;
DROP TABLE IF EXISTS "Product" CASCADE;
DROP TABLE IF EXISTS "User" CASCADE;

-- Drop existing enums if they exist
DROP TYPE IF EXISTS "Role" CASCADE;
DROP TYPE IF EXISTS "ComplaintStatus" CASCADE;
DROP TYPE IF EXISTS "RatingLevel" CASCADE;

-- ============================================
-- Create Enums
-- ============================================

CREATE TYPE "Role" AS ENUM ('ADMIN', 'SUPPLIER', 'USER');
CREATE TYPE "ComplaintStatus" AS ENUM ('RECEIVED', 'IN_PROGRESS', 'RESOLVED');
CREATE TYPE "RatingLevel" AS ENUM ('CAILLOU', 'TORTUE', 'COOL', 'FEU', 'LEGENDAIRE');

-- ============================================
-- Create Tables
-- ============================================

-- User Table
CREATE TABLE "User" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "supabaseId" TEXT UNIQUE,
    "fullName" TEXT,
    "email" TEXT UNIQUE,
    "phone" TEXT,
    "avatar" TEXT,
    "role" "Role" NOT NULL DEFAULT 'USER',
    "emailVerified" TIMESTAMP(3),
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Product Table
CREATE TABLE "Product" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "name" JSONB NOT NULL,
    "shortDesc" JSONB NOT NULL,
    "longDesc" JSONB NOT NULL,
    "price" DOUBLE PRECISION NOT NULL,
    "stock" INTEGER NOT NULL,
    "city" TEXT NOT NULL,
    "thumbnail" TEXT NOT NULL,
    "images" TEXT[] NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "supplierId" TEXT NOT NULL,
    CONSTRAINT "Product_supplierId_fkey" FOREIGN KEY ("supplierId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Rating Table
CREATE TABLE "Rating" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "level" "RatingLevel" NOT NULL,
    "comment" TEXT,
    "userId" TEXT NOT NULL,
    "productId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Rating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "Rating_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Complaint Table
CREATE TABLE "Complaint" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "message" TEXT NOT NULL,
    "status" "ComplaintStatus" NOT NULL DEFAULT 'RECEIVED',
    "productId" TEXT,
    "userId" TEXT,
    "assignedAdminId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Complaint_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Complaint_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "Complaint_assignedAdminId_fkey" FOREIGN KEY ("assignedAdminId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Interaction Table
CREATE TABLE "Interaction" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "productId" TEXT NOT NULL,
    "userIp" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Interaction_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ProductStat Table
CREATE TABLE "ProductStat" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "productId" TEXT NOT NULL UNIQUE,
    "views" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "complaints" INTEGER NOT NULL DEFAULT 0,
    "ratingAvg" DOUBLE PRECISION NOT NULL DEFAULT 0,
    CONSTRAINT "ProductStat_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- Log Table
CREATE TABLE "Log" (
    "id" TEXT NOT NULL PRIMARY KEY DEFAULT gen_random_uuid(),
    "userId" TEXT NOT NULL,
    "userRole" "Role" NOT NULL,
    "action" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "targetId" TEXT,
    "ip" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "Log_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- ============================================
-- Create Indexes
-- ============================================

CREATE INDEX "User_email_idx" ON "User"("email");
CREATE INDEX "User_supabaseId_idx" ON "User"("supabaseId");
CREATE INDEX "Product_supplierId_idx" ON "Product"("supplierId");
CREATE INDEX "Rating_userId_idx" ON "Rating"("userId");
CREATE INDEX "Rating_productId_idx" ON "Rating"("productId");
CREATE INDEX "Complaint_productId_idx" ON "Complaint"("productId");
CREATE INDEX "Complaint_userId_idx" ON "Complaint"("userId");
CREATE INDEX "Complaint_assignedAdminId_idx" ON "Complaint"("assignedAdminId");
CREATE INDEX "Interaction_productId_idx" ON "Interaction"("productId");
CREATE INDEX "Log_userId_idx" ON "Log"("userId");

