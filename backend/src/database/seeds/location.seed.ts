import { prisma } from "../client.js";
import { logger } from "../../utils/logger.js";

export async function seedLocations() {
  logger.info("Seeding locations...");

  const states = [
    // North India
    { id: "01000000-0000-0000-0000-000000000000", name: "Delhi", code: "DL" },
    { id: "02000000-0000-0000-0000-000000000000", name: "Haryana", code: "HR" },
    { id: "03000000-0000-0000-0000-000000000000", name: "Himachal Pradesh", code: "HP" },
    { id: "04000000-0000-0000-0000-000000000000", name: "Jammu and Kashmir", code: "JK" },
    { id: "05000000-0000-0000-0000-000000000000", name: "Punjab", code: "PB" },
    { id: "06000000-0000-0000-0000-000000000000", name: "Rajasthan", code: "RJ" },
    { id: "07000000-0000-0000-0000-000000000000", name: "Uttar Pradesh", code: "UP" },
    { id: "08000000-0000-0000-0000-000000000000", name: "Uttarakhand", code: "UK" },
    
    // East India
    { id: "09000000-0000-0000-0000-000000000000", name: "Bihar", code: "BR" },
    { id: "10000000-0000-0000-0000-000000000000", name: "Jharkhand", code: "JH" },
    { id: "11000000-0000-0000-0000-000000000000", name: "Odisha", code: "OR" },
    { id: "12000000-0000-0000-0000-000000000000", name: "West Bengal", code: "WB" },
    
    // Northeast India
    { id: "13000000-0000-0000-0000-000000000000", name: "Arunachal Pradesh", code: "AR" },
    { id: "14000000-0000-0000-0000-000000000000", name: "Assam", code: "AS" },
    { id: "15000000-0000-0000-0000-000000000000", name: "Manipur", code: "MN" },
    { id: "16000000-0000-0000-0000-000000000000", name: "Meghalaya", code: "ML" },
    { id: "17000000-0000-0000-0000-000000000000", name: "Mizoram", code: "MZ" },
    { id: "18000000-0000-0000-0000-000000000000", name: "Nagaland", code: "NL" },
    { id: "19000000-0000-0000-0000-000000000000", name: "Sikkim", code: "SK" },
    { id: "20000000-0000-0000-0000-000000000000", name: "Tripura", code: "TR" },
    
    // West India
    { id: "21000000-0000-0000-0000-000000000000", name: "Goa", code: "GA" },
    { id: "22000000-0000-0000-0000-000000000000", name: "Gujarat", code: "GJ" },
    { id: "23000000-0000-0000-0000-000000000000", name: "Maharashtra", code: "MH" },
    
    // South India
    { id: "24000000-0000-0000-0000-000000000000", name: "Andhra Pradesh", code: "AP" },
    { id: "25000000-0000-0000-0000-000000000000", name: "Karnataka", code: "KA" },
    { id: "26000000-0000-0000-0000-000000000000", name: "Kerala", code: "KL" },
    { id: "27000000-0000-0000-0000-000000000000", name: "Tamil Nadu", code: "TN" },
    { id: "28000000-0000-0000-0000-000000000000", name: "Telangana", code: "TS" },
    
    // Central India
    { id: "29000000-0000-0000-0000-000000000000", name: "Chhattisgarh", code: "CG" },
    { id: "30000000-0000-0000-0000-000000000000", name: "Madhya Pradesh", code: "MP" },
    
    // Union Territories
    { id: "31000000-0000-0000-0000-000000000000", name: "Chandigarh", code: "CH" },
    { id: "32000000-0000-0000-0000-000000000000", name: "Ladakh", code: "LA" },
    { id: "33000000-0000-0000-0000-000000000000", name: "Puducherry", code: "PY" },
  ];

  for (const state of states) {
    try {
      await prisma.state.create({
        data: state,
      });
    } catch (error) {
      // Skip if already exists
      logger.info(`State ${state.name} already exists, skipping`);
    }
  }

  logger.info(`Seeded states`);

  const districts = [
    // Maharashtra districts
    { id: "01010000-0000-0000-0000-000000000000", name: "Mumbai", code: "MUM", stateId: "23000000-0000-0000-0000-000000000000" },
    { id: "01020000-0000-0000-0000-000000000000", name: "Pune", code: "PUN", stateId: "23000000-0000-0000-0000-000000000000" },
    { id: "01030000-0000-0000-0000-000000000000", name: "Nagpur", code: "NAG", stateId: "23000000-0000-0000-0000-000000000000" },
    { id: "01040000-0000-0000-0000-000000000000", name: "Thane", code: "THA", stateId: "23000000-0000-0000-0000-000000000000" },
    
    // Karnataka districts
    { id: "02010000-0000-0000-0000-000000000000", name: "Bangalore Urban", code: "BLR", stateId: "25000000-0000-0000-0000-000000000000" },
    { id: "02020000-0000-0000-0000-000000000000", name: "Mysuru", code: "MYS", stateId: "25000000-0000-0000-0000-000000000000" },
    { id: "02030000-0000-0000-0000-000000000000", name: "Mangaluru", code: "MNG", stateId: "25000000-0000-0000-0000-000000000000" },
    
    // Gujarat districts
    { id: "03010000-0000-0000-0000-000000000000", name: "Ahmedabad", code: "AMD", stateId: "22000000-0000-0000-0000-000000000000" },
    { id: "03020000-0000-0000-0000-000000000000", name: "Surat", code: "SUR", stateId: "22000000-0000-0000-0000-000000000000" },
    { id: "03030000-0000-0000-0000-000000000000", name: "Vadodara", code: "VAD", stateId: "22000000-0000-0000-0000-000000000000" },
    
    // Uttar Pradesh districts
    { id: "04010000-0000-0000-0000-000000000000", name: "Lucknow", code: "LKO", stateId: "07000000-0000-0000-0000-000000000000" },
    { id: "04020000-0000-0000-0000-000000000000", name: "Kanpur", code: "KAN", stateId: "07000000-0000-0000-0000-000000000000" },
    { id: "04030000-0000-0000-0000-000000000000", name: "Agra", code: "AGR", stateId: "07000000-0000-0000-0000-000000000000" },
    { id: "04040000-0000-0000-0000-000000000000", name: "Varanasi", code: "VNS", stateId: "07000000-0000-0000-0000-000000000000" },
    { id: "04050000-0000-0000-0000-000000000000", name: "Noida", code: "NOI", stateId: "07000000-0000-0000-0000-000000000000" },
    
    // Delhi districts
    { id: "05010000-0000-0000-0000-000000000000", name: "New Delhi", code: "NDL", stateId: "01000000-0000-0000-0000-000000000000" },
    { id: "05020000-0000-0000-0000-000000000000", name: "South Delhi", code: "SDL", stateId: "01000000-0000-0000-0000-000000000000" },
    { id: "05030000-0000-0000-0000-000000000000", name: "North Delhi", code: "NDL", stateId: "01000000-0000-0000-0000-000000000000" },
    
    // Tamil Nadu districts
    { id: "06010000-0000-0000-0000-000000000000", name: "Chennai", code: "CHN", stateId: "27000000-0000-0000-0000-000000000000" },
    { id: "06020000-0000-0000-0000-000000000000", name: "Coimbatore", code: "COI", stateId: "27000000-0000-0000-0000-000000000000" },
    { id: "06030000-0000-0000-0000-000000000000", name: "Madurai", code: "MDU", stateId: "27000000-0000-0000-0000-000000000000" },
    
    // West Bengal districts
    { id: "07010000-0000-0000-0000-000000000000", name: "Kolkata", code: "KOL", stateId: "12000000-0000-0000-0000-000000000000" },
    { id: "07020000-0000-0000-0000-000000000000", name: "Howrah", code: "HOW", stateId: "12000000-0000-0000-0000-000000000000" },
    
    // Telangana districts
    { id: "08010000-0000-0000-0000-000000000000", name: "Hyderabad", code: "HYD", stateId: "28000000-0000-0000-0000-000000000000" },
    
    // Rajasthan districts
    { id: "09010000-0000-0000-0000-000000000000", name: "Jaipur", code: "JAI", stateId: "06000000-0000-0000-0000-000000000000" },
    { id: "09020000-0000-0000-0000-000000000000", name: "Jodhpur", code: "JOD", stateId: "06000000-0000-0000-0000-000000000000" },
    { id: "09030000-0000-0000-0000-000000000000", name: "Udaipur", code: "UDA", stateId: "06000000-0000-0000-0000-000000000000" },
  ];

  for (const district of districts) {
    try {
      await prisma.district.create({
        data: district,
      });
    } catch (error) {
      // Skip if already exists
      logger.info(`District ${district.name} already exists, skipping`);
    }
  }

  logger.info(`Seeded districts`);
  logger.info("Location seed completed successfully");
}
