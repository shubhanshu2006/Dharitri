import { Router } from "express";
import locationController from "../controllers/location.controller.js";

const router = Router();

// Public endpoints - no auth required for location data
router.get("/states", locationController.getStates);
router.get("/districts", locationController.getDistricts);

export default router;
