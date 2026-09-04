import { Prisma } from "../../generated/prisma/client.js";
import { prisma } from "../database/client.js";

export class CadastralRepository {
  async createParcel(data: Prisma.CadastralParcelCreateInput) {
    return prisma.cadastralParcel.create({
      data,
      include: {
        state: true,
        district: true,
        tehsil: true,
        village: true,
      },
    });
  }

  async findById(id: string) {
    return prisma.cadastralParcel.findUnique({
      where: { id },
      include: {
        state: true,
        district: true,
        tehsil: true,
        village: true,
        landRecords: {
          orderBy: { retrievedAt: "desc" },
          take: 1,
        },
        geometrySources: {
          where: { isCurrent: true },
          take: 1,
        },
      },
    });
  }

  async findByReference(parcelReference: string) {
    return prisma.cadastralParcel.findUnique({
      where: { parcelReference },
    });
  }

  async findByULPIN(ulpin: string) {
    return prisma.cadastralParcel.findFirst({
      where: { ulpin },
    });
  }

  async findMany(params: {
    stateId?: string;
    districtId?: string;
    tehsilId?: string;
    villageId?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const {
      stateId,
      districtId,
      tehsilId,
      villageId,
      search,
      page = 1,
      limit = 20,
    } = params;
    const skip = (page - 1) * limit;

    const where: Prisma.CadastralParcelWhereInput = {};

    if (stateId) {
      where.stateId = stateId;
    }

    if (districtId) {
      where.districtId = districtId;
    }

    if (tehsilId) {
      where.tehsilId = tehsilId;
    }

    if (villageId) {
      where.villageId = villageId;
    }

    if (search) {
      where.OR = [
        { parcelReference: { contains: search, mode: "insensitive" } },
        { ulpin: { contains: search, mode: "insensitive" } },
        { surveyNumber: { contains: search, mode: "insensitive" } },
      ];
    }

    const [parcels, total] = await Promise.all([
      prisma.cadastralParcel.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
        include: {
          state: true,
          district: true,
          tehsil: true,
          village: true,
        },
      }),
      prisma.cadastralParcel.count({ where }),
    ]);

    return {
      parcels,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }
}

export default new CadastralRepository();
