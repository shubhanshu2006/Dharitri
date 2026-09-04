import { Request, Response, NextFunction } from "express";
import paymentService from "../services/payment.service.js";
import {
  initiatePaymentSchema,
  paymentQuerySchema,
  webhookPayloadSchema,
} from "../validators/payment.validator.js";
import { successResponse } from "../utils/response.js";

export class PaymentController {
  async initiatePayment(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedData = initiatePaymentSchema.parse(req.body);
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const payment = await paymentService.initiatePayment(
        validatedData,
        userId,
      );
      return successResponse(
        res,
        payment,
        "Payment initiated successfully",
        201,
      );
    } catch (error) {
      next(error);
    }
  }

  async getPayment(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const payment = await paymentService.getPayment(id);
      return successResponse(res, payment);
    } catch (error) {
      next(error);
    }
  }

  async listPayments(req: Request, res: Response, next: NextFunction) {
    try {
      const validatedQuery = paymentQuerySchema.parse(req.query);
      const result = await paymentService.listPayments(validatedQuery);
      return successResponse(res, result);
    } catch (error) {
      next(error);
    }
  }

  async syncPaymentStatus(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id as string;
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ error: "Unauthorized" });
      }

      const payment = await paymentService.syncPaymentStatus(id, userId);
      return successResponse(res, payment, "Payment status synced");
    } catch (error) {
      next(error);
    }
  }

  async processWebhook(req: Request, res: Response, next: NextFunction) {
    try {
      const signature = req.headers["x-payment-signature"] as string;

      if (!signature) {
        return res.status(401).json({ error: "Missing signature" });
      }

      const validatedPayload = webhookPayloadSchema.parse(req.body);
      const payment = await paymentService.processWebhook(
        validatedPayload,
        signature,
      );

      return successResponse(res, payment, "Webhook processed successfully");
    } catch (error) {
      next(error);
    }
  }
}

export default new PaymentController();
