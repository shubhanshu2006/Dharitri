import { prisma } from "../database/client.js";
import { clerkClient } from "@clerk/express";

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

      user = await prisma.user.create({
        data: {
          clerkUserId,
          name:
            `${clerkUser.firstName || ""} ${clerkUser.lastName || ""}`.trim() ||
            "User",
          email: clerkUser.emailAddresses[0]?.emailAddress || "",
          phone: clerkUser.phoneNumbers[0]?.phoneNumber || null,
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
    }

    return user;
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
      isActive: user.isActive,
      roles,
      permissions: [...new Set(permissions)],
      scopes: user.scopes,
    };
  }
}

export const userService = new UserService();
