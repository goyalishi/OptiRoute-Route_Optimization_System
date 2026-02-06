import express from "express";
import {
  driverSignup,
  driverLogin,
  getDriverDashboard,
  getDriverRoutes,
  startRoute,
  updateDeliveryStatus,
  completeRoute,
} from "../controllers/driver.controller.js";

const router = express.Router();

router.post("/signup", driverSignup);
router.post("/login", driverLogin);

// Driver Dashboard Routes
router.get("/dashboard/:driverId", getDriverDashboard);
router.get("/routes/:driverId", getDriverRoutes);

// Route Management
router.patch("/route/:routeId/start", startRoute);
router.patch("/route/:routeId/complete", completeRoute);

// Delivery Status Updation
router.patch("/delivery/:deliveryId/status", updateDeliveryStatus);

export default router;
