import { prisma } from "../client.js";
import { logger } from '../../utils/logger.js';

// Ghaziabad coordinates: 28.6600-28.6700 Lat, 77.4200-77.4310 Lng
// Varanasi coordinates: 25.3200-25.3300 Lat, 82.9800-82.9910 Lng

const ghaziabadParcels = [
  {
    parcelReference: 'UP-GZB-201-1',
    surveyNumber: 'GZB-201/1',
    stateCode: 'UP',
    districtName: 'Ghaziabad',
    areaSqMeters: 2100,
    landCategory: 'Agricultural',
    lat: 28.6680,
    lng: 77.4220,
    owner: 'Vijay Kumar Sharma',
  },
  {
    parcelReference: 'UP-GZB-202-3',
    surveyNumber: 'GZB-202/3',
    stateCode: 'UP',
    districtName: 'Ghaziabad',
    areaSqMeters: 1850,
    landCategory: 'Residential',
    lat: 28.6675,
    lng: 77.4240,
    owner: 'Sunita Devi',
  },
  {
    parcelReference: 'UP-GZB-203-2',
    surveyNumber: 'GZB-203/2',
    stateCode: 'UP',
    districtName: 'Ghaziabad',
    areaSqMeters: 2400,
    landCategory: 'Commercial',
    lat: 28.6665,
    lng: 77.4260,
    owner: 'Rajesh Gupta',
  },
  {
    parcelReference: 'UP-GZB-204-5',
    surveyNumber: 'GZB-204/5',
    stateCode: 'UP',
    districtName: 'Ghaziabad',
    areaSqMeters: 1950,
    landCategory: 'Agricultural',
    lat: 28.6650,
    lng: 77.4230,
    owner: 'Ashok Verma',
  },
  {
    parcelReference: 'UP-GZB-205-1',
    surveyNumber: 'GZB-205/1',
    stateCode: 'UP',
    districtName: 'Ghaziabad',
    areaSqMeters: 2200,
    landCategory: 'Industrial',
    lat: 28.6640,
    lng: 77.4270,
    owner: 'Deepak Singh',
  },
  {
    parcelReference: 'UP-GZB-206-4',
    surveyNumber: 'GZB-206/4',
    stateCode: 'UP',
    districtName: 'Ghaziabad',
    areaSqMeters: 1750,
    landCategory: 'Residential',
    lat: 28.6630,
    lng: 77.4250,
    owner: 'Priya Sharma',
  },
  {
    parcelReference: 'UP-GZB-207-2',
    surveyNumber: 'GZB-207/2',
    stateCode: 'UP',
    districtName: 'Ghaziabad',
    areaSqMeters: 2300,
    landCategory: 'Agricultural',
    lat: 28.6620,
    lng: 77.4290,
    owner: 'Mahesh Kumar',
  },
  {
    parcelReference: 'UP-GZB-208-6',
    surveyNumber: 'GZB-208/6',
    stateCode: 'UP',
    districtName: 'Ghaziabad',
    areaSqMeters: 2050,
    landCategory: 'Commercial',
    lat: 28.6610,
    lng: 77.4220,
    owner: 'Neha Agarwal',
  },
  {
    parcelReference: 'UP-GZB-209-3',
    surveyNumber: 'GZB-209/3',
    stateCode: 'UP',
    districtName: 'Ghaziabad',
    areaSqMeters: 1900,
    landCategory: 'Residential',
    lat: 28.6690,
    lng: 77.4280,
    owner: 'Suresh Yadav',
  },
  {
    parcelReference: 'UP-GZB-210-7',
    surveyNumber: 'GZB-210/7',
    stateCode: 'UP',
    districtName: 'Ghaziabad',
    areaSqMeters: 2150,
    landCategory: 'Agricultural',
    lat: 28.6660,
    lng: 77.4300,
    owner: 'Kavita Singh',
  },
];

const varanasiParcels = [
  {
    parcelReference: 'UP-VNS-301-2',
    surveyNumber: 'VNS-301/2',
    stateCode: 'UP',
    districtName: 'Varanasi',
    areaSqMeters: 2250,
    landCategory: 'Agricultural',
    lat: 25.3280,
    lng: 82.9820,
    owner: 'Ram Prasad Mishra',
  },
  {
    parcelReference: 'UP-VNS-302-4',
    surveyNumber: 'VNS-302/4',
    stateCode: 'UP',
    districtName: 'Varanasi',
    areaSqMeters: 1950,
    landCategory: 'Residential',
    lat: 25.3275,
    lng: 82.9840,
    owner: 'Sita Devi',
  },
  {
    parcelReference: 'UP-VNS-303-1',
    surveyNumber: 'VNS-303/1',
    stateCode: 'UP',
    districtName: 'Varanasi',
    areaSqMeters: 2400,
    landCategory: 'Commercial',
    lat: 25.3265,
    lng: 82.9860,
    owner: 'Shyam Babu',
  },
  {
    parcelReference: 'UP-VNS-304-5',
    surveyNumber: 'VNS-304/5',
    stateCode: 'UP',
    districtName: 'Varanasi',
    areaSqMeters: 2100,
    landCategory: 'Agricultural',
    lat: 25.3250,
    lng: 82.9830,
    owner: 'Ganga Prasad',
  },
  {
    parcelReference: 'UP-VNS-305-3',
    surveyNumber: 'VNS-305/3',
    stateCode: 'UP',
    districtName: 'Varanasi',
    areaSqMeters: 2300,
    landCategory: 'Industrial',
    lat: 25.3240,
    lng: 82.9870,
    owner: 'Radha Sharma',
  },
  {
    parcelReference: 'UP-VNS-306-6',
    surveyNumber: 'VNS-306/6',
    stateCode: 'UP',
    districtName: 'Varanasi',
    areaSqMeters: 1850,
    landCategory: 'Residential',
    lat: 25.3230,
    lng: 82.9850,
    owner: 'Mohan Lal',
  },
  {
    parcelReference: 'UP-VNS-307-2',
    surveyNumber: 'VNS-307/2',
    stateCode: 'UP',
    districtName: 'Varanasi',
    areaSqMeters: 2200,
    landCategory: 'Agricultural',
    lat: 25.3220,
    lng: 82.9890,
    owner: 'Lalita Devi',
  },
  {
    parcelReference: 'UP-VNS-308-8',
    surveyNumber: 'VNS-308/8',
    stateCode: 'UP',
    districtName: 'Varanasi',
    areaSqMeters: 2050,
    landCategory: 'Commercial',
    lat: 25.3210,
    lng: 82.9820,
    owner: 'Ravi Shankar',
  },
  {
    parcelReference: 'UP-VNS-309-4',
    surveyNumber: 'VNS-309/4',
    stateCode: 'UP',
    districtName: 'Varanasi',
    areaSqMeters: 1900,
    landCategory: 'Residential',
    lat: 25.3290,
    lng: 82.9880,
    owner: 'Savita Singh',
  },
  {
    parcelReference: 'UP-VNS-310-9',
    surveyNumber: 'VNS-310/9',
    stateCode: 'UP',
    districtName: 'Varanasi',
    areaSqMeters: 2150,
    landCategory: 'Agricultural',
    lat: 25.3260,
    lng: 82.9900,
    owner: 'Pankaj Tiwari',
  },
];

async function main() {
  logger.info('🌱 Starting Ghaziabad and Varanasi parcels seeding...');

  // Get Uttar Pradesh state
  const upState = await prisma.state.findFirst({
    where: { code: 'UP' },
  });

  if (!upState) {
    logger.error('❌ Uttar Pradesh state not found. Please run state seeds first.');
    return;
  }

  // Get or create Ghaziabad district
  let ghaziabadDistrict = await prisma.district.findFirst({
    where: { 
      name: 'Ghaziabad',
      stateId: upState.id,
    },
  });

  if (!ghaziabadDistrict) {
    ghaziabadDistrict = await prisma.district.create({
      data: {
        code: 'GZB',
        name: 'Ghaziabad',
        stateId: upState.id,
      },
    });
    logger.info('✅ Created Ghaziabad district');
  }

  // Get or create Varanasi district
  let varanasiDistrict = await prisma.district.findFirst({
    where: { 
      name: 'Varanasi',
      stateId: upState.id,
    },
  });

  if (!varanasiDistrict) {
    varanasiDistrict = await prisma.district.create({
      data: {
        code: 'VNS',
        name: 'Varanasi',
        stateId: upState.id,
      },
    });
    logger.info('✅ Created Varanasi district');
  }

  let ghaziabadCount = 0;
  let varanasiCount = 0;

  // Seed Ghaziabad parcels
  logger.info('📍 Seeding Ghaziabad parcels...');
  for (const parcel of ghaziabadParcels) {
    try {
      const existing = await prisma.cadastralParcel.findUnique({
        where: { parcelReference: parcel.parcelReference },
      });

      if (existing) {
        logger.warn(`Parcel ${parcel.parcelReference} already exists, skipping.`);
        continue;
      }

      // Create polygon geometry (small rectangle around the point)
      const halfWidth = 0.0005; // ~55m
      const halfHeight = 0.0004; // ~44m

      const wkt = `POLYGON((${parcel.lng - halfWidth} ${parcel.lat - halfHeight}, ${parcel.lng + halfWidth} ${parcel.lat - halfHeight}, ${parcel.lng + halfWidth} ${parcel.lat + halfHeight}, ${parcel.lng - halfWidth} ${parcel.lat + halfHeight}, ${parcel.lng - halfWidth} ${parcel.lat - halfHeight}))`;

      await prisma.$executeRawUnsafe(
        `INSERT INTO "CadastralParcel" (
          id, "parcelReference", "surveyNumber", "stateId", "districtId",
          "areaSqMeters", "landCategory", geometry, "createdAt", "updatedAt"
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6,
          ST_GeomFromText($7, 4326), NOW(), NOW()
        )`,
        parcel.parcelReference,
        parcel.surveyNumber,
        upState.id,
        ghaziabadDistrict.id,
        parcel.areaSqMeters,
        parcel.landCategory,
        wkt,
      );

      ghaziabadCount++;
      logger.info(`✅ Created parcel: ${parcel.parcelReference} (${parcel.owner})`);
    } catch (error) {
      logger.error(`Failed to create parcel ${parcel.parcelReference}:`, error as Record<string, unknown>);
    }
  }

  // Seed Varanasi parcels
  logger.info('📍 Seeding Varanasi parcels...');
  for (const parcel of varanasiParcels) {
    try {
      const existing = await prisma.cadastralParcel.findUnique({
        where: { parcelReference: parcel.parcelReference },
      });

      if (existing) {
        logger.warn(`Parcel ${parcel.parcelReference} already exists, skipping.`);
        continue;
      }

      // Create polygon geometry (small rectangle around the point)
      const halfWidth = 0.0005; // ~55m
      const halfHeight = 0.0004; // ~44m

      const wkt = `POLYGON((${parcel.lng - halfWidth} ${parcel.lat - halfHeight}, ${parcel.lng + halfWidth} ${parcel.lat - halfHeight}, ${parcel.lng + halfWidth} ${parcel.lat + halfHeight}, ${parcel.lng - halfWidth} ${parcel.lat + halfHeight}, ${parcel.lng - halfWidth} ${parcel.lat - halfHeight}))`;

      await prisma.$executeRawUnsafe(
        `INSERT INTO "CadastralParcel" (
          id, "parcelReference", "surveyNumber", "stateId", "districtId",
          "areaSqMeters", "landCategory", geometry, "createdAt", "updatedAt"
        ) VALUES (
          gen_random_uuid(), $1, $2, $3, $4, $5, $6,
          ST_GeomFromText($7, 4326), NOW(), NOW()
        )`,
        parcel.parcelReference,
        parcel.surveyNumber,
        upState.id,
        varanasiDistrict.id,
        parcel.areaSqMeters,
        parcel.landCategory,
        wkt,
      );

      varanasiCount++;
      logger.info(`✅ Created parcel: ${parcel.parcelReference} (${parcel.owner})`);
    } catch (error) {
      logger.error(`Failed to create parcel ${parcel.parcelReference}:`, error as Record<string, unknown>);
    }
  }

  logger.info(`✅ Ghaziabad parcels seeding completed: ${ghaziabadCount} parcels created`);
  logger.info(`✅ Varanasi parcels seeding completed: ${varanasiCount} parcels created`);
}

main()
  .catch((error) => {
    logger.error('❌ Seeding failed:', error as Record<string, unknown>);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
