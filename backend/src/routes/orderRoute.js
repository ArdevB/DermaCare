import express from "express";
import * as orderController from "../controllers/orderController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import { createOrderSchema, updateOrderStatusSchema } from "../validators/orderValidators.js";

const router = express.Router();

router.use(protect);

router.post("/", validate(createOrderSchema), orderController.createOrder);
router.get("/my", orderController.getMyOrders);
router.get("/:id", orderController.getOrder);
router.post("/:id/cancel", orderController.cancelOrder);

// Admin
router.get("/", authorizeRoles("admin"), orderController.getAllOrders);
router.put(
  "/:id/status",
  authorizeRoles("admin"),
  validate(updateOrderStatusSchema),
  orderController.updateOrderStatus
);

export default router;
