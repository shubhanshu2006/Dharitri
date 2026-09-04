import { prisma } from "../client.js";
import { logger } from "../../utils/logger.js";

export async function seedLocations() {
  logger.info("Seeding locations...");

  const states = [
    {
      id: "11111111-1111-1111-1111-111111111111",
      name: "Maharashtra",
      code: "MH",
    },
    {
      id: "22222222-2222-2222-2222-222222222222",
      name: "Karnataka",
      code: "KA",
    },
    { id: "33333333-3333-3333-3333-333333333333", name: "Gujarat", code: "GJ" },
  ];

  for (const state of states) {
    await prisma.state.upsert({
      where: { id: state.id },
      update: {},
      create: state,
    });
  }

  logger.info(`Seeded ${states.length} states`);

  const districts = [
    {
      id: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      name: "Mumbai",
      code: "MUM",
      stateId: "11111111-1111-1111-1111-111111111111",
    },
    {
      id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb",
      name: "Pune",
      code: "PUN",
      stateId: "11111111-1111-1111-1111-111111111111",
    },
    {
      id: "cccccccc-cccc-cccc-cccc-cccccccccccc",
      name: "Bangalore Urban",
      code: "BLR",
      stateId: "22222222-2222-2222-2222-222222222222",
    },
    {
      id: "dddddddd-dddd-dddd-dddd-dddddddddddd",
      name: "Ahmedabad",
      code: "AMD",
      stateId: "33333333-3333-3333-3333-333333333333",
    },
  ];

  for (const district of districts) {
    await prisma.district.upsert({
      where: { id: district.id },
      update: {},
      create: district,
    });
  }

  logger.info(`Seeded ${districts.length} districts`);
  logger.info("Location seed completed successfully");
}
