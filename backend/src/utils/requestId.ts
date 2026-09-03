import { randomBytes } from 'crypto';

export function generateRequestId(): string {
  const timestamp = Date.now().toString(36);
  const randomPart = randomBytes(8).toString('hex');
  return `${timestamp}-${randomPart}`;
}

export function extractRequestId(headers: Record<string, string | string[] | undefined>): string | undefined {
  const headerValue = headers['x-request-id'] || headers['x-correlation-id'];
  
  if (typeof headerValue === 'string') {
    return headerValue;
  }
  
  if (Array.isArray(headerValue) && headerValue.length > 0) {
    return headerValue[0];
  }
  
  return undefined;
}
