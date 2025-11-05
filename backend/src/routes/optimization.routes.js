import express from "express";
import { optimizeDeliveryRoute } from "../controllers/optimization.controller.js";

const router = express.Router();
router.post("/", optimizeDeliveryRoute);
export default router;
