import { prisma } from "../client.js";
import { Role } from "../../constants/roles.js";

export async function seedSuperAdmin() {
  console.log("\n Creating Super Admin user...\n");

  // Configuration - CHANGE THESE VALUES
  const superAdminConfig = {
    clerkUserId: "user_3J6BvsG4IePo2NYrVjpRqvU760B", 
    name: "Super Administrator",
    email: "shubhanshus450@gmail.com", 
    phone: null,
    status: "ACTIVE" as const,
  };

  try {
    // Check if super admin already exists
    const existingAdmin = await prisma.user.findUnique({
      where: { clerkUserId: superAdminConfig.clerkUserId },
    });

    if (existingAdmin) {
      console.log("Super Admin already exists!");
      console.log(`   ID: ${existingAdmin.id}`);
      console.log(`   Email: ${existingAdmin.email}`);
      console.log(`   Status: ${existingAdmin.status}\n`);
      return existingAdmin;
    }

    // Get SUPER_ADMIN role
    const superAdminRole = await prisma.role.findUnique({
      where: { code: Role.SUPER_ADMIN },
      include: {
        permissions: true,
      },
    });

    if (!superAdminRole) {
      throw new Error(
        "SUPER_ADMIN role not found! Please run RBAC seed first: npm run db:seed:rbac",
      );
    }

    // Create super admin user
    const superAdmin = await prisma.user.create({
      data: {
        clerkUserId: superAdminConfig.clerkUserId,
        name: superAdminConfig.name,
        email: superAdminConfig.email,
        phone: superAdminConfig.phone,
        status: superAdminConfig.status,
        isActive: true,
        approvedAt: new Date(),
        roles: {
          create: {
            roleId: superAdminRole.id,
          },
        },
        scopes: {
          create: {
            scopeLevel: "NATIONAL",
            // National scope - no state/district needed
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

    console.log("Super Admin created successfully!\n");
    console.log("   User Details:");
    console.log(`   ID: ${superAdmin.id}`);
    console.log(`   Name: ${superAdmin.name}`);
    console.log(`   Email: ${superAdmin.email}`);
    console.log(`   Role: ${superAdmin.roles[0].role.name}`);
    console.log(`   Status: ${superAdmin.status}`);
    console.log(`   Permissions: ${superAdminRole.permissions.length} total\n`);

    console.log("⚠️  IMPORTANT - Next Steps:");
    console.log("   1. Sign in to DHARITRI with Google (use the email above)");
    console.log("   2. Get your Clerk User ID from Clerk Dashboard");
    console.log("   3. Run this command to update your Clerk ID:\n");
    console.log(
      `   npx tsx src/database/seeds/update-clerk-id.ts ${superAdmin.id} <YOUR_CLERK_ID>\n`,
    );

    return superAdmin;
  } catch (error) {
    console.error("Error creating super admin:", error);
    throw error;
  }
}

// Run if called directly
seedSuperAdmin()
  .then(() => {
    console.log("\n✅ Super Admin seed completed");
  })
  .catch((error) => {
    console.error("\n❌ Super Admin seed failed:", error);
    console.error(error);
  })
  .finally(async () => {
    await prisma.$disconnect();
    process.exit(0);
  });
