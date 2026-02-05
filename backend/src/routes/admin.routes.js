import express from "express";
import {
  adminSignup,
  adminLogin,
  assignRoutesToDrivers,
} from "../controllers/admin.controller.js";
import {
  getDriversByAdmin,
  verifyDriver,
} from "../controllers/admin.controller.js";
import { getDriverRoutes } from "../controllers/driver.controller.js";

const router = express.Router();

router.post("/signup", adminSignup);
router.post("/login", adminLogin);
// GET All Drivers for an Admin
router.get("/drivers/:adminId", getDriversByAdmin);
router.get("/driver-routes/:driverId", getDriverRoutes);
// Verify a Driver
router.patch("/verify-driver/:driverId", verifyDriver);
// Assign pending routes to drivers
router.patch("/assign-routes", assignRoutesToDrivers);

export default router;
