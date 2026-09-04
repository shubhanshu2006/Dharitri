import { Request, Response, NextFunction } from "express";
import { ValidationError } from "../utils/errors.js";

const ALLOWED_MIME_TYPES = [
  "application/pdf",
  "image/jpeg",
  "image/png",
  "image/gif",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "text/csv",
];

const ALLOWED_EXTENSIONS = [
  ".pdf",
  ".jpg",
  ".jpeg",
  ".png",
  ".gif",
  ".doc",
  ".docx",
  ".xls",
  ".xlsx",
  ".txt",
  ".csv",
];

const MAX_FILE_SIZE = 50 * 1024 * 1024;
const MAX_FILENAME_LENGTH = 255;

const DANGEROUS_EXTENSIONS = [
  ".exe",
  ".bat",
  ".cmd",
  ".sh",
  ".ps1",
  ".vbs",
  ".js",
  ".jar",
  ".app",
  ".deb",
  ".rpm",
];

export function validateFileUpload(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.file && !req.files) {
      throw new ValidationError("No file uploaded");
    }

    const files = req.files
      ? Array.isArray(req.files)
        ? req.files
        : Object.values(req.files).flat()
      : [req.file];

    for (const file of files) {
      if (!file) continue;

      if (file.size > MAX_FILE_SIZE) {
        throw new ValidationError(
          `File size ${(file.size / (1024 * 1024)).toFixed(2)}MB exceeds maximum allowed size of ${MAX_FILE_SIZE / (1024 * 1024)}MB`,
        );
      }

      if (file.originalname.length > MAX_FILENAME_LENGTH) {
        throw new ValidationError(
          `Filename length exceeds maximum of ${MAX_FILENAME_LENGTH} characters`,
        );
      }

      const ext = file.originalname
        .toLowerCase()
        .slice(file.originalname.lastIndexOf("."));

      if (DANGEROUS_EXTENSIONS.includes(ext)) {
        throw new ValidationError(
          `File extension ${ext} is not allowed for security reasons`,
        );
      }

      if (!ALLOWED_EXTENSIONS.includes(ext)) {
        throw new ValidationError(
          `File extension ${ext} not allowed. Allowed: ${ALLOWED_EXTENSIONS.join(", ")}`,
        );
      }

      if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
        throw new ValidationError(
          `MIME type ${file.mimetype} not allowed. Allowed: ${ALLOWED_MIME_TYPES.join(", ")}`,
        );
      }

      const filenamePattern = /^[a-zA-Z0-9._\-\s()]+$/;
      const baseFilename = file.originalname.slice(
        0,
        file.originalname.lastIndexOf("."),
      );
      if (!filenamePattern.test(baseFilename)) {
        throw new ValidationError(
          "Filename contains invalid characters. Only alphanumeric, spaces, dots, hyphens, underscores, and parentheses allowed",
        );
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}

export function validateFileSizeLimit(maxSizeBytes: number) {
  return (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file && !req.files) {
        return next();
      }

      const files = req.files
        ? Array.isArray(req.files)
          ? req.files
          : Object.values(req.files).flat()
        : [req.file];

      for (const file of files) {
        if (!file) continue;

        if (file.size > maxSizeBytes) {
          throw new ValidationError(
            `File size ${(file.size / (1024 * 1024)).toFixed(2)}MB exceeds limit of ${(maxSizeBytes / (1024 * 1024)).toFixed(2)}MB`,
          );
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  };
}

export function validateImageOnly(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.file && !req.files) {
      throw new ValidationError("No file uploaded");
    }

    const files = req.files
      ? Array.isArray(req.files)
        ? req.files
        : Object.values(req.files).flat()
      : [req.file];

    const imageMimeTypes = ["image/jpeg", "image/png", "image/gif"];

    for (const file of files) {
      if (!file) continue;

      if (!imageMimeTypes.includes(file.mimetype)) {
        throw new ValidationError(
          `Only image files allowed. Uploaded: ${file.mimetype}`,
        );
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}

export function validateDocumentOnly(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  try {
    if (!req.file && !req.files) {
      throw new ValidationError("No file uploaded");
    }

    const files = req.files
      ? Array.isArray(req.files)
        ? req.files
        : Object.values(req.files).flat()
      : [req.file];

    const docMimeTypes = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/vnd.ms-excel",
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "text/plain",
      "text/csv",
    ];

    for (const file of files) {
      if (!file) continue;

      if (!docMimeTypes.includes(file.mimetype)) {
        throw new ValidationError(
          `Only document files allowed. Uploaded: ${file.mimetype}`,
        );
      }
    }

    next();
  } catch (error) {
    next(error);
  }
}
