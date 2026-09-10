import { prisma } from "../client.js";
import { logger } from "../../utils/logger.js";

/**
 * Creates demo cadastral parcels in Delhi/Varanasi area
 * These parcels will be identified when boundary is drawn
 */
async function seedDemoParcels() {
  logger.info("Seeding demo cadastral parcels...");

  // Get Delhi state
  const delhi = await prisma.state.findFirst({
    where: { code: "DL" }
  });

  if (!delhi) {
    throw new Error("Delhi state not found. Please run location seed first.");
  }

  // Get a district in Delhi
  const district = await prisma.district.findFirst({
    where: { stateId: delhi.id }
  });

  if (!district) {
    throw new Error("No district found for Delhi. Please run location seed first.");
  }

  // Sample parcels with realistic coordinates in Delhi/Varanasi area
  const demoParcels = [
    {
      parcelReference: "DL-VAR-123-4",
      surveyNumber: "123/4",
      stateId: delhi.id,
      areaSqMeters: 1500,
      landCategory: "Agricultural",
      // Polygon in Varanasi area (matching your screenshot)
      geometry: "POLYGON((77.2090 28.6139, 77.2120 28.6139, 77.2120 28.6159, 77.2090 28.6159, 77.2090 28.6139))",
      ownerName: "Ramesh Kumar",
      ownerAadhaar: "1234-5678-9012",
      ownerMobile: "9876543210",
    },
    {
      parcelReference: "DL-VAR-124-1",
      surveyNumber: "124/1",
      stateId: delhi.id,
      areaSqMeters: 2200,
      landCategory: "Residential",
      geometry: "POLYGON((77.2120 28.6139, 77.2150 28.6139, 77.2150 28.6159, 77.2120 28.6159, 77.2120 28.6139))",
      ownerName: "Suresh Patil",
      ownerAadhaar: "2234-5678-9013",
      ownerMobile: "9876543211",
    },
    {
      parcelReference: "DL-VAR-125-2",
      surveyNumber: "125/2",
      stateId: delhi.id,
      areaSqMeters: 1800,
      landCategory: "Agricultural",
      geometry: "POLYGON((77.2150 28.6139, 77.2180 28.6139, 77.2180 28.6159, 77.2150 28.6159, 77.2150 28.6139))",
      ownerName: "Geeta Devi",
      ownerAadhaar: "3234-5678-9014",
      ownerMobile: "9876543212",
    },
    {
      parcelReference: "DL-VAR-126-3",
      surveyNumber: "126/3",
      stateId: delhi.id,
      areaSqMeters: 3000,
      landCategory: "Commercial",
      geometry: "POLYGON((77.2090 28.6159, 77.2120 28.6159, 77.2120 28.6189, 77.2090 28.6189, 77.2090 28.6159))",
      ownerName: "Vijay Singh",
      ownerAadhaar: "4234-5678-9015",
      ownerMobile: "9876543213",
    },
    {
      parcelReference: "DL-VAR-127-1",
      surveyNumber: "127/1",
      stateId: delhi.id,
      areaSqMeters: 2500,
      landCategory: "Agricultural",
      geometry: "POLYGON((77.2120 28.6159, 77.2150 28.6159, 77.2150 28.6189, 77.2120 28.6189, 77.2120 28.6159))",
      ownerName: "Anita Sharma",
      ownerAadhaar: "5234-5678-9016",
      ownerMobile: "9876543214",
    },
    {
      parcelReference: "DL-VAR-128-4",
      surveyNumber: "128/4",
      stateId: delhi.id,
      areaSqMeters: 1600,
      landCategory: "Residential",
      geometry: "POLYGON((77.2150 28.6159, 77.2180 28.6159, 77.2180 28.6189, 77.2150 28.6189, 77.2150 28.6159))",
      ownerName: "Rajesh Verma",
      ownerAadhaar: "6234-5678-9017",
      ownerMobile: "9876543215",
    },
    {
      parcelReference: "DL-VAR-129-2",
      surveyNumber: "129/2",
      stateId: delhi.id,
      areaSqMeters: 1900,
      landCategory: "Agricultural",
      geometry: "POLYGON((77.2090 28.6189, 77.2120 28.6189, 77.2120 28.6219, 77.2090 28.6219, 77.2090 28.6189))",
      ownerName: "Prakash Yadav",
      ownerAadhaar: "7234-5678-9018",
      ownerMobile: "9876543216",
    },
    {
      parcelReference: "DL-VAR-130-5",
      surveyNumber: "130/5",
      stateId: delhi.id,
      areaSqMeters: 2100,
      landCategory: "Residential",
      geometry: "POLYGON((77.2120 28.6189, 77.2150 28.6189, 77.2150 28.6219, 77.2120 28.6219, 77.2120 28.6189))",
      ownerName: "Meena Kumari",
      ownerAadhaar: "8234-5678-9019",
      ownerMobile: "9876543217",
    },
    {
      parcelReference: "DL-VAR-131-3",
      surveyNumber: "131/3",
      stateId: delhi.id,
      areaSqMeters: 2700,
      landCategory: "Agricultural",
      geometry: "POLYGON((77.2150 28.6189, 77.2180 28.6189, 77.2180 28.6219, 77.2150 28.6219, 77.2150 28.6189))",
      ownerName: "Dinesh Mishra",
      ownerAadhaar: "9234-5678-9020",
      ownerMobile: "9876543218",
    },
    {
      parcelReference: "DL-VAR-132-1",
      surveyNumber: "132/1",
      stateId: delhi.id,
      areaSqMeters: 3200,
      landCategory: "Commercial",
      geometry: "POLYGON((77.2090 28.6219, 77.2120 28.6219, 77.2120 28.6249, 77.2090 28.6249, 77.2090 28.6219))",
      ownerName: "Sunita Reddy",
      ownerAadhaar: "1034-5678-9021",
      ownerMobile: "9876543219",
    },
  ];

  let created = 0;
  let skipped = 0;

  for (const parcel of demoParcels) {
    try {
      // Check if parcel already exists
      const existing = await prisma.cadastralParcel.findUnique({
        where: { parcelReference: parcel.parcelReference }
      });

      if (existing) {
        logger.info(`Parcel ${parcel.parcelReference} already exists, skipping`);
        skipped++;
        continue;
      }

      // Insert parcel using raw query (for PostGIS geometry)
      await prisma.$executeRawUnsafe(`
        INSERT INTO "CadastralParcel" (
          id, 
          "parcelReference", 
          "surveyNumber", 
          "stateId", 
          "districtId",
          "areaSqMeters", 
          "landCategory",
          geometry,
          "createdAt",
          "updatedAt"
        ) VALUES (
          gen_random_uuid(),
          $1,
          $2,
          $3,
          $4,
          $5,
          $6,
          ST_GeomFromText($7, 4326),
          NOW(),
          NOW()
        )
      `,
        parcel.parcelReference,
        parcel.surveyNumber,
        parcel.stateId,
        district.id,
        parcel.areaSqMeters,
        parcel.landCategory,
        parcel.geometry
      );

      logger.info(`Created parcel: ${parcel.parcelReference} - Owner: ${parcel.ownerName}`);
      created++;
    } catch (error) {
      logger.error(`Failed to create parcel ${parcel.parcelReference}:`, error as Record<string, unknown>);
    }
  }

  logger.info(`Demo parcels seed completed: ${created} created, ${skipped} skipped`);
}

async function main() {
  try {
    await seedDemoParcels();
    logger.info("✅ Demo parcels seeded successfully!");
  } catch (error) {
    logger.error("❌ Demo parcels seeding failed:", error as Record<string, unknown>);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main();
