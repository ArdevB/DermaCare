import express from "express";
import authController from "../controllers/authController.js";
import auth from "../middleware/auth.js";
import { validate } from "../middleware/validate.js";
import { registerSchema } from "../utils/validators/authValidator.js";

const router = express.Router();

router.post("/register", validate(registerSchema), authController.register);

router.post("/login", authController.login);

router.post("/refresh", authController.refresh);

router.post("/logout", auth, authController.logout);

router.post("/forgot-password", authController.forgotPassword);

router.post("/reset-password", authController.resetPassword);

export default router;
