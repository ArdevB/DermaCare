import express from "express";
import * as cartController from "../controllers/cartController.js";
import { protect } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import { addToCartSchema, updateCartItemSchema } from "../validators/cartValidators.js";

const router = express.Router();

router.use(protect);

router.get("/", cartController.getCart);
router.post("/items", validate(addToCartSchema), cartController.addItem);
router.put("/items/:productId", validate(updateCartItemSchema), cartController.updateItem);
router.delete("/items/:productId", cartController.removeItem);
router.delete("/", cartController.clearCart);

export default router;
