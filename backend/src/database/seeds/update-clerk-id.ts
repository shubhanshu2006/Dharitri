import { prisma } from "../client.js";

/**
 * Update a user's Clerk ID after they sign in
 * 
 * Usage: npx tsx src/database/seeds/update-clerk-id.ts <USER_ID> <CLERK_ID>
 * 
 * Example:
 * npx tsx src/database/seeds/update-clerk-id.ts 123e4567-e89b-12d3-a456-426614174000 user_2abc3def4ghi5jkl
 */

async function updateClerkId() {
  const userId = process.argv[2];
  const newClerkId = process.argv[3];

  if (!userId || !newClerkId) {
    console.error("\n❌ Error: Missing arguments\n");
    console.log("Usage: npx tsx src/database/seeds/update-clerk-id.ts <USER_ID> <CLERK_ID>");
    console.log("\nExample:");
    console.log(
      "npx tsx src/database/seeds/update-clerk-id.ts 123e4567-e89b-12d3-a456-426614174000 user_2abc3def4ghi5jkl\n",
    );
    process.exit(1);
  }

  try {
    console.log("\n🔄 Updating Clerk ID...\n");
    console.log(`   User ID: ${userId}`);
    console.log(`   New Clerk ID: ${newClerkId}\n`);

    // Check if user exists
    const user = await prisma.user.findUnique({
      where: { id: userId },
      include: {
        roles: {
          include: {
            role: true,
          },
        },
      },
    });

    if (!user) {
      console.error(`❌ User not found with ID: ${userId}\n`);
      process.exit(1);
    }

    // Check if Clerk ID is already in use
    const existingUser = await prisma.user.findUnique({
      where: { clerkUserId: newClerkId },
    });

    if (existingUser && existingUser.id !== userId) {
      console.error(
        `❌ Clerk ID already in use by another user: ${existingUser.email}\n`,
      );
      process.exit(1);
    }

    // Update Clerk ID
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        clerkUserId: newClerkId,
      },
    });

    console.log("✅ Clerk ID updated successfully!\n");
    console.log("   User Details:");
    console.log(`   ID: ${updatedUser.id}`);
    console.log(`   Name: ${updatedUser.name}`);
    console.log(`   Email: ${updatedUser.email}`);
    console.log(`   Clerk ID: ${updatedUser.clerkUserId}`);
    console.log(`   Role: ${user.roles.map((r) => r.role.name).join(", ")}`);
    console.log(`   Status: ${updatedUser.status}\n`);

    console.log("✅ You can now sign in with this account!");
    console.log(`   Email: ${updatedUser.email}`);
    console.log(`   URL: ${process.env.FRONTEND_URL || "http://localhost:3000"}\n`);
  } catch (error) {
    console.error("\n❌ Error updating Clerk ID:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

updateClerkId();
