import express from "express";
import * as paymentController from "../controllers/paymentController.js";
import { protect, authorizeRoles } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import upload from "../middleware/upload.js";
import { submitBankTransferSchema, verifyBankTransferSchema } from "../validators/paymentValidators.js";

const router = express.Router();

// Public: Khalti redirects the customer's browser here, unauthenticated.
router.get("/khalti/callback", paymentController.khaltiCallback);

router.use(protect);

router.post("/:orderId/khalti/initiate", paymentController.initiateKhalti);
router.get("/khalti/:pidx/status", paymentController.checkKhaltiStatus);

router.post(
  "/:orderId/bank-transfer",
  upload.single("receipt"),
  validate(submitBankTransferSchema),
  paymentController.submitBankTransfer
);

router.put(
  "/:orderId/bank-transfer/verify",
  authorizeRoles("admin"),
  validate(verifyBankTransferSchema),
  paymentController.verifyBankTransfer
);

export default router;
