import express from "express";
import userController from "../controllers/userController.js";
import roleBasedAuth from "../middlewares/roleBasedAuth.js";
import { ADMIN } from "../utils/roles.js";

const router = express.Router();

router.get("/", roleBasedAuth(ADMIN), userController.getUser);

router.get("/:id", roleBasedAuth(ADMIN), userController.getUserById);

router.post("/", roleBasedAuth(ADMIN), userController.createUser);

router.put("/:id", userController.updateUser);

router.delete("/:id", roleBasedAuth(ADMIN), userController.deleteUser);

router.patch("/:id/profile-image", userController.updateProfileImage);

router.post("/merchant", roleBasedAuth(ADMIN), userController.createMerchant);

export default router;
