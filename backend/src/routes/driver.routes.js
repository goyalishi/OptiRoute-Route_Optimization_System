import express from "express";
import { driverSignup, driverLogin } from "../controllers/driver.controller.js";

const router = express.Router();

router.post("/signup", driverSignup);
router.post("/login", driverLogin);

export default router;
