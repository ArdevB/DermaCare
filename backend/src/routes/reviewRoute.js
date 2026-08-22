import express from "express";
import * as reviewController from "../controllers/reviewController.js";
import { protect } from "../middleware/auth.js";
import validate from "../middleware/validate.js";
import { upsertReviewSchema } from "../validators/reviewValidators.js";

const router = express.Router();

router.get("/:productId", reviewController.listReviews);

router.use(protect);

router.get("/:productId/mine", reviewController.getMyReview);
router.post(
  "/:productId",
  validate(upsertReviewSchema),
  reviewController.upsertReview,
);
router.delete("/:productId", reviewController.deleteReview);

export default router;
