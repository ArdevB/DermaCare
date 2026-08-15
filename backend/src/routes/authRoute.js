import express from "express";
import * as authController from "../controllers/authController.js";
import { protect } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import { registerSchema, loginSchema } from "../validators/authValidators.js";

const router = express.Router();

router.post("/register", validate(registerSchema), authController.register);
router.post("/login", validate(loginSchema), authController.login);
router.get("/me", protect, authController.getMe);
router.post("/logout", protect, authController.logout);

export default router;
