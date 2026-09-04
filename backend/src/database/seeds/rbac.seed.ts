import { prisma } from "../client.js";
import { Role } from "../../constants/roles.js";
import { Permission } from "../../constants/permissions.js";
import { logger } from "../../utils/logger.js";

export async function seedRolesAndPermissions() {
  logger.info("Starting RBAC seed...");

  const permissions = Object.values(Permission).map((code) => ({
    code,
    name: code
      .replace(/_/g, " ")
      .toLowerCase()
      .replace(/\b\w/g, (l) => l.toUpperCase()),
    description: code.replace(/_/g, " ").toLowerCase(),
  }));

  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: { code: perm.code },
      update: {},
      create: perm,
    });
  }

  logger.info(`Seeded ${permissions.length} permissions`);

  const roles = [
    {
      code: Role.SUPER_ADMIN,
      name: "Super Admin",
      description: "Full system access and administration",
      permissions: Object.values(Permission),
    },
    {
      code: Role.CENTRAL_MINISTRY,
      name: "Central Ministry",
      description: "Central government ministry access",
      permissions: [
        Permission.PROJECT_VIEW,
        Permission.PROJECT_APPROVE,
        Permission.PARCEL_VIEW,
        Permission.ACQUISITION_VIEW,
        Permission.COMPENSATION_VIEW,
        Permission.PAYMENT_VIEW,
        Permission.RR_VIEW,
        Permission.DASHBOARD_VIEW,
        Permission.ANALYTICS_VIEW,
        Permission.AUDIT_VIEW,
      ],
    },
    {
      code: Role.STATE_ADMIN,
      name: "State Admin",
      description: "State-level administration",
      permissions: [
        Permission.PROJECT_CREATE,
        Permission.PROJECT_VIEW,
        Permission.PROJECT_UPDATE,
        Permission.PROJECT_SUBMIT,
        Permission.PARCEL_VIEW,
        Permission.PARCEL_CREATE,
        Permission.ACQUISITION_VIEW,
        Permission.ACQUISITION_CREATE,
        Permission.COMPENSATION_VIEW,
        Permission.PAYMENT_VIEW,
        Permission.RR_VIEW,
        Permission.RR_CREATE,
        Permission.DASHBOARD_VIEW,
        Permission.ANALYTICS_VIEW,
        Permission.GIS_VIEW,
        Permission.CASE_ROUTE,
        Permission.USER_MANAGE,
      ],
    },
    {
      code: Role.DISTRICT_ADMIN,
      name: "District Admin",
      description: "District-level administration",
      permissions: [
        Permission.PROJECT_VIEW,
        Permission.PROJECT_UPDATE,
        Permission.PARCEL_VIEW,
        Permission.PARCEL_CREATE,
        Permission.PARCEL_UPDATE,
        Permission.ACQUISITION_VIEW,
        Permission.ACQUISITION_CREATE,
        Permission.ACQUISITION_UPDATE,
        Permission.VERIFICATION_VIEW,
        Permission.VERIFICATION_APPROVE,
        Permission.COMPENSATION_VIEW,
        Permission.COMPENSATION_APPROVE,
        Permission.DASHBOARD_VIEW,
        Permission.GIS_VIEW,
        Permission.CASE_ROUTE,
        Permission.CASE_ASSIGN,
      ],
    },
    {
      code: Role.LAND_ACQUISITION_OFFICER,
      name: "Land Acquisition Officer",
      description: "Land acquisition operations",
      permissions: [
        Permission.PARCEL_VIEW,
        Permission.PARCEL_UPDATE,
        Permission.ACQUISITION_VIEW,
        Permission.ACQUISITION_UPDATE,
        Permission.ACQUISITION_TRANSITION,
        Permission.VERIFICATION_CREATE,
        Permission.VERIFICATION_VIEW,
        Permission.VERIFICATION_RUN,
        Permission.COMPENSATION_CREATE,
        Permission.COMPENSATION_VIEW,
        Permission.COMPENSATION_UPDATE,
        Permission.COMPENSATION_SUBMIT,
        Permission.BENEFICIARY_VIEW,
        Permission.BENEFICIARY_CREATE,
        Permission.DOCUMENT_UPLOAD,
        Permission.DOCUMENT_VIEW,
        Permission.GIS_VIEW,
      ],
    },
    {
      code: Role.FINANCE_OFFICER,
      name: "Finance Officer",
      description: "Financial operations and payments",
      permissions: [
        Permission.COMPENSATION_VIEW,
        Permission.PAYMENT_INITIATE,
        Permission.PAYMENT_VIEW,
        Permission.PAYMENT_SYNC,
        Permission.BENEFICIARY_VIEW,
        Permission.BENEFICIARY_VERIFY,
        Permission.DOCUMENT_VIEW,
        Permission.AUDIT_VIEW,
      ],
    },
    {
      code: Role.RR_OFFICER,
      name: "R&R Officer",
      description: "Rehabilitation and resettlement",
      permissions: [
        Permission.RR_CREATE,
        Permission.RR_VIEW,
        Permission.RR_UPDATE,
        Permission.RR_APPROVE,
        Permission.RR_COMPLETE,
        Permission.BENEFICIARY_VIEW,
        Permission.BENEFICIARY_CREATE,
        Permission.DOCUMENT_VIEW,
        Permission.DOCUMENT_UPLOAD,
        Permission.FIELD_VISIT_VIEW,
      ],
    },
    {
      code: Role.FIELD_VERIFIER,
      name: "Field Verifier",
      description: "Field verification operations",
      permissions: [
        Permission.FIELD_VISIT_CREATE,
        Permission.FIELD_VISIT_VIEW,
        Permission.FIELD_VISIT_SUBMIT,
        Permission.PARCEL_VIEW,
        Permission.DOCUMENT_UPLOAD,
        Permission.DOCUMENT_VIEW,
        Permission.GIS_VIEW,
      ],
    },
    {
      code: Role.GIS_OFFICER,
      name: "GIS Officer",
      description: "GIS and mapping operations",
      permissions: [
        Permission.GIS_VIEW,
        Permission.GIS_UPDATE,
        Permission.GIS_ADMIN,
        Permission.PARCEL_VIEW,
        Permission.PARCEL_UPDATE,
        Permission.PROJECT_VIEW,
        Permission.DOCUMENT_VIEW,
      ],
    },
    {
      code: Role.REVIEWER,
      name: "Reviewer",
      description: "Review and approval operations",
      permissions: [
        Permission.PROJECT_VIEW,
        Permission.PARCEL_VIEW,
        Permission.ACQUISITION_VIEW,
        Permission.VERIFICATION_VIEW,
        Permission.VERIFICATION_APPROVE,
        Permission.VERIFICATION_REQUEST_CORRECTION,
        Permission.COMPENSATION_VIEW,
        Permission.COMPENSATION_APPROVE,
        Permission.COMPENSATION_REJECT,
        Permission.DOCUMENT_VIEW,
      ],
    },
    {
      code: Role.EXECUTIVE_VIEWER,
      name: "Executive Viewer",
      description: "Executive dashboard and reports access",
      permissions: [
        Permission.DASHBOARD_VIEW,
        Permission.ANALYTICS_VIEW,
        Permission.PROJECT_VIEW,
        Permission.PARCEL_VIEW,
        Permission.ACQUISITION_VIEW,
        Permission.COMPENSATION_VIEW,
        Permission.PAYMENT_VIEW,
        Permission.RR_VIEW,
        Permission.GIS_VIEW,
      ],
    },
    {
      code: Role.PROJECT_IMPLEMENTING_AGENCY,
      name: "Project Implementing Agency",
      description: "Project implementation and management",
      permissions: [
        Permission.PROJECT_VIEW,
        Permission.PROJECT_UPDATE,
        Permission.PROJECT_SUBMIT,
        Permission.PARCEL_VIEW,
        Permission.ACQUISITION_VIEW,
        Permission.COMPENSATION_VIEW,
        Permission.DOCUMENT_VIEW,
        Permission.DOCUMENT_UPLOAD,
        Permission.GIS_VIEW,
        Permission.DASHBOARD_VIEW,
      ],
    },
    {
      code: Role.CITIZEN,
      name: "Citizen",
      description: "Public access",
      permissions: [
        Permission.GRIEVANCE_CREATE,
        Permission.GRIEVANCE_VIEW,
        Permission.NOTIFICATION_VIEW,
      ],
    },
  ];

  for (const role of roles) {
    const createdRole = await prisma.role.upsert({
      where: { code: role.code },
      update: {
        name: role.name,
        description: role.description,
      },
      create: {
        code: role.code,
        name: role.name,
        description: role.description,
      },
    });

    for (const permCode of role.permissions) {
      const permission = await prisma.permission.findUnique({
        where: { code: permCode },
      });

      if (permission) {
        await prisma.rolePermission.upsert({
          where: {
            roleId_permissionId: {
              roleId: createdRole.id,
              permissionId: permission.id,
            },
          },
          update: {},
          create: {
            roleId: createdRole.id,
            permissionId: permission.id,
          },
        });
      }
    }
  }

  logger.info(`Seeded ${roles.length} roles with permissions`);
  logger.info("RBAC seed completed successfully");
}
