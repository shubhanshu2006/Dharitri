import { Router } from "express";
import { adminController } from "../controllers/admin.controller.js";
import { requireAuth } from "@clerk/express";

const router = Router();

// All admin routes require authentication
router.use(requireAuth());

// Get all pending users
router.get("/users/pending", adminController.getPendingUsers.bind(adminController));

// Get all users
router.get("/users", adminController.getAllUsers.bind(adminController));

// Approve user
router.post("/users/:userId/approve", adminController.approveUser.bind(adminController));

// Reject user
router.post("/users/:userId/reject", adminController.rejectUser.bind(adminController));

export default router;
