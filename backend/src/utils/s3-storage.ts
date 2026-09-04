import {
  S3Client,
  PutObjectCommand,
  GetObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import crypto from "crypto";
import path from "path";

const s3Client = new S3Client({
  region: process.env.AWS_REGION || "us-east-1",
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || "",
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || "",
  },
});

const BUCKET_NAME = process.env.AWS_S3_BUCKET_NAME || "dharitri-documents";

export async function uploadToS3(
  buffer: Buffer,
  originalFilename: string,
  mimeType: string,
): Promise<{ objectKey: string; checksum: string; sizeBytes: number }> {
  const checksum = crypto.createHash("sha256").update(buffer).digest("hex");
  const ext = path.extname(originalFilename);
  const objectKey = `documents/${new Date().getFullYear()}/${crypto.randomUUID()}${ext}`;

  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: objectKey,
    Body: buffer,
    ContentType: mimeType,
    Metadata: {
      originalFilename,
      checksum,
    },
  });

  await s3Client.send(command);

  return {
    objectKey,
    checksum,
    sizeBytes: buffer.length,
  };
}

export async function getSignedDownloadUrl(
  objectKey: string,
  expiresIn: number = 3600,
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: BUCKET_NAME,
    Key: objectKey,
  });

  return await getSignedUrl(s3Client, command, { expiresIn });
}

export async function deleteFromS3(objectKey: string): Promise<void> {
  const command = new DeleteObjectCommand({
    Bucket: BUCKET_NAME,
    Key: objectKey,
  });

  await s3Client.send(command);
}
