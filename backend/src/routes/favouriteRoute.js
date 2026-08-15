import express from "express";
import * as favouriteController from "../controllers/favouriteController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect);

router.get("/", favouriteController.getFavourites);
router.post("/:productId", favouriteController.addFavourite);
router.delete("/:productId", favouriteController.removeFavourite);

export default router;
