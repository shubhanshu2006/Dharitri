import { Router } from "express";
import beneficiaryController from "../controllers/beneficiary.controller.js";
import { requirePermission } from "../middlewares/authorization.middleware.js";
import { Permission } from "../constants/permissions.js";

const router = Router();

router.post(
  "/",
  requirePermission(Permission.BENEFICIARY_CREATE),
  beneficiaryController.createBeneficiary.bind(beneficiaryController),
);

router.get(
  "/",
  requirePermission(Permission.BENEFICIARY_VIEW),
  beneficiaryController.listBeneficiaries.bind(beneficiaryController),
);

router.get(
  "/:id",
  requirePermission(Permission.BENEFICIARY_VIEW),
  beneficiaryController.getBeneficiary.bind(beneficiaryController),
);

router.patch(
  "/:id",
  requirePermission(Permission.BENEFICIARY_UPDATE),
  beneficiaryController.updateBeneficiary.bind(beneficiaryController),
);

router.post(
  "/:id/verify",
  requirePermission(Permission.BENEFICIARY_VERIFY),
  beneficiaryController.verifyBeneficiary.bind(beneficiaryController),
);

router.get(
  "/:id/verification",
  requirePermission(Permission.BENEFICIARY_VIEW),
  beneficiaryController.getVerificationStatus.bind(beneficiaryController),
);

export default router;
