import { Request, Response, NextFunction } from "express";
import documentService from "../services/document.service.js";
import {
  uploadDocumentSchema,
  documentQuerySchema,
  downloadQuerySchema,
} from "../validators/document.validator.js";
import { successResponse } from "../utils/response.js";

export class DocumentController {
  async uploadDocument(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const validatedData = uploadDocumentSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const document = await documentService.uploadDocument(
        {
          ...validatedData,
          file: {
            buffer: req.file.buffer,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
          },
        },
        userId,
      );

      return successResponse(res, document, "Document uploaded successfully");
    } catch (error) {
      next(error);
    }
  }

  async getDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const documentId = req.params.id as string;
      const document = await documentService.getDocument(documentId);

      if (!document) {
        return res.status(404).json({ error: "Document not found" });
      }

      return successResponse(res, document);
    } catch (error) {
      next(error);
    }
  }

  async listDocuments(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedQuery = documentQuerySchema.parse(req.query);
      const result = await documentService.listDocuments(validatedQuery);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  async getDownloadUrl(req: Request, res: Response, next: NextFunction) {
    try {
      const documentId = req.params.id as string;
      const validatedQuery = downloadQuerySchema.parse(req.query);

      const result = await documentService.getDownloadUrl(
        documentId,
        validatedQuery.expiresIn,
      );

      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  async createVersion(req: Request, res: Response, next: NextFunction) {
    try {
      if (!req.file) {
        return res.status(400).json({ error: "No file uploaded" });
      }

      const documentId = req.params.id as string;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const document = await documentService.createVersion(
        documentId,
        {
          file: {
            buffer: req.file.buffer,
            originalname: req.file.originalname,
            mimetype: req.file.mimetype,
          },
        },
        userId,
      );

      return successResponse(res, document, "New version created");
    } catch (error) {
      next(error);
    }
  }

  async deleteDocument(req: Request, res: Response, next: NextFunction) {
    try {
      const documentId = req.params.id as string;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const result = await documentService.deleteDocument(documentId, userId);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }
}

export default new DocumentController();
