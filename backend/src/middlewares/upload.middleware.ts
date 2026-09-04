import multer from "multer";

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

const storage = multer.memoryStorage();

const fileFilter = (req: any, file: any, cb: any) => {
  const ext = file.originalname
    .toLowerCase()
    .slice(file.originalname.lastIndexOf("."));

  if (!ALLOWED_MIME_TYPES.includes(file.mimetype)) {
    return cb(new Error(`MIME type ${file.mimetype} not allowed`));
  }

  if (!ALLOWED_EXTENSIONS.includes(ext)) {
    return cb(new Error(`File extension ${ext} not allowed`));
  }

  cb(null, true);
};

export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: MAX_FILE_SIZE,
  },
});
