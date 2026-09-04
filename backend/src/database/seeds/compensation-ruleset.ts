import { prisma } from "../client.js";
import { logger } from "../../utils/logger.js";

export async function seedCompensationRuleSets() {
  logger.info("Seeding compensation rule sets...");

  const defaultRuleSet = await prisma.compensationRuleSet.upsert({
    where: {
      name_version: {
        name: "RFCTLARR 2013 - Standard",
        version: 1,
      },
    },
    update: {},
    create: {
      name: "RFCTLARR 2013 - Standard",
      version: 1,
      effectiveFrom: new Date("2024-01-01"),
      effectiveTo: null,
      configuration: {
        description:
          "Right to Fair Compensation and Transparency in Land Acquisition, Rehabilitation and Resettlement Act, 2013 - Standard Rules",
        solatiumPercentage: 100,
        interestRate: 12,
        calculationMethod: "market_value_plus_solatium",
        components: {
          landValue: {
            description: "Market value of land",
            mandatory: true,
          },
          solatium: {
            description: "100% of market value as solatium",
            mandatory: true,
            calculationFormula: "landValue * 1.0",
          },
          interest: {
            description: "12% interest from notification to payment",
            mandatory: false,
            calculationFormula: "totalAmount * 0.12 * yearsSinceNotification",
          },
          otherComponents: {
            description: "Additional statutory components",
            mandatory: false,
          },
          deductions: {
            description: "Statutory deductions if applicable",
            mandatory: false,
          },
        },
        validationRules: {
          minLandValue: 0,
          maxLandValue: null,
          requiresDocumentation: true,
        },
      },
      isActive: true,
    },
  });

  logger.info("Seeded 1 compensation rule set", {
    id: defaultRuleSet.id,
    name: defaultRuleSet.name,
    version: defaultRuleSet.version,
  });
}
