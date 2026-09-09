import { Request, Response, NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { prisma } from "../database/client.js";
import { emailService } from "../services/email.service.js";
import { sendSuccess } from "../utils/response.js";
import { BadRequestError, UnauthorizedError, NotFoundError } from "../utils/errors.js";
import { Role } from "../constants/roles.js";

export class AdminController {
  /**
   * Get all pending users awaiting approval
   * GET /api/v1/admin/users/pending
   */
  async getPendingUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const auth = getAuth(req);
      if (!auth.userId) {
        throw new UnauthorizedError("Not authenticated");
      }

      // Check if user has admin permissions
      const currentUser = await prisma.user.findUnique({
        where: { clerkUserId: auth.userId },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      if (!currentUser) {
        throw new UnauthorizedError("User not found");
      }

      const userRoles = currentUser.roles.map((ur) => ur.role.code);
      const isAdmin =
        userRoles.includes(Role.SUPER_ADMIN) ||
        userRoles.includes(Role.STATE_ADMIN) ||
        userRoles.includes(Role.DISTRICT_ADMIN);

      if (!isAdmin) {
        throw new UnauthorizedError(
          "Only administrators can view pending users",
        );
      }

      // Get all pending users
      const pendingUsers = await prisma.user.findMany({
        where: {
          status: "PENDING_APPROVAL",
        },
        orderBy: {
          createdAt: "desc",
        },
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          requestedDepartment: true,
          requestedRole: true,
          requestedStateId: true,
          requestedDistrictId: true,
          requestReason: true,
          createdAt: true,
        },
      });

      sendSuccess(res, pendingUsers);
    } catch (error) {
      next(error);
    }
  }

  /**
   * Approve user and assign role
   * POST /api/v1/admin/users/:userId/approve
   */
  async approveUser(req: Request, res: Response, next: NextFunction) {
    try {
      const auth = getAuth(req);
      if (!auth.userId) {
        throw new UnauthorizedError("Not authenticated");
      }

      const userId = req.params.userId as string;
      const { roleCode, stateId, districtId, departmentId } = req.body;

      if (!roleCode) {
        throw new BadRequestError("Role code is required");
      }

      // Check if admin has permission
      const currentUser = await prisma.user.findUnique({
        where: { clerkUserId: auth.userId },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      if (!currentUser) {
        throw new UnauthorizedError("Admin user not found");
      }

      const userRoles = currentUser.roles.map((ur) => ur.role.code);
      const isAdmin =
        userRoles.includes(Role.SUPER_ADMIN) ||
        userRoles.includes(Role.STATE_ADMIN) ||
        userRoles.includes(Role.DISTRICT_ADMIN);

      if (!isAdmin) {
        throw new UnauthorizedError("Only administrators can approve users");
      }

      // Get the user to approve
      const userToApprove = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!userToApprove) {
        throw new NotFoundError("User not found");
      }

      if (userToApprove.status !== "PENDING_APPROVAL") {
        throw new BadRequestError("User is not in pending status");
      }

      // Get the role
      const role = await prisma.role.findUnique({
        where: { code: roleCode },
        include: {
          permissions: {
            include: {
              permission: true,
            },
          },
        },
      });

      if (!role) {
        throw new NotFoundError("Role not found");
      }

      // Update user status to ACTIVE and assign role
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          status: "ACTIVE",
          approvedBy: currentUser.id,
          approvedAt: new Date(),
          roles: {
            create: {
              roleId: role.id,
            },
          },
        },
        include: {
          roles: {
            include: {
              role: {
                include: {
                  permissions: {
                    include: {
                      permission: true,
                    },
                  },
                },
              },
            },
          },
        },
      });

      // Add user scopes based on state/district
      if (stateId || districtId) {
        await prisma.userScope.create({
          data: {
            userId: userId,
            scopeLevel: districtId ? "DISTRICT" : "STATE",
            stateId: stateId || null,
            districtId: districtId || null,
          },
        });
      }

      // Create audit log
      await prisma.auditEvent.create({
        data: {
          action: "USER_APPROVED",
          actorId: currentUser.id,
          entityType: "User",
          entityId: userId,
          timestamp: new Date(),
          requestId: req.headers["x-request-id"] as string || "system",
          source: "admin_panel",
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"],
          newValue: {
            assignedRole: roleCode,
            stateId,
            districtId,
            departmentId,
            approverName: currentUser.name,
          },
        },
      });

      // Send approval email to user
      try {
        await emailService.sendUserApprovedEmail(
          updatedUser.email,
          updatedUser.name,
          roleCode,
          currentUser.name,
          stateId,
          districtId,
        );
      } catch (error) {
        console.error("[Admin Controller] Failed to send approval email:", error);
      }

      sendSuccess(res, {
        message: "User approved successfully",
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          status: updatedUser.status,
          role: roleCode,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Reject user
   * POST /api/v1/admin/users/:userId/reject
   */
  async rejectUser(req: Request, res: Response, next: NextFunction) {
    try {
      const auth = getAuth(req);
      if (!auth.userId) {
        throw new UnauthorizedError("Not authenticated");
      }

      const userId = req.params.userId as string;
      const { reason } = req.body;

      // Check if admin has permission
      const currentUser = await prisma.user.findUnique({
        where: { clerkUserId: auth.userId },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      if (!currentUser) {
        throw new UnauthorizedError("Admin user not found");
      }

      const userRoles = currentUser.roles.map((ur) => ur.role.code);
      const isAdmin =
        userRoles.includes(Role.SUPER_ADMIN) ||
        userRoles.includes(Role.STATE_ADMIN) ||
        userRoles.includes(Role.DISTRICT_ADMIN);

      if (!isAdmin) {
        throw new UnauthorizedError("Only administrators can reject users");
      }

      // Get the user to reject
      const userToReject = await prisma.user.findUnique({
        where: { id: userId },
      });

      if (!userToReject) {
        throw new NotFoundError("User not found");
      }

      if (userToReject.status !== "PENDING_APPROVAL") {
        throw new BadRequestError("User is not in pending status");
      }

      // Update user status to REJECTED
      const updatedUser = await prisma.user.update({
        where: { id: userId },
        data: {
          status: "REJECTED",
          rejectedBy: currentUser.id,
          rejectedAt: new Date(),
          rejectionReason: reason,
        },
      });

      // Create audit log
      await prisma.auditEvent.create({
        data: {
          action: "USER_REJECTED",
          actorId: currentUser.id,
          entityType: "User",
          entityId: userId,
          timestamp: new Date(),
          requestId: req.headers["x-request-id"] as string || "system",
          source: "admin_panel",
          ipAddress: req.ip,
          userAgent: req.headers["user-agent"],
          reason: reason,
          newValue: {
            rejectorName: currentUser.name,
          },
        },
      });

      // Send rejection email to user
      try {
        await emailService.sendUserRejectedEmail(
          updatedUser.email,
          updatedUser.name,
          reason,
        );
      } catch (error) {
        console.error("[Admin Controller] Failed to send rejection email:", error);
      }

      sendSuccess(res, {
        message: "User rejected successfully",
        user: {
          id: updatedUser.id,
          name: updatedUser.name,
          email: updatedUser.email,
          status: updatedUser.status,
        },
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * Get all users (for admin management)
   * GET /api/v1/admin/users
   */
  async getAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      const auth = getAuth(req);
      if (!auth.userId) {
        throw new UnauthorizedError("Not authenticated");
      }

      // Check if user has admin permissions
      const currentUser = await prisma.user.findUnique({
        where: { clerkUserId: auth.userId },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
        },
      });

      if (!currentUser) {
        throw new UnauthorizedError("User not found");
      }

      const userRoles = currentUser.roles.map((ur) => ur.role.code);
      const isAdmin =
        userRoles.includes(Role.SUPER_ADMIN) ||
        userRoles.includes(Role.STATE_ADMIN) ||
        userRoles.includes(Role.DISTRICT_ADMIN);

      if (!isAdmin) {
        throw new UnauthorizedError("Only administrators can view all users");
      }

      // Get all users with their roles
      const users = await prisma.user.findMany({
        orderBy: {
          createdAt: "desc",
        },
        include: {
          roles: {
            include: {
              role: true,
            },
          },
          scopes: true,
        },
      });

      const formattedUsers = users.map((user) => ({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        status: user.status,
        isActive: user.isActive,
        roles: user.roles.map((ur) => ur.role.code),
        scopes: user.scopes,
        requestedDepartment: user.requestedDepartment,
        requestedRole: user.requestedRole,
        approvedAt: user.approvedAt,
        rejectedAt: user.rejectedAt,
        createdAt: user.createdAt,
      }));

      sendSuccess(res, formattedUsers);
    } catch (error) {
      next(error);
    }
  }
}

export const adminController = new AdminController();
