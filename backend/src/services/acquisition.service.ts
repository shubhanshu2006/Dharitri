import { prisma } from "../database/client.js";
import {
  CreateAcquisitionParcelDto,
  UpdateAcquisitionParcelDto,
} from "../types/acquisition.js";
import { BadRequestError, NotFoundError } from "../utils/errors.js";
import { logger } from "../utils/logger.js";
import { AcquisitionStatus } from "../../generated/prisma/enums.js";

export class AcquisitionService {
  async createAcquisitionParcel(
    data: CreateAcquisitionParcelDto,
    createdById: string,
  ) {
    const project = await prisma.project.findUnique({
      where: { id: data.projectId },
    });

    if (!project) {
      throw new NotFoundError("Project not found");
    }

    const cadastralParcel = await prisma.cadastralParcel.findUnique({
      where: { id: data.cadastralParcelId },
    });

    if (!cadastralParcel) {
      throw new NotFoundError("Cadastral parcel not found");
    }

    logger.info("Creating acquisition parcel", {
      projectId: data.projectId,
      cadastralParcelId: data.cadastralParcelId,
      createdById,
    });

    const acquisitionParcel = await prisma.acquisitionParcel.create({
      data: {
        project: { connect: { id: data.projectId } },
        cadastralParcel: { connect: { id: data.cadastralParcelId } },
        acquisitionReference: data.acquisitionReference,
        requiredAreaSqMeters: data.requiredAreaSqMeters,
        landCategory: data.landCategory,
        status: AcquisitionStatus.DRAFT,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            projectCode: true,
          },
        },
        cadastralParcel: {
          select: {
            id: true,
            parcelReference: true,
            ulpin: true,
            surveyNumber: true,
          },
        },
      },
    });

    logger.info("Acquisition parcel created", {
      acquisitionParcelId: acquisitionParcel.id,
    });
    return acquisitionParcel;
  }

  async getAcquisitionParcel(id: string) {
    const acquisitionParcel = await prisma.acquisitionParcel.findUnique({
      where: { id },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            projectCode: true,
            projectType: true,
            status: true,
          },
        },
        cadastralParcel: {
          include: {
            state: true,
            district: true,
            tehsil: true,
            village: true,
          },
        },
        currentAssignee: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
        acquisitionCase: true,
      },
    });

    if (!acquisitionParcel) {
      throw new NotFoundError("Acquisition parcel not found");
    }

    return acquisitionParcel;
  }

  async getAcquisitionsByProject(projectId: string) {
    return prisma.acquisitionParcel.findMany({
      where: { projectId },
      include: {
        cadastralParcel: {
          select: {
            id: true,
            parcelReference: true,
            ulpin: true,
            surveyNumber: true,
            areaSqMeters: true,
          },
        },
        currentAssignee: {
          select: {
            id: true,
            email: true,
            firstName: true,
            lastName: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });
  }

  async updateAcquisitionParcel(
    id: string,
    data: UpdateAcquisitionParcelDto,
    userId: string,
  ) {
    const acquisitionParcel = await prisma.acquisitionParcel.findUnique({
      where: { id },
    });

    if (!acquisitionParcel) {
      throw new NotFoundError("Acquisition parcel not found");
    }

    if (acquisitionParcel.status !== AcquisitionStatus.DRAFT) {
      throw new BadRequestError(
        "Cannot update acquisition parcel after submission",
      );
    }

    logger.info("Updating acquisition parcel", {
      acquisitionParcelId: id,
      userId,
    });

    const updated = await prisma.acquisitionParcel.update({
      where: { id },
      data: {
        requiredAreaSqMeters: data.requiredAreaSqMeters,
        landCategory: data.landCategory,
      },
      include: {
        project: {
          select: {
            id: true,
            name: true,
            projectCode: true,
          },
        },
        cadastralParcel: {
          select: {
            id: true,
            parcelReference: true,
            ulpin: true,
            surveyNumber: true,
          },
        },
      },
    });

    logger.info("Acquisition parcel updated", { acquisitionParcelId: id });
    return updated;
  }

  async deleteAcquisitionParcel(id: string, userId: string) {
    const acquisitionParcel = await prisma.acquisitionParcel.findUnique({
      where: { id },
    });

    if (!acquisitionParcel) {
      throw new NotFoundError("Acquisition parcel not found");
    }

    if (acquisitionParcel.status !== AcquisitionStatus.DRAFT) {
      throw new BadRequestError(
        "Cannot delete acquisition parcel after submission",
      );
    }

    logger.info("Deleting acquisition parcel", {
      acquisitionParcelId: id,
      userId,
    });

    await prisma.acquisitionParcel.delete({
      where: { id },
    });

    logger.info("Acquisition parcel deleted", { acquisitionParcelId: id });
  }
}

export default new AcquisitionService();
