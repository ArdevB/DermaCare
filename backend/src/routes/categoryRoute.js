import express from "express";
import * as categoryController from "../controllers/categoryController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import upload from "../middleware/upload.js";
import {
  createCategorySchema,
  updateCategorySchema,
} from "../validators/categoryValidators.js";

const router = express.Router();

router.get("/", categoryController.getCategories);
router.get("/:id", categoryController.getCategory);

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  validate(createCategorySchema),
  categoryController.createCategory,
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  upload.fields([
    { name: "image", maxCount: 1 },
    { name: "banner", maxCount: 1 },
  ]),
  validate(updateCategorySchema),
  categoryController.updateCategory,
);

router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  categoryController.deleteCategory,
);

export default router;
