import { Router } from "express";
import paymentController from "../controllers/payment.controller.js";
import { requirePermission } from "../middlewares/authorization.middleware.js";
import { Permission } from "../constants/permissions.js";

const router = Router();

router.post(
  "/",
  requirePermission(Permission.PAYMENT_INITIATE),
  paymentController.initiatePayment.bind(paymentController),
);

router.get(
  "/",
  requirePermission(Permission.PAYMENT_VIEW),
  paymentController.listPayments.bind(paymentController),
);

router.get(
  "/:id",
  requirePermission(Permission.PAYMENT_VIEW),
  paymentController.getPayment.bind(paymentController),
);

router.post(
  "/:id/sync",
  requirePermission(Permission.PAYMENT_SYNC),
  paymentController.syncPaymentStatus.bind(paymentController),
);

router.post(
  "/webhook",
  paymentController.processWebhook.bind(paymentController),
);

export default router;
