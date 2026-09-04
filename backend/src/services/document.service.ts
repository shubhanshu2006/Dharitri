import { prisma } from "../database/client.js";
import { logger } from "../utils/logger.js";
import {
  uploadToS3,
  getSignedDownloadUrl,
  deleteFromS3,
} from "../utils/s3-storage.js";

interface CreateDocumentInput {
  entityType: string;
  entityId: string;
  documentType: string;
  title: string;
  accessClass?: string;
  file: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
  };
}

interface CreateVersionInput {
  file: {
    buffer: Buffer;
    originalname: string;
    mimetype: string;
  };
}

class DocumentService {
  async uploadDocument(data: CreateDocumentInput, userId: string) {
    logger.info("Uploading document", {
      entityType: data.entityType,
      entityId: data.entityId,
      documentType: data.documentType,
      userId,
    });

    const { objectKey, checksum, sizeBytes } = await uploadToS3(
      data.file.buffer,
      data.file.originalname,
      data.file.mimetype,
    );

    const document = await prisma.$transaction(async (tx) => {
      const doc = await tx.document.create({
        data: {
          entityType: data.entityType,
          entityId: data.entityId,
          documentType: data.documentType,
          title: data.title,
          accessClass: (data.accessClass as any) || "INTERNAL",
          uploadedById: userId,
          status: "ACTIVE",
        },
      });

      const version = await tx.documentVersion.create({
        data: {
          documentId: doc.id,
          versionNumber: 1,
          objectKey,
          originalFileName: data.file.originalname,
          mimeType: data.file.mimetype,
          sizeBytes: BigInt(sizeBytes),
          checksum,
          uploadedById: userId,
        },
      });

      await tx.document.update({
        where: { id: doc.id },
        data: { currentVersionId: version.id },
      });

      return tx.document.findUnique({
        where: { id: doc.id },
        include: {
          currentVersion: true,
          uploadedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });
    });

    logger.info("Document uploaded successfully", {
      documentId: document?.id,
      entityType: data.entityType,
      entityId: data.entityId,
    });

    return document;
  }

  async getDocument(documentId: string) {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        currentVersion: true,
        versions: {
          orderBy: { versionNumber: "desc" },
          include: {
            uploadedBy: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
        },
        uploadedBy: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return document;
  }

  async listDocuments(filters: {
    entityType?: string;
    entityId?: string;
    documentType?: string;
    status?: string;
    skip?: number;
    take?: number;
  }) {
    const where: any = {};

    if (filters.entityType) {
      where.entityType = filters.entityType;
    }

    if (filters.entityId) {
      where.entityId = filters.entityId;
    }

    if (filters.documentType) {
      where.documentType = filters.documentType;
    }

    if (filters.status) {
      where.status = filters.status;
    }

    const [documents, total] = await Promise.all([
      prisma.document.findMany({
        where,
        skip: filters.skip || 0,
        take: filters.take || 20,
        orderBy: { createdAt: "desc" },
        include: {
          currentVersion: true,
          uploadedBy: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      }),
      prisma.document.count({ where }),
    ]);

    return {
      data: documents,
      total,
      page: Math.floor((filters.skip || 0) / (filters.take || 20)) + 1,
      pageSize: filters.take || 20,
    };
  }

  async getDownloadUrl(documentId: string, expiresIn: number = 3600) {
    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        currentVersion: true,
      },
    });

    if (!document || !document.currentVersion) {
      throw new Error("Document or current version not found");
    }

    const url = await getSignedDownloadUrl(
      document.currentVersion.objectKey,
      expiresIn,
    );

    logger.info("Generated download URL", {
      documentId,
      expiresIn,
    });

    return {
      url,
      expiresIn,
      filename: document.currentVersion.originalFileName,
      mimeType: document.currentVersion.mimeType,
    };
  }

  async createVersion(
    documentId: string,
    data: CreateVersionInput,
    userId: string,
  ) {
    logger.info("Creating new document version", {
      documentId,
      userId,
    });

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        versions: {
          orderBy: { versionNumber: "desc" },
          take: 1,
        },
        currentVersion: true,
      },
    });

    if (!document) {
      throw new Error("Document not found");
    }

    const latestVersionNumber = document.versions[0]?.versionNumber || 0;
    const newVersionNumber = latestVersionNumber + 1;

    const { objectKey, checksum, sizeBytes } = await uploadToS3(
      data.file.buffer,
      data.file.originalname,
      data.file.mimetype,
    );

    const result = await prisma.$transaction(async (tx) => {
      if (document.currentVersion) {
        await tx.document.update({
          where: { id: documentId },
          data: { status: "SUPERSEDED" },
        });
      }

      const newVersion = await tx.documentVersion.create({
        data: {
          documentId,
          versionNumber: newVersionNumber,
          objectKey,
          originalFileName: data.file.originalname,
          mimeType: data.file.mimetype,
          sizeBytes: BigInt(sizeBytes),
          checksum,
          uploadedById: userId,
        },
      });

      await tx.document.update({
        where: { id: documentId },
        data: {
          currentVersionId: newVersion.id,
          status: "ACTIVE",
        },
      });

      return tx.document.findUnique({
        where: { id: documentId },
        include: {
          currentVersion: true,
          versions: {
            orderBy: { versionNumber: "desc" },
            include: {
              uploadedBy: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                },
              },
            },
          },
        },
      });
    });

    logger.info("Document version created", {
      documentId,
      versionNumber: newVersionNumber,
    });

    return result;
  }

  async deleteDocument(documentId: string, userId: string) {
    logger.info("Deleting document", {
      documentId,
      userId,
    });

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        versions: true,
      },
    });

    if (!document) {
      throw new Error("Document not found");
    }

    await prisma.$transaction(async (tx) => {
      await tx.document.update({
        where: { id: documentId },
        data: { status: "ARCHIVED", currentVersionId: null },
      });
    });

    logger.info("Document marked as archived", {
      documentId,
    });

    return { success: true, message: "Document archived" };
  }

  async deleteDocumentPermanently(documentId: string, userId: string) {
    logger.info("Permanently deleting document", {
      documentId,
      userId,
    });

    const document = await prisma.document.findUnique({
      where: { id: documentId },
      include: {
        versions: true,
      },
    });

    if (!document) {
      throw new Error("Document not found");
    }

    for (const version of document.versions) {
      try {
        await deleteFromS3(version.objectKey);
      } catch (error) {
        logger.error("Failed to delete S3 object", {
          objectKey: version.objectKey,
          error,
        });
      }
    }

    await prisma.$transaction(async (tx) => {
      await tx.documentVersion.deleteMany({
        where: { documentId },
      });

      await tx.document.delete({
        where: { id: documentId },
      });
    });

    logger.info("Document permanently deleted", {
      documentId,
    });

    return { success: true, message: "Document permanently deleted" };
  }
}

export default new DocumentService();
