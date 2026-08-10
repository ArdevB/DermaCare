import express from "express";
import productController from "../controllers/productController.js";
import auth from "../middleware/auth.js";
import roleBasedAuth from "../middleware/roleBasedAuth.js";
import { MERCHANT } from "../utils/roles.js";

const router = express.Router();

router.get("/", productController.getProducts);

router.get("/:id", productController.getProductById);

router.post(
  "/",
  auth,
  roleBasedAuth(MERCHANT),
  productController.createProduct,
);

router.put(
  "/:id",
  auth,
  roleBasedAuth(MERCHANT),
  productController.updateProduct,
);

router.delete(
  "/:id",
  auth,
  roleBasedAuth(MERCHANT),
  productController.deleteProduct,
);

export default router;
