CREATE EXTENSION IF NOT EXISTS postgis;

-- CreateEnum
CREATE TYPE "ProjectStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'ON_HOLD', 'COMPLETED', 'CANCELLED');

-- CreateEnum
CREATE TYPE "ProjectType" AS ENUM ('HIGHWAY', 'RAILWAY', 'INDUSTRIAL_CORRIDOR', 'IRRIGATION', 'URBAN_DEVELOPMENT', 'RENEWABLE_ENERGY', 'STRATEGIC_INFRASTRUCTURE', 'OTHER');

-- CreateEnum
CREATE TYPE "ScopeLevel" AS ENUM ('NATIONAL', 'STATE', 'DISTRICT', 'PROJECT', 'ASSIGNED_CASE');

-- CreateEnum
CREATE TYPE "VerificationStatus" AS ENUM ('PENDING', 'IN_PROGRESS', 'PASS', 'FAIL', 'WARNING', 'APPROVED', 'REQUIRES_CORRECTION');

-- CreateEnum
CREATE TYPE "AcquisitionStatus" AS ENUM ('DRAFT', 'SUBMITTED', 'UNDER_REVIEW', 'VERIFICATION_PENDING', 'VERIFIED', 'ACQUISITION_INITIATED', 'NOTIFICATION_STAGE', 'AWARD_STAGE', 'ACQUISITION_COMPLETED', 'ON_HOLD', 'CANCELLED');

-- CreateEnum
CREATE TYPE "CompensationStatus" AS ENUM ('DRAFT', 'UNDER_REVIEW', 'CORRECTION_REQUIRED', 'SUBMITTED', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('NOT_INITIATED', 'INITIATED', 'PROCESSING', 'CREDITED', 'FAILED', 'RETURNED', 'REJECTED', 'CORRECTION_REQUIRED');

-- CreateEnum
CREATE TYPE "BeneficiaryVerificationStatus" AS ENUM ('NOT_STARTED', 'PENDING', 'VERIFIED', 'FAILED', 'REQUIRES_CORRECTION');

-- CreateEnum
CREATE TYPE "RRStatus" AS ENUM ('NOT_STARTED', 'APPLICABILITY_REVIEW', 'ASSESSMENT', 'APPROVAL_PENDING', 'APPROVED', 'PROVISION_IN_PROGRESS', 'FIELD_VERIFICATION', 'COMPLETED', 'DISPUTED', 'ON_HOLD');

-- CreateEnum
CREATE TYPE "PossessionStatus" AS ENUM ('PENDING', 'NOTICE_ISSUED', 'READY', 'RECORDED', 'DISPUTED', 'REJECTED');

-- CreateEnum
CREATE TYPE "DocumentStatus" AS ENUM ('ACTIVE', 'SUPERSEDED', 'ARCHIVED', 'RESTRICTED');

-- CreateEnum
CREATE TYPE "NotificationStatus" AS ENUM ('PENDING', 'SENT', 'DELIVERED', 'FAILED', 'READ');

-- CreateEnum
CREATE TYPE "RiskLevel" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL', 'INSUFFICIENT_DATA');

-- CreateEnum
CREATE TYPE "FieldVisitStatus" AS ENUM ('DRAFT', 'IN_PROGRESS', 'SUBMITTED', 'VERIFIED', 'REQUIRES_CORRECTION');

-- CreateEnum
CREATE TYPE "ChecklistStatus" AS ENUM ('PENDING', 'PASS', 'FAIL', 'NOT_APPLICABLE');

-- CreateEnum
CREATE TYPE "NotificationChannel" AS ENUM ('IN_APP', 'EMAIL', 'SMS', 'PUSH');

-- CreateEnum
CREATE TYPE "AlertSeverity" AS ENUM ('LOW', 'MEDIUM', 'HIGH', 'CRITICAL');

-- CreateEnum
CREATE TYPE "AlertStatus" AS ENUM ('OPEN', 'ACKNOWLEDGED', 'RESOLVED');

-- CreateEnum
CREATE TYPE "IntegrationSyncStatus" AS ENUM ('QUEUED', 'RUNNING', 'SUCCEEDED', 'FAILED', 'RETRYING');

-- CreateEnum
CREATE TYPE "IntegrationEventStatus" AS ENUM ('RECEIVED', 'PROCESSING', 'PROCESSED', 'FAILED');

-- CreateEnum
CREATE TYPE "GrievanceStatus" AS ENUM ('OPEN', 'ASSIGNED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED', 'CLOSED');

-- CreateEnum
CREATE TYPE "DepartmentType" AS ENUM ('MINISTRY', 'STATE_DEPARTMENT', 'DISTRICT_OFFICE', 'IMPLEMENTING_AGENCY', 'OTHER');

-- CreateEnum
CREATE TYPE "WorkflowEntityType" AS ENUM ('PROJECT', 'ACQUISITION_CASE', 'COMPENSATION', 'PAYMENT', 'BENEFICIARY', 'RR_CASE', 'POSSESSION');

-- CreateEnum
CREATE TYPE "RiskEntityType" AS ENUM ('PROJECT', 'ACQUISITION_PARCEL', 'ACQUISITION_CASE', 'COMPENSATION', 'PAYMENT', 'RR_CASE');

-- CreateEnum
CREATE TYPE "DocumentAccessClass" AS ENUM ('PUBLIC', 'INTERNAL', 'RESTRICTED', 'SENSITIVE');

-- CreateTable
CREATE TABLE "State" (
    "id" UUID NOT NULL,
    "code" VARCHAR(32) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "State_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "District" (
    "id" UUID NOT NULL,
    "stateId" UUID NOT NULL,
    "code" VARCHAR(32) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "District_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tehsil" (
    "id" UUID NOT NULL,
    "districtId" UUID NOT NULL,
    "code" VARCHAR(32) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Tehsil_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Village" (
    "id" UUID NOT NULL,
    "tehsilId" UUID NOT NULL,
    "code" VARCHAR(32) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Village_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "clerkUserId" VARCHAR(255) NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "email" VARCHAR(320) NOT NULL,
    "phone" VARCHAR(32),
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" UUID NOT NULL,
    "code" VARCHAR(64) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Permission" (
    "id" UUID NOT NULL,
    "code" VARCHAR(100) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Permission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RolePermission" (
    "id" UUID NOT NULL,
    "roleId" UUID NOT NULL,
    "permissionId" UUID NOT NULL,

    CONSTRAINT "RolePermission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserScope" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "scopeLevel" "ScopeLevel" NOT NULL,
    "stateId" UUID,
    "districtId" UUID,
    "projectId" UUID,
    "assignedCaseId" UUID,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserScope_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Department" (
    "id" UUID NOT NULL,
    "name" VARCHAR(200) NOT NULL,
    "code" VARCHAR(64) NOT NULL,
    "type" "DepartmentType" NOT NULL,
    "stateId" UUID,
    "districtId" UUID,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Project" (
    "id" UUID NOT NULL,
    "projectCode" VARCHAR(64) NOT NULL,
    "name" VARCHAR(240) NOT NULL,
    "projectType" "ProjectType" NOT NULL,
    "description" TEXT,
    "status" "ProjectStatus" NOT NULL DEFAULT 'DRAFT',
    "implementingAgencyId" UUID,
    "ministryId" UUID,
    "stateId" UUID NOT NULL,
    "districtId" UUID,
    "createdById" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectMember" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "role" VARCHAR(80) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectBoundary" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "sourceType" VARCHAR(64) NOT NULL,
    "sourceSystem" VARCHAR(120),
    "sourceRecordId" VARCHAR(255),
    "geometry" geometry,
    "srid" INTEGER NOT NULL,
    "areaSqMeters" DECIMAL(18,4) NOT NULL,
    "geometryHash" VARCHAR(128),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "ProjectBoundary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectMilestone" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "description" TEXT,
    "dueDate" TIMESTAMPTZ(6),
    "completedAt" TIMESTAMPTZ(6),
    "status" VARCHAR(64) NOT NULL,
    "sequence" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "ProjectMilestone_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LandRequirement" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "requiredAreaSqMeters" DECIMAL(18,4) NOT NULL,
    "landCategory" VARCHAR(120),
    "description" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "LandRequirement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CadastralParcel" (
    "id" UUID NOT NULL,
    "parcelReference" VARCHAR(160) NOT NULL,
    "ulpin" VARCHAR(128),
    "surveyNumber" VARCHAR(128),
    "subDivisionNumber" VARCHAR(128),
    "stateId" UUID NOT NULL,
    "districtId" UUID NOT NULL,
    "tehsilId" UUID,
    "villageId" UUID,
    "areaSqMeters" DECIMAL(18,4) NOT NULL,
    "landCategory" VARCHAR(120),
    "geometrySourceId" UUID,
    "geometry" geometry,
    "sourceSystem" VARCHAR(120),
    "sourceRecordId" VARCHAR(255),
    "sourceRetrievedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "CadastralParcel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ParcelGeometrySource" (
    "id" UUID NOT NULL,
    "cadastralParcelId" UUID NOT NULL,
    "sourceSystem" VARCHAR(120) NOT NULL,
    "sourceRecordId" VARCHAR(255) NOT NULL,
    "geometry" geometry,
    "srid" INTEGER NOT NULL,
    "retrievedAt" TIMESTAMPTZ(6) NOT NULL,
    "isCurrent" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ParcelGeometrySource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LandRecordReference" (
    "id" UUID NOT NULL,
    "cadastralParcelId" UUID NOT NULL,
    "sourceSystem" VARCHAR(120) NOT NULL,
    "sourceRecordId" VARCHAR(255) NOT NULL,
    "parcelReference" VARCHAR(160) NOT NULL,
    "surveyNumber" VARCHAR(128),
    "ulpin" VARCHAR(128),
    "recordStatus" VARCHAR(80),
    "recordVersion" VARCHAR(80),
    "retrievedAt" TIMESTAMPTZ(6) NOT NULL,
    "rawPayloadHash" VARCHAR(128),
    "normalizedPayload" JSONB NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "LandRecordReference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcquisitionParcel" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "cadastralParcelId" UUID NOT NULL,
    "acquisitionReference" VARCHAR(160) NOT NULL,
    "requiredAreaSqMeters" DECIMAL(18,4) NOT NULL,
    "acquisitionGeometry" geometry,
    "geometryAreaSqMeters" DECIMAL(18,4),
    "landCategory" VARCHAR(120),
    "status" "AcquisitionStatus" NOT NULL DEFAULT 'DRAFT',
    "currentAssigneeId" UUID,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "AcquisitionParcel_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AcquisitionCase" (
    "id" UUID NOT NULL,
    "acquisitionParcelId" UUID NOT NULL,
    "status" "AcquisitionStatus" NOT NULL DEFAULT 'DRAFT',
    "currentAssigneeId" UUID,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "AcquisitionCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationCase" (
    "id" UUID NOT NULL,
    "acquisitionCaseId" UUID NOT NULL,
    "status" "VerificationStatus" NOT NULL DEFAULT 'PENDING',
    "startedAt" TIMESTAMPTZ(6),
    "completedAt" TIMESTAMPTZ(6),
    "assignedUserId" UUID,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "VerificationCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VerificationResult" (
    "id" UUID NOT NULL,
    "verificationCaseId" UUID NOT NULL,
    "checkName" VARCHAR(160) NOT NULL,
    "status" "VerificationStatus" NOT NULL,
    "severity" VARCHAR(40),
    "source" VARCHAR(120) NOT NULL,
    "message" TEXT NOT NULL,
    "evidenceDocumentId" UUID,
    "checkedAt" TIMESTAMPTZ(6) NOT NULL,
    "ruleVersion" VARCHAR(80) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VerificationResult_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowDefinition" (
    "id" UUID NOT NULL,
    "entityType" "WorkflowEntityType" NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "version" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkflowDefinition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowState" (
    "id" UUID NOT NULL,
    "workflowDefinitionId" UUID NOT NULL,
    "code" VARCHAR(80) NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "isInitial" BOOLEAN NOT NULL DEFAULT false,
    "isTerminal" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "WorkflowState_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowTransition" (
    "id" UUID NOT NULL,
    "workflowDefinitionId" UUID NOT NULL,
    "fromState" VARCHAR(80) NOT NULL,
    "toState" VARCHAR(80) NOT NULL,
    "requiredPermission" VARCHAR(100) NOT NULL,
    "requiresReason" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkflowTransition_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowInstance" (
    "id" UUID NOT NULL,
    "workflowDefinitionId" UUID NOT NULL,
    "entityType" "WorkflowEntityType" NOT NULL,
    "entityId" UUID NOT NULL,
    "currentState" VARCHAR(80) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "WorkflowInstance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WorkflowTransitionRecord" (
    "id" UUID NOT NULL,
    "workflowInstanceId" UUID NOT NULL,
    "fromState" VARCHAR(80) NOT NULL,
    "toState" VARCHAR(80) NOT NULL,
    "actorId" UUID NOT NULL,
    "reason" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkflowTransitionRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompensationRuleSet" (
    "id" UUID NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "version" INTEGER NOT NULL,
    "effectiveFrom" TIMESTAMPTZ(6) NOT NULL,
    "effectiveTo" TIMESTAMPTZ(6),
    "configuration" JSONB NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CompensationRuleSet_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompensationAssessment" (
    "id" UUID NOT NULL,
    "acquisitionCaseId" UUID NOT NULL,
    "ruleSetId" UUID NOT NULL,
    "landValue" DECIMAL(20,2) NOT NULL,
    "solatium" DECIMAL(20,2) NOT NULL,
    "interest" DECIMAL(20,2) NOT NULL,
    "otherComponents" DECIMAL(20,2) NOT NULL,
    "deductions" DECIMAL(20,2) NOT NULL,
    "totalAmount" DECIMAL(20,2) NOT NULL,
    "status" "CompensationStatus" NOT NULL DEFAULT 'DRAFT',
    "assessedById" UUID NOT NULL,
    "assessedAt" TIMESTAMPTZ(6) NOT NULL,
    "approvedById" UUID,
    "approvedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "CompensationAssessment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompensationAward" (
    "id" UUID NOT NULL,
    "assessmentId" UUID NOT NULL,
    "awardNumber" VARCHAR(100) NOT NULL,
    "awardedAmount" DECIMAL(20,2) NOT NULL,
    "status" "CompensationStatus" NOT NULL,
    "approvedById" UUID NOT NULL,
    "approvedAt" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "CompensationAward_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Beneficiary" (
    "id" UUID NOT NULL,
    "displayName" VARCHAR(200) NOT NULL,
    "externalReference" VARCHAR(255),
    "verificationStatus" "BeneficiaryVerificationStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "createdById" UUID,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Beneficiary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffectedPerson" (
    "id" UUID NOT NULL,
    "beneficiaryId" UUID,
    "displayName" VARCHAR(200) NOT NULL,
    "relationship" VARCHAR(120),
    "isDisplaced" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "AffectedPerson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AffectedFamily" (
    "id" UUID NOT NULL,
    "primaryBeneficiaryId" UUID,
    "familyReference" VARCHAR(120) NOT NULL,
    "isAffected" BOOLEAN NOT NULL DEFAULT false,
    "isDisplaced" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "AffectedFamily_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FamilyMember" (
    "id" UUID NOT NULL,
    "familyId" UUID NOT NULL,
    "affectedPersonId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FamilyMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "BeneficiaryVerification" (
    "id" UUID NOT NULL,
    "beneficiaryId" UUID NOT NULL,
    "status" "BeneficiaryVerificationStatus" NOT NULL DEFAULT 'PENDING',
    "provider" VARCHAR(120) NOT NULL,
    "providerReference" VARCHAR(255),
    "verifiedAt" TIMESTAMPTZ(6),
    "failureReason" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "BeneficiaryVerification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PaymentTransaction" (
    "id" UUID NOT NULL,
    "awardId" UUID NOT NULL,
    "beneficiaryId" UUID NOT NULL,
    "acquisitionCaseId" UUID,
    "amount" DECIMAL(20,2) NOT NULL,
    "currency" CHAR(3) NOT NULL DEFAULT 'INR',
    "status" "PaymentStatus" NOT NULL DEFAULT 'NOT_INITIATED',
    "externalReference" VARCHAR(255),
    "provider" VARCHAR(120) NOT NULL,
    "idempotencyKey" VARCHAR(255) NOT NULL,
    "failureReason" TEXT,
    "initiatedAt" TIMESTAMPTZ(6),
    "creditedAt" TIMESTAMPTZ(6),
    "lastProviderSyncAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "PaymentTransaction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RRCase" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "acquisitionCaseId" UUID,
    "familyId" UUID NOT NULL,
    "status" "RRStatus" NOT NULL DEFAULT 'NOT_STARTED',
    "applicable" BOOLEAN NOT NULL DEFAULT false,
    "assessmentCompletedAt" TIMESTAMPTZ(6),
    "approvedAt" TIMESTAMPTZ(6),
    "completedAt" TIMESTAMPTZ(6),
    "approvedById" UUID,
    "completedById" UUID,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "RRCase_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RREntitlement" (
    "id" UUID NOT NULL,
    "rrCaseId" UUID NOT NULL,
    "entitlementType" VARCHAR(120) NOT NULL,
    "assessedValue" JSONB NOT NULL,
    "approvedValue" JSONB,
    "providedValue" JSONB,
    "status" VARCHAR(64) NOT NULL,
    "verifiedAt" TIMESTAMPTZ(6),
    "completedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "RREntitlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PossessionRecord" (
    "id" UUID NOT NULL,
    "acquisitionCaseId" UUID NOT NULL,
    "status" "PossessionStatus" NOT NULL DEFAULT 'PENDING',
    "possessionDate" TIMESTAMPTZ(6),
    "recordedById" UUID,
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "remarks" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "PossessionRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PossessionChecklistItem" (
    "id" UUID NOT NULL,
    "possessionRecordId" UUID NOT NULL,
    "checkName" VARCHAR(160) NOT NULL,
    "status" "ChecklistStatus" NOT NULL DEFAULT 'PENDING',
    "remarks" TEXT,
    "completedAt" TIMESTAMPTZ(6),
    "completedById" UUID,

    CONSTRAINT "PossessionChecklistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Document" (
    "id" UUID NOT NULL,
    "entityType" VARCHAR(80) NOT NULL,
    "entityId" UUID NOT NULL,
    "documentType" VARCHAR(120) NOT NULL,
    "title" VARCHAR(240) NOT NULL,
    "status" "DocumentStatus" NOT NULL DEFAULT 'ACTIVE',
    "currentVersionId" UUID,
    "accessClass" "DocumentAccessClass" NOT NULL DEFAULT 'INTERNAL',
    "uploadedById" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Document_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DocumentVersion" (
    "id" UUID NOT NULL,
    "documentId" UUID NOT NULL,
    "versionNumber" INTEGER NOT NULL,
    "objectKey" VARCHAR(1024) NOT NULL,
    "originalFileName" VARCHAR(255) NOT NULL,
    "mimeType" VARCHAR(160) NOT NULL,
    "sizeBytes" BIGINT NOT NULL,
    "checksum" VARCHAR(128) NOT NULL,
    "uploadedById" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DocumentVersion_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldVisit" (
    "id" UUID NOT NULL,
    "projectId" UUID NOT NULL,
    "acquisitionCaseId" UUID,
    "officerId" UUID NOT NULL,
    "status" "FieldVisitStatus" NOT NULL DEFAULT 'DRAFT',
    "startedAt" TIMESTAMPTZ(6) NOT NULL,
    "completedAt" TIMESTAMPTZ(6),
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "gpsAccuracyMeters" DECIMAL(10,3),
    "remarks" TEXT,
    "clientOperationId" VARCHAR(255),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "FieldVisit_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldEvidence" (
    "id" UUID NOT NULL,
    "fieldVisitId" UUID NOT NULL,
    "documentId" UUID NOT NULL,
    "evidenceType" VARCHAR(120) NOT NULL,
    "capturedAt" TIMESTAMPTZ(6),
    "latitude" DECIMAL(10,7),
    "longitude" DECIMAL(10,7),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FieldEvidence_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FieldChecklistItem" (
    "id" UUID NOT NULL,
    "fieldVisitId" UUID NOT NULL,
    "checkName" VARCHAR(160) NOT NULL,
    "status" "ChecklistStatus" NOT NULL DEFAULT 'PENDING',
    "remarks" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "FieldChecklistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notification" (
    "id" UUID NOT NULL,
    "userId" UUID NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "title" VARCHAR(240) NOT NULL,
    "message" TEXT NOT NULL,
    "entityType" VARCHAR(80),
    "entityId" UUID,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "readAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Notification_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "NotificationDelivery" (
    "id" UUID NOT NULL,
    "notificationId" UUID NOT NULL,
    "channel" "NotificationChannel" NOT NULL,
    "status" "NotificationStatus" NOT NULL DEFAULT 'PENDING',
    "providerReference" VARCHAR(255),
    "sentAt" TIMESTAMPTZ(6),
    "deliveredAt" TIMESTAMPTZ(6),
    "failureReason" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "NotificationDelivery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Alert" (
    "id" UUID NOT NULL,
    "projectId" UUID,
    "acquisitionCaseId" UUID,
    "type" VARCHAR(100) NOT NULL,
    "severity" "AlertSeverity" NOT NULL,
    "message" TEXT NOT NULL,
    "status" "AlertStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMPTZ(6),
    "resolvedById" UUID,

    CONSTRAINT "Alert_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RiskScore" (
    "id" UUID NOT NULL,
    "entityType" "RiskEntityType" NOT NULL,
    "entityId" UUID NOT NULL,
    "score" DECIMAL(10,4) NOT NULL,
    "riskLevel" "RiskLevel" NOT NULL,
    "algorithmVersion" VARCHAR(80) NOT NULL,
    "inputSnapshot" JSONB NOT NULL,
    "factors" JSONB NOT NULL,
    "generatedAt" TIMESTAMPTZ(6) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RiskScore_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AnomalyEvent" (
    "id" UUID NOT NULL,
    "entityType" "RiskEntityType" NOT NULL,
    "entityId" UUID NOT NULL,
    "type" VARCHAR(100) NOT NULL,
    "severity" "AlertSeverity" NOT NULL,
    "description" TEXT NOT NULL,
    "detectedBy" VARCHAR(100) NOT NULL,
    "algorithmVersion" VARCHAR(80),
    "evidence" JSONB NOT NULL,
    "status" "AlertStatus" NOT NULL DEFAULT 'OPEN',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "resolvedAt" TIMESTAMPTZ(6),
    "resolvedById" UUID,

    CONSTRAINT "AnomalyEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntegrationSource" (
    "id" UUID NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "type" VARCHAR(80) NOT NULL,
    "provider" VARCHAR(120) NOT NULL,
    "isMock" BOOLEAN NOT NULL DEFAULT true,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "configuration" JSONB,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "IntegrationSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntegrationSync" (
    "id" UUID NOT NULL,
    "integrationSourceId" UUID NOT NULL,
    "entityType" VARCHAR(80) NOT NULL,
    "entityId" UUID,
    "operation" VARCHAR(80) NOT NULL,
    "status" "IntegrationSyncStatus" NOT NULL DEFAULT 'QUEUED',
    "externalReference" VARCHAR(255),
    "startedAt" TIMESTAMPTZ(6) NOT NULL,
    "completedAt" TIMESTAMPTZ(6),
    "errorCode" VARCHAR(100),
    "errorMessage" TEXT,
    "metadata" JSONB,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntegrationSync_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "IntegrationEvent" (
    "id" UUID NOT NULL,
    "integrationSourceId" UUID NOT NULL,
    "eventType" VARCHAR(100) NOT NULL,
    "externalEventId" VARCHAR(255) NOT NULL,
    "payloadHash" VARCHAR(128) NOT NULL,
    "payloadMetadata" JSONB,
    "processedAt" TIMESTAMPTZ(6),
    "processingStatus" "IntegrationEventStatus" NOT NULL DEFAULT 'RECEIVED',
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "IntegrationEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuditEvent" (
    "id" UUID NOT NULL,
    "actorId" UUID,
    "action" VARCHAR(120) NOT NULL,
    "entityType" VARCHAR(80) NOT NULL,
    "entityId" UUID NOT NULL,
    "timestamp" TIMESTAMPTZ(6) NOT NULL,
    "oldValue" JSONB,
    "newValue" JSONB,
    "reason" TEXT,
    "requestId" VARCHAR(128) NOT NULL,
    "source" VARCHAR(80) NOT NULL,
    "ipAddress" VARCHAR(64),
    "userAgent" VARCHAR(512),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Grievance" (
    "id" UUID NOT NULL,
    "projectId" UUID,
    "acquisitionCaseId" UUID,
    "beneficiaryId" UUID,
    "submittedById" UUID NOT NULL,
    "category" VARCHAR(120) NOT NULL,
    "description" TEXT NOT NULL,
    "status" "GrievanceStatus" NOT NULL DEFAULT 'OPEN',
    "priority" VARCHAR(40) NOT NULL,
    "assignedToId" UUID,
    "resolution" TEXT,
    "resolvedAt" TIMESTAMPTZ(6),
    "resolvedById" UUID,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "Grievance_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "State_code_key" ON "State"("code");

-- CreateIndex
CREATE INDEX "State_name_idx" ON "State"("name");

-- CreateIndex
CREATE INDEX "District_stateId_idx" ON "District"("stateId");

-- CreateIndex
CREATE INDEX "District_name_idx" ON "District"("name");

-- CreateIndex
CREATE UNIQUE INDEX "District_stateId_code_key" ON "District"("stateId", "code");

-- CreateIndex
CREATE INDEX "Tehsil_districtId_idx" ON "Tehsil"("districtId");

-- CreateIndex
CREATE INDEX "Tehsil_name_idx" ON "Tehsil"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tehsil_districtId_code_key" ON "Tehsil"("districtId", "code");

-- CreateIndex
CREATE INDEX "Village_tehsilId_idx" ON "Village"("tehsilId");

-- CreateIndex
CREATE INDEX "Village_name_idx" ON "Village"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Village_tehsilId_code_key" ON "Village"("tehsilId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "User_clerkUserId_key" ON "User"("clerkUserId");

-- CreateIndex
CREATE UNIQUE INDEX "Role_code_key" ON "Role"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Permission_code_key" ON "Permission"("code");

-- CreateIndex
CREATE INDEX "UserRole_roleId_idx" ON "UserRole"("roleId");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_roleId_key" ON "UserRole"("userId", "roleId");

-- CreateIndex
CREATE INDEX "RolePermission_permissionId_idx" ON "RolePermission"("permissionId");

-- CreateIndex
CREATE UNIQUE INDEX "RolePermission_roleId_permissionId_key" ON "RolePermission"("roleId", "permissionId");

-- CreateIndex
CREATE INDEX "UserScope_userId_idx" ON "UserScope"("userId");

-- CreateIndex
CREATE INDEX "UserScope_scopeLevel_idx" ON "UserScope"("scopeLevel");

-- CreateIndex
CREATE INDEX "UserScope_stateId_idx" ON "UserScope"("stateId");

-- CreateIndex
CREATE INDEX "UserScope_districtId_idx" ON "UserScope"("districtId");

-- CreateIndex
CREATE INDEX "UserScope_projectId_idx" ON "UserScope"("projectId");

-- CreateIndex
CREATE INDEX "UserScope_assignedCaseId_idx" ON "UserScope"("assignedCaseId");

-- CreateIndex
CREATE UNIQUE INDEX "Department_code_key" ON "Department"("code");

-- CreateIndex
CREATE UNIQUE INDEX "Project_projectCode_key" ON "Project"("projectCode");

-- CreateIndex
CREATE INDEX "Project_status_idx" ON "Project"("status");

-- CreateIndex
CREATE INDEX "Project_stateId_idx" ON "Project"("stateId");

-- CreateIndex
CREATE INDEX "Project_districtId_idx" ON "Project"("districtId");

-- CreateIndex
CREATE INDEX "Project_projectType_idx" ON "Project"("projectType");

-- CreateIndex
CREATE INDEX "Project_createdAt_idx" ON "Project"("createdAt");

-- CreateIndex
CREATE INDEX "ProjectMember_userId_idx" ON "ProjectMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectMember_projectId_userId_key" ON "ProjectMember"("projectId", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "ProjectBoundary_projectId_key" ON "ProjectBoundary"("projectId");

-- CreateIndex
CREATE INDEX "ProjectBoundary_sourceSystem_sourceRecordId_idx" ON "ProjectBoundary"("sourceSystem", "sourceRecordId");

-- CreateIndex
CREATE INDEX "ProjectMilestone_projectId_status_idx" ON "ProjectMilestone"("projectId", "status");

-- CreateIndex
CREATE INDEX "ProjectMilestone_projectId_dueDate_idx" ON "ProjectMilestone"("projectId", "dueDate");

-- CreateIndex
CREATE INDEX "LandRequirement_projectId_idx" ON "LandRequirement"("projectId");

-- CreateIndex
CREATE UNIQUE INDEX "CadastralParcel_parcelReference_key" ON "CadastralParcel"("parcelReference");

-- CreateIndex
CREATE INDEX "CadastralParcel_ulpin_idx" ON "CadastralParcel"("ulpin");

-- CreateIndex
CREATE INDEX "CadastralParcel_surveyNumber_idx" ON "CadastralParcel"("surveyNumber");

-- CreateIndex
CREATE INDEX "CadastralParcel_villageId_idx" ON "CadastralParcel"("villageId");

-- CreateIndex
CREATE INDEX "CadastralParcel_districtId_idx" ON "CadastralParcel"("districtId");

-- CreateIndex
CREATE INDEX "CadastralParcel_sourceSystem_sourceRecordId_idx" ON "CadastralParcel"("sourceSystem", "sourceRecordId");

-- CreateIndex
CREATE INDEX "ParcelGeometrySource_cadastralParcelId_isCurrent_idx" ON "ParcelGeometrySource"("cadastralParcelId", "isCurrent");

-- CreateIndex
CREATE INDEX "ParcelGeometrySource_sourceSystem_sourceRecordId_idx" ON "ParcelGeometrySource"("sourceSystem", "sourceRecordId");

-- CreateIndex
CREATE INDEX "LandRecordReference_cadastralParcelId_idx" ON "LandRecordReference"("cadastralParcelId");

-- CreateIndex
CREATE INDEX "LandRecordReference_ulpin_idx" ON "LandRecordReference"("ulpin");

-- CreateIndex
CREATE UNIQUE INDEX "LandRecordReference_sourceSystem_sourceRecordId_key" ON "LandRecordReference"("sourceSystem", "sourceRecordId");

-- CreateIndex
CREATE UNIQUE INDEX "AcquisitionParcel_acquisitionReference_key" ON "AcquisitionParcel"("acquisitionReference");

-- CreateIndex
CREATE INDEX "AcquisitionParcel_projectId_idx" ON "AcquisitionParcel"("projectId");

-- CreateIndex
CREATE INDEX "AcquisitionParcel_cadastralParcelId_idx" ON "AcquisitionParcel"("cadastralParcelId");

-- CreateIndex
CREATE INDEX "AcquisitionParcel_status_idx" ON "AcquisitionParcel"("status");

-- CreateIndex
CREATE INDEX "AcquisitionParcel_createdAt_idx" ON "AcquisitionParcel"("createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "AcquisitionParcel_projectId_cadastralParcelId_acquisitionRe_key" ON "AcquisitionParcel"("projectId", "cadastralParcelId", "acquisitionReference");

-- CreateIndex
CREATE UNIQUE INDEX "AcquisitionCase_acquisitionParcelId_key" ON "AcquisitionCase"("acquisitionParcelId");

-- CreateIndex
CREATE INDEX "AcquisitionCase_status_idx" ON "AcquisitionCase"("status");

-- CreateIndex
CREATE INDEX "AcquisitionCase_currentAssigneeId_idx" ON "AcquisitionCase"("currentAssigneeId");

-- CreateIndex
CREATE INDEX "VerificationCase_acquisitionCaseId_idx" ON "VerificationCase"("acquisitionCaseId");

-- CreateIndex
CREATE INDEX "VerificationCase_status_idx" ON "VerificationCase"("status");

-- CreateIndex
CREATE INDEX "VerificationCase_assignedUserId_idx" ON "VerificationCase"("assignedUserId");

-- CreateIndex
CREATE INDEX "VerificationResult_verificationCaseId_idx" ON "VerificationResult"("verificationCaseId");

-- CreateIndex
CREATE INDEX "VerificationResult_status_idx" ON "VerificationResult"("status");

-- CreateIndex
CREATE INDEX "VerificationResult_severity_idx" ON "VerificationResult"("severity");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowDefinition_entityType_version_key" ON "WorkflowDefinition"("entityType", "version");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowState_workflowDefinitionId_code_key" ON "WorkflowState"("workflowDefinitionId", "code");

-- CreateIndex
CREATE UNIQUE INDEX "WorkflowTransition_workflowDefinitionId_fromState_toState_key" ON "WorkflowTransition"("workflowDefinitionId", "fromState", "toState");

-- CreateIndex
CREATE INDEX "WorkflowInstance_entityType_entityId_idx" ON "WorkflowInstance"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "WorkflowTransitionRecord_workflowInstanceId_createdAt_idx" ON "WorkflowTransitionRecord"("workflowInstanceId", "createdAt");

-- CreateIndex
CREATE INDEX "WorkflowTransitionRecord_actorId_idx" ON "WorkflowTransitionRecord"("actorId");

-- CreateIndex
CREATE UNIQUE INDEX "CompensationRuleSet_name_version_key" ON "CompensationRuleSet"("name", "version");

-- CreateIndex
CREATE INDEX "CompensationAssessment_acquisitionCaseId_status_idx" ON "CompensationAssessment"("acquisitionCaseId", "status");

-- CreateIndex
CREATE INDEX "CompensationAssessment_ruleSetId_idx" ON "CompensationAssessment"("ruleSetId");

-- CreateIndex
CREATE UNIQUE INDEX "CompensationAward_assessmentId_key" ON "CompensationAward"("assessmentId");

-- CreateIndex
CREATE UNIQUE INDEX "CompensationAward_awardNumber_key" ON "CompensationAward"("awardNumber");

-- CreateIndex
CREATE INDEX "CompensationAward_approvedById_idx" ON "CompensationAward"("approvedById");

-- CreateIndex
CREATE INDEX "Beneficiary_verificationStatus_idx" ON "Beneficiary"("verificationStatus");

-- CreateIndex
CREATE INDEX "Beneficiary_externalReference_idx" ON "Beneficiary"("externalReference");

-- CreateIndex
CREATE INDEX "AffectedPerson_beneficiaryId_idx" ON "AffectedPerson"("beneficiaryId");

-- CreateIndex
CREATE UNIQUE INDEX "AffectedFamily_familyReference_key" ON "AffectedFamily"("familyReference");

-- CreateIndex
CREATE INDEX "AffectedFamily_primaryBeneficiaryId_idx" ON "AffectedFamily"("primaryBeneficiaryId");

-- CreateIndex
CREATE UNIQUE INDEX "FamilyMember_familyId_affectedPersonId_key" ON "FamilyMember"("familyId", "affectedPersonId");

-- CreateIndex
CREATE INDEX "BeneficiaryVerification_beneficiaryId_idx" ON "BeneficiaryVerification"("beneficiaryId");

-- CreateIndex
CREATE INDEX "BeneficiaryVerification_status_idx" ON "BeneficiaryVerification"("status");

-- CreateIndex
CREATE UNIQUE INDEX "PaymentTransaction_idempotencyKey_key" ON "PaymentTransaction"("idempotencyKey");

-- CreateIndex
CREATE INDEX "PaymentTransaction_awardId_idx" ON "PaymentTransaction"("awardId");

-- CreateIndex
CREATE INDEX "PaymentTransaction_beneficiaryId_idx" ON "PaymentTransaction"("beneficiaryId");

-- CreateIndex
CREATE INDEX "PaymentTransaction_acquisitionCaseId_idx" ON "PaymentTransaction"("acquisitionCaseId");

-- CreateIndex
CREATE INDEX "PaymentTransaction_status_idx" ON "PaymentTransaction"("status");

-- CreateIndex
CREATE INDEX "PaymentTransaction_externalReference_idx" ON "PaymentTransaction"("externalReference");

-- CreateIndex
CREATE INDEX "RRCase_projectId_status_idx" ON "RRCase"("projectId", "status");

-- CreateIndex
CREATE INDEX "RRCase_familyId_idx" ON "RRCase"("familyId");

-- CreateIndex
CREATE INDEX "RRCase_acquisitionCaseId_idx" ON "RRCase"("acquisitionCaseId");

-- CreateIndex
CREATE INDEX "RREntitlement_rrCaseId_status_idx" ON "RREntitlement"("rrCaseId", "status");

-- CreateIndex
CREATE INDEX "PossessionRecord_acquisitionCaseId_status_idx" ON "PossessionRecord"("acquisitionCaseId", "status");

-- CreateIndex
CREATE INDEX "PossessionChecklistItem_possessionRecordId_status_idx" ON "PossessionChecklistItem"("possessionRecordId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "Document_currentVersionId_key" ON "Document"("currentVersionId");

-- CreateIndex
CREATE INDEX "Document_entityType_entityId_idx" ON "Document"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "Document_documentType_idx" ON "Document"("documentType");

-- CreateIndex
CREATE INDEX "Document_status_idx" ON "Document"("status");

-- CreateIndex
CREATE INDEX "DocumentVersion_checksum_idx" ON "DocumentVersion"("checksum");

-- CreateIndex
CREATE UNIQUE INDEX "DocumentVersion_documentId_versionNumber_key" ON "DocumentVersion"("documentId", "versionNumber");

-- CreateIndex
CREATE UNIQUE INDEX "FieldVisit_clientOperationId_key" ON "FieldVisit"("clientOperationId");

-- CreateIndex
CREATE INDEX "FieldVisit_projectId_idx" ON "FieldVisit"("projectId");

-- CreateIndex
CREATE INDEX "FieldVisit_acquisitionCaseId_idx" ON "FieldVisit"("acquisitionCaseId");

-- CreateIndex
CREATE INDEX "FieldVisit_officerId_idx" ON "FieldVisit"("officerId");

-- CreateIndex
CREATE INDEX "FieldVisit_status_idx" ON "FieldVisit"("status");

-- CreateIndex
CREATE INDEX "FieldEvidence_fieldVisitId_idx" ON "FieldEvidence"("fieldVisitId");

-- CreateIndex
CREATE INDEX "FieldChecklistItem_fieldVisitId_status_idx" ON "FieldChecklistItem"("fieldVisitId", "status");

-- CreateIndex
CREATE INDEX "Notification_userId_status_idx" ON "Notification"("userId", "status");

-- CreateIndex
CREATE INDEX "Notification_entityType_entityId_idx" ON "Notification"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "NotificationDelivery_notificationId_idx" ON "NotificationDelivery"("notificationId");

-- CreateIndex
CREATE INDEX "NotificationDelivery_status_idx" ON "NotificationDelivery"("status");

-- CreateIndex
CREATE INDEX "Alert_projectId_status_idx" ON "Alert"("projectId", "status");

-- CreateIndex
CREATE INDEX "Alert_acquisitionCaseId_status_idx" ON "Alert"("acquisitionCaseId", "status");

-- CreateIndex
CREATE INDEX "Alert_severity_status_idx" ON "Alert"("severity", "status");

-- CreateIndex
CREATE INDEX "RiskScore_entityType_entityId_generatedAt_idx" ON "RiskScore"("entityType", "entityId", "generatedAt");

-- CreateIndex
CREATE INDEX "RiskScore_riskLevel_idx" ON "RiskScore"("riskLevel");

-- CreateIndex
CREATE INDEX "AnomalyEvent_entityType_entityId_idx" ON "AnomalyEvent"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AnomalyEvent_severity_status_idx" ON "AnomalyEvent"("severity", "status");

-- CreateIndex
CREATE INDEX "IntegrationSync_integrationSourceId_idx" ON "IntegrationSync"("integrationSourceId");

-- CreateIndex
CREATE INDEX "IntegrationSync_entityType_entityId_idx" ON "IntegrationSync"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "IntegrationSync_status_idx" ON "IntegrationSync"("status");

-- CreateIndex
CREATE INDEX "IntegrationEvent_processingStatus_idx" ON "IntegrationEvent"("processingStatus");

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationEvent_integrationSourceId_externalEventId_key" ON "IntegrationEvent"("integrationSourceId", "externalEventId");

-- CreateIndex
CREATE INDEX "AuditEvent_entityType_entityId_timestamp_idx" ON "AuditEvent"("entityType", "entityId", "timestamp");

-- CreateIndex
CREATE INDEX "AuditEvent_actorId_idx" ON "AuditEvent"("actorId");

-- CreateIndex
CREATE INDEX "AuditEvent_requestId_idx" ON "AuditEvent"("requestId");

-- CreateIndex
CREATE INDEX "Grievance_projectId_status_idx" ON "Grievance"("projectId", "status");

-- CreateIndex
CREATE INDEX "Grievance_acquisitionCaseId_status_idx" ON "Grievance"("acquisitionCaseId", "status");

-- CreateIndex
CREATE INDEX "Grievance_beneficiaryId_idx" ON "Grievance"("beneficiaryId");

-- CreateIndex
CREATE INDEX "Grievance_assignedToId_status_idx" ON "Grievance"("assignedToId", "status");

-- AddForeignKey
ALTER TABLE "District" ADD CONSTRAINT "District_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tehsil" ADD CONSTRAINT "Tehsil_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Village" ADD CONSTRAINT "Village_tehsilId_fkey" FOREIGN KEY ("tehsilId") REFERENCES "Tehsil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RolePermission" ADD CONSTRAINT "RolePermission_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "Permission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserScope" ADD CONSTRAINT "UserScope_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserScope" ADD CONSTRAINT "UserScope_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserScope" ADD CONSTRAINT "UserScope_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserScope" ADD CONSTRAINT "UserScope_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Department" ADD CONSTRAINT "Department_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_implementingAgencyId_fkey" FOREIGN KEY ("implementingAgencyId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_ministryId_fkey" FOREIGN KEY ("ministryId") REFERENCES "Department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMember" ADD CONSTRAINT "ProjectMember_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMember" ADD CONSTRAINT "ProjectMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectBoundary" ADD CONSTRAINT "ProjectBoundary_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectMilestone" ADD CONSTRAINT "ProjectMilestone_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandRequirement" ADD CONSTRAINT "LandRequirement_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CadastralParcel" ADD CONSTRAINT "CadastralParcel_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "State"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CadastralParcel" ADD CONSTRAINT "CadastralParcel_districtId_fkey" FOREIGN KEY ("districtId") REFERENCES "District"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CadastralParcel" ADD CONSTRAINT "CadastralParcel_tehsilId_fkey" FOREIGN KEY ("tehsilId") REFERENCES "Tehsil"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CadastralParcel" ADD CONSTRAINT "CadastralParcel_villageId_fkey" FOREIGN KEY ("villageId") REFERENCES "Village"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CadastralParcel" ADD CONSTRAINT "CadastralParcel_geometrySourceId_fkey" FOREIGN KEY ("geometrySourceId") REFERENCES "ParcelGeometrySource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ParcelGeometrySource" ADD CONSTRAINT "ParcelGeometrySource_cadastralParcelId_fkey" FOREIGN KEY ("cadastralParcelId") REFERENCES "CadastralParcel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandRecordReference" ADD CONSTRAINT "LandRecordReference_cadastralParcelId_fkey" FOREIGN KEY ("cadastralParcelId") REFERENCES "CadastralParcel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcquisitionParcel" ADD CONSTRAINT "AcquisitionParcel_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcquisitionParcel" ADD CONSTRAINT "AcquisitionParcel_cadastralParcelId_fkey" FOREIGN KEY ("cadastralParcelId") REFERENCES "CadastralParcel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcquisitionParcel" ADD CONSTRAINT "AcquisitionParcel_currentAssigneeId_fkey" FOREIGN KEY ("currentAssigneeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcquisitionCase" ADD CONSTRAINT "AcquisitionCase_acquisitionParcelId_fkey" FOREIGN KEY ("acquisitionParcelId") REFERENCES "AcquisitionParcel"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AcquisitionCase" ADD CONSTRAINT "AcquisitionCase_currentAssigneeId_fkey" FOREIGN KEY ("currentAssigneeId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationCase" ADD CONSTRAINT "VerificationCase_acquisitionCaseId_fkey" FOREIGN KEY ("acquisitionCaseId") REFERENCES "AcquisitionCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationCase" ADD CONSTRAINT "VerificationCase_assignedUserId_fkey" FOREIGN KEY ("assignedUserId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationResult" ADD CONSTRAINT "VerificationResult_verificationCaseId_fkey" FOREIGN KEY ("verificationCaseId") REFERENCES "VerificationCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VerificationResult" ADD CONSTRAINT "VerificationResult_evidenceDocumentId_fkey" FOREIGN KEY ("evidenceDocumentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowState" ADD CONSTRAINT "WorkflowState_workflowDefinitionId_fkey" FOREIGN KEY ("workflowDefinitionId") REFERENCES "WorkflowDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowTransition" ADD CONSTRAINT "WorkflowTransition_workflowDefinitionId_fkey" FOREIGN KEY ("workflowDefinitionId") REFERENCES "WorkflowDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowInstance" ADD CONSTRAINT "WorkflowInstance_workflowDefinitionId_fkey" FOREIGN KEY ("workflowDefinitionId") REFERENCES "WorkflowDefinition"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowTransitionRecord" ADD CONSTRAINT "WorkflowTransitionRecord_workflowInstanceId_fkey" FOREIGN KEY ("workflowInstanceId") REFERENCES "WorkflowInstance"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkflowTransitionRecord" ADD CONSTRAINT "WorkflowTransitionRecord_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompensationAssessment" ADD CONSTRAINT "CompensationAssessment_acquisitionCaseId_fkey" FOREIGN KEY ("acquisitionCaseId") REFERENCES "AcquisitionCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompensationAssessment" ADD CONSTRAINT "CompensationAssessment_ruleSetId_fkey" FOREIGN KEY ("ruleSetId") REFERENCES "CompensationRuleSet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompensationAssessment" ADD CONSTRAINT "CompensationAssessment_assessedById_fkey" FOREIGN KEY ("assessedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompensationAssessment" ADD CONSTRAINT "CompensationAssessment_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompensationAward" ADD CONSTRAINT "CompensationAward_assessmentId_fkey" FOREIGN KEY ("assessmentId") REFERENCES "CompensationAssessment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CompensationAward" ADD CONSTRAINT "CompensationAward_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Beneficiary" ADD CONSTRAINT "Beneficiary_createdById_fkey" FOREIGN KEY ("createdById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffectedPerson" ADD CONSTRAINT "AffectedPerson_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "Beneficiary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AffectedFamily" ADD CONSTRAINT "AffectedFamily_primaryBeneficiaryId_fkey" FOREIGN KEY ("primaryBeneficiaryId") REFERENCES "Beneficiary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "AffectedFamily"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FamilyMember" ADD CONSTRAINT "FamilyMember_affectedPersonId_fkey" FOREIGN KEY ("affectedPersonId") REFERENCES "AffectedPerson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BeneficiaryVerification" ADD CONSTRAINT "BeneficiaryVerification_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "Beneficiary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_awardId_fkey" FOREIGN KEY ("awardId") REFERENCES "CompensationAward"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "Beneficiary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PaymentTransaction" ADD CONSTRAINT "PaymentTransaction_acquisitionCaseId_fkey" FOREIGN KEY ("acquisitionCaseId") REFERENCES "AcquisitionCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RRCase" ADD CONSTRAINT "RRCase_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RRCase" ADD CONSTRAINT "RRCase_acquisitionCaseId_fkey" FOREIGN KEY ("acquisitionCaseId") REFERENCES "AcquisitionCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RRCase" ADD CONSTRAINT "RRCase_familyId_fkey" FOREIGN KEY ("familyId") REFERENCES "AffectedFamily"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RRCase" ADD CONSTRAINT "RRCase_approvedById_fkey" FOREIGN KEY ("approvedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RRCase" ADD CONSTRAINT "RRCase_completedById_fkey" FOREIGN KEY ("completedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RREntitlement" ADD CONSTRAINT "RREntitlement_rrCaseId_fkey" FOREIGN KEY ("rrCaseId") REFERENCES "RRCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PossessionRecord" ADD CONSTRAINT "PossessionRecord_acquisitionCaseId_fkey" FOREIGN KEY ("acquisitionCaseId") REFERENCES "AcquisitionCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PossessionRecord" ADD CONSTRAINT "PossessionRecord_recordedById_fkey" FOREIGN KEY ("recordedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PossessionChecklistItem" ADD CONSTRAINT "PossessionChecklistItem_possessionRecordId_fkey" FOREIGN KEY ("possessionRecordId") REFERENCES "PossessionRecord"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PossessionChecklistItem" ADD CONSTRAINT "PossessionChecklistItem_completedById_fkey" FOREIGN KEY ("completedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Document" ADD CONSTRAINT "Document_currentVersionId_fkey" FOREIGN KEY ("currentVersionId") REFERENCES "DocumentVersion"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentVersion" ADD CONSTRAINT "DocumentVersion_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DocumentVersion" ADD CONSTRAINT "DocumentVersion_uploadedById_fkey" FOREIGN KEY ("uploadedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldVisit" ADD CONSTRAINT "FieldVisit_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldVisit" ADD CONSTRAINT "FieldVisit_acquisitionCaseId_fkey" FOREIGN KEY ("acquisitionCaseId") REFERENCES "AcquisitionCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldVisit" ADD CONSTRAINT "FieldVisit_officerId_fkey" FOREIGN KEY ("officerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldEvidence" ADD CONSTRAINT "FieldEvidence_fieldVisitId_fkey" FOREIGN KEY ("fieldVisitId") REFERENCES "FieldVisit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldEvidence" ADD CONSTRAINT "FieldEvidence_documentId_fkey" FOREIGN KEY ("documentId") REFERENCES "Document"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FieldChecklistItem" ADD CONSTRAINT "FieldChecklistItem_fieldVisitId_fkey" FOREIGN KEY ("fieldVisitId") REFERENCES "FieldVisit"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notification" ADD CONSTRAINT "Notification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "NotificationDelivery" ADD CONSTRAINT "NotificationDelivery_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "Notification"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_acquisitionCaseId_fkey" FOREIGN KEY ("acquisitionCaseId") REFERENCES "AcquisitionCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Alert" ADD CONSTRAINT "Alert_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AnomalyEvent" ADD CONSTRAINT "AnomalyEvent_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntegrationSync" ADD CONSTRAINT "IntegrationSync_integrationSourceId_fkey" FOREIGN KEY ("integrationSourceId") REFERENCES "IntegrationSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "IntegrationEvent" ADD CONSTRAINT "IntegrationEvent_integrationSourceId_fkey" FOREIGN KEY ("integrationSourceId") REFERENCES "IntegrationSource"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuditEvent" ADD CONSTRAINT "AuditEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grievance" ADD CONSTRAINT "Grievance_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Project"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grievance" ADD CONSTRAINT "Grievance_acquisitionCaseId_fkey" FOREIGN KEY ("acquisitionCaseId") REFERENCES "AcquisitionCase"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grievance" ADD CONSTRAINT "Grievance_beneficiaryId_fkey" FOREIGN KEY ("beneficiaryId") REFERENCES "Beneficiary"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grievance" ADD CONSTRAINT "Grievance_submittedById_fkey" FOREIGN KEY ("submittedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grievance" ADD CONSTRAINT "Grievance_assignedToId_fkey" FOREIGN KEY ("assignedToId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Grievance" ADD CONSTRAINT "Grievance_resolvedById_fkey" FOREIGN KEY ("resolvedById") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
