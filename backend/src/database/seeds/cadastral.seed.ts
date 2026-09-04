import { prisma } from "../client.js";
import { logger } from "../../utils/logger.js";

export async function seedCadastralParcels() {
  logger.info("Seeding cadastral parcels...");

  const parcels = [
    {
      id: "11111111-1111-1111-1111-111111111111",
      parcelReference: "MH-MUM-001",
      ulpin: "270190100010001",
      surveyNumber: "123",
      stateId: "11111111-1111-1111-1111-111111111111",
      districtId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      areaSqMeters: 5000.0,
      landCategory: "AGRICULTURAL",
    },
    {
      id: "22222222-2222-2222-2222-222222222222",
      parcelReference: "MH-MUM-002",
      ulpin: "270190100010002",
      surveyNumber: "124",
      stateId: "11111111-1111-1111-1111-111111111111",
      districtId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      areaSqMeters: 3500.0,
      landCategory: "RESIDENTIAL",
    },
    {
      id: "33333333-3333-3333-3333-333333333333",
      parcelReference: "KA-BLR-001",
      ulpin: "290660100010001",
      surveyNumber: "456",
      stateId: "22222222-2222-2222-2222-222222222222",
      districtId: "cccccccc-cccc-cccc-cccc-cccccccccccc",
      areaSqMeters: 7500.0,
      landCategory: "COMMERCIAL",
    },
  ];

  for (const parcel of parcels) {
    await prisma.cadastralParcel.upsert({
      where: { id: parcel.id },
      update: {},
      create: parcel,
    });
  }

  logger.info(`Seeded ${parcels.length} cadastral parcels`);
  logger.info("Cadastral parcels seed completed successfully");
}
