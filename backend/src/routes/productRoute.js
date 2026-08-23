import express from "express";
import * as productController from "../controllers/productController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import upload from "../middleware/upload.js";
import {
  createProductSchema,
  updateProductSchema,
} from "../validators/productValidators.js";

const router = express.Router();

router.get("/", productController.getProducts);
router.get("/brands", productController.getBrands);
router.get("/:id", productController.getProduct);

router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  upload.array("images", 6),
  validate(createProductSchema),
  productController.createProduct,
);

router.put(
  "/:id",
  protect,
  authorizeRoles("admin"),
  upload.array("images", 6),
  validate(updateProductSchema),
  productController.updateProduct,
);

router.delete(
  "/:id/image",
  protect,
  authorizeRoles("admin"),
  productController.deleteProductImage,
);
router.delete(
  "/:id",
  protect,
  authorizeRoles("admin"),
  productController.deleteProduct,
);

export default router;
