import express from "express";
import { z } from "zod";
import * as userController from "../controllers/userController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";
import validate from "../middleware/validate.js";

const router = express.Router();

const updateRoleSchema = z.object({ role: z.enum(["user", "admin"]) });

router.use(protect, authorizeRoles("admin"));

router.get("/", userController.getUsers);
router.get("/:id", userController.getUser);
router.put("/:id/role", validate(updateRoleSchema), userController.updateUserRole);
router.delete("/:id", userController.deleteUser);

export default router;
