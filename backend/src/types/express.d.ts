import "@clerk/express";

declare global {
  namespace Express {
    interface Request {
      requestId: string;
    }
  }
}
