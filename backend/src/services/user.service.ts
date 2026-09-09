import { prisma } from "../database/client.js";
import { clerkClient } from "@clerk/express";
import { emailService } from "./email.service.js";
import { Role } from "../constants/roles.js";

export class UserService {
  async findOrCreateUser(clerkUserId: string) {
    let user = await prisma.user.findUnique({
      where: { clerkUserId },
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
        scopes: true,
      },
    });

    if (!user) {
      const clerkUser = await clerkClient.users.getUser(clerkUserId);
      const userName =
        `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
        "User";
      const userEmail = clerkUser.emailAddresses[0]?.emailAddress || "";

      // Create user with PENDING_APPROVAL status
      user = await prisma.user.create({
        data: {
          clerkUserId,
          name: userName,
          email: userEmail,
          phone: clerkUser.phoneNumbers[0]?.phoneNumber || null,
          status: "PENDING_APPROVAL", // New users start as pending
          isActive: true,
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
          scopes: true,
        },
      });

      // Send welcome email to user
      try {
        await emailService.sendUserWelcomeEmail(userEmail, userName);
      } catch (error) {
        console.error("[User Service] Failed to send welcome email:", error);
      }

      // Notify all admins (SUPER_ADMIN, STATE_ADMIN, DISTRICT_ADMIN)
      try {
        await this.notifyAdminsOfNewUser(user);
      } catch (error) {
        console.error(
          "[User Service] Failed to notify admins of new user:",
          error,
        );
      }
    }

    return user;
  }

  private async notifyAdminsOfNewUser(newUser: any): Promise<void> {
    // Get all users with admin roles
    const adminUsers = await prisma.user.findMany({
      where: {
        status: "ACTIVE",
        roles: {
          some: {
            role: {
              code: {
                in: [Role.SUPER_ADMIN, Role.STATE_ADMIN, Role.DISTRICT_ADMIN],
              },
            },
          },
        },
      },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    // Send email to each admin
    for (const admin of adminUsers) {
      try {
        await emailService.sendAdminNotificationEmail(
          admin.email,
          admin.name,
          {
            name: newUser.name,
            email: newUser.email,
            requestedDepartment: newUser.requestedDepartment,
            requestedRole: newUser.requestedRole,
            requestReason: newUser.requestReason,
            createdAt: newUser.createdAt,
          },
          newUser.id,
        );
      } catch (error) {
        console.error(
          `[User Service] Failed to send notification to admin ${admin.email}:`,
          error,
        );
      }
    }
  }

  async getUserWithPermissions(clerkUserId: string) {
    const user = await this.findOrCreateUser(clerkUserId);

    const permissions = user.roles.flatMap((userRole) =>
      userRole.role.permissions.map((rp) => rp.permission.code),
    );

    const roles = user.roles.map((userRole) => userRole.role.code);

    return {
      id: user.id,
      clerkUserId: user.clerkUserId,
      name: user.name,
      email: user.email,
      phone: user.phone,
      status: user.status, // Include status
      isActive: user.isActive,
      roles,
      permissions: [...new Set(permissions)],
      scopes: user.scopes,
      requestedDepartment: user.requestedDepartment,
      requestedRole: user.requestedRole,
      requestReason: user.requestReason,
      approvedAt: user.approvedAt,
      rejectedAt: user.rejectedAt,
    };
  }

  async updateUserAccessRequest(
    userId: string,
    requestData: {
      requestedDepartment?: string;
      requestedRole?: string;
      requestedStateId?: string;
      requestedDistrictId?: string;
      requestReason?: string;
    },
  ) {
    // Convert empty strings to null for UUID fields
    const cleanData = {
      ...requestData,
      requestedStateId: requestData.requestedStateId || null,
      requestedDistrictId: requestData.requestedDistrictId || null,
    };

    return await prisma.user.update({
      where: { id: userId },
      data: cleanData,
    });
  }
}

export const userService = new UserService();
