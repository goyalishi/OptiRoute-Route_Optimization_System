import Driver from "../models/driver.model.js";
import { Admin } from "../models/admin.model.js";
import Vehicle from "../models/vehicle.model.js";
import Route from "../models/route.model.js";
import DeliveryPoint from "../models/deliveryPoint.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import sendMail from "../services/Mail.service.js";
import { generateGoogleMapsLink } from "../utils/googleMapsHelper.js";

// ---------- SIGNUP ----------
export const driverSignup = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      adminEmail,
      vehicleNumber,
      vehicleType,
      capacity,
      model,
    } = req.body;

    // Validate required fields
    if (
      !name ||
      !email ||
      !password ||
      !phone ||
      !adminEmail ||
      !vehicleNumber ||
      !vehicleType ||
      !capacity
    ) {
      return res.status(400).json({
        message:
          "Name, email, password, phone, admin email, vehicle number, vehicle type, and capacity are required",
      });
    }

    // Check if driver email exists
    const existingDriver = await Driver.findOne({ email });
    if (existingDriver)
      return res.status(400).json({ message: "Driver email already exists" });

    // Check if admin exists using adminEmail
    const admin = await Admin.findOne({ email: adminEmail });
    if (!admin) {
      return res
        .status(404)
        .json({ message: "Invalid admin email. No such admin exists." });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new vehicle first
    const newVehicle = new Vehicle({
      vehicleNumber,
      type: vehicleType,
      capacity: Number(capacity),
      model: model || "",
      status: "free",
    });

    await newVehicle.save();

    // Create new driver with vehicle reference
    const newDriver = new Driver({
      name,
      email,
      password: hashedPassword,
      phone,
      vehicleId: newVehicle._id,
      verified: false,
    });

    await newDriver.save();

    // Update vehicle's assignedTo field
    newVehicle.assignedTo = newDriver._id;
    await newVehicle.save();

    // Add driver reference to admin
    admin.driverIds.push(newDriver._id);
    await admin.save();

    // Send notification email to admin
    await sendMail(
      admin.email,
      "New Driver Verification Request",
      `
      <h3>Hello ${admin.username},</h3>
      <p>A new driver has registered and is waiting for your verification:</p>

      <ul>
        <li><strong>Name:</strong> ${name}</li>
        <li><strong>Email:</strong> ${email}</li>
        <li><strong>Phone:</strong> ${phone || "Not Provided"}</li>
        <li><strong>Vehicle Number:</strong> ${vehicleNumber}</li>
        <li><strong>Vehicle Type:</strong> ${vehicleType}</li>
        <li><strong>Capacity:</strong> ${capacity} kg</li>
        <li><strong>Model:</strong> ${model || "Not Specified"}</li>
      </ul>

      <p>Please visit your admin dashboard to review and verify the driver.</p>

      <br/>
      <p>Regards,<br/>Route Optimizer System</p>
    `
    );

    // Emit socket event to notify admin
    const io = req.app.get("io");
    if (io) {
      io.emit("driver_registered", {
        message: "New driver registered",
        driver: {
          id: newDriver._id,
          name: newDriver.name,
          email: newDriver.email,
        },
      });
    }

    res.status(201).json({
      message:
        "Driver registered successfully. Waiting for admin verification.",
      user: {
        id: newDriver._id,
        username: newDriver.name,
        email: newDriver.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

// ---------- LOGIN ----------
export const driverLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });

    const driver = await Driver.findOne({ email });
    if (!driver) return res.status(404).json({ message: "Driver not found" });

    if (!driver.verified) {
      const admin = await Admin.findOne({ driverIds: driver._id });

      await sendMail(
        admin.email,
        "⏳ Reminder: Driver Verification Pending",
        `
  <div style="font-family: Arial, sans-serif; background:#f6f9fc; padding:20px;">
    <div style="max-width:600px; margin:auto; background:#ffffff; padding:25px; 
                border-radius:8px; box-shadow:0 2px 8px rgba(0,0,0,0.1);">

      <h2 style="color:#333; margin-top:0;">⏳ Driver Verification Reminder</h2>

      <p style="font-size:15px; color:#555;">
        Hello <strong>${admin.username}</strong>,
      </p>

      <p style="font-size:15px; color:#555;">
        This is a friendly reminder that the following driver is still awaiting your approval 
        in the <strong>Route Optimizer System</strong>.
      </p>

      <div style="background:#fff8e5; padding:15px; border-radius:6px; margin-top:15px; 
                  border-left:4px solid #ffb300;">
        <h3 style="margin:0 0 10px; color:#d68a00;">Pending Driver Details</h3>
        <p style="margin:4px 0;"><strong>Name:</strong> ${driver.name}</p>
        <p style="margin:4px 0;"><strong>Email:</strong> ${driver.email}</p>
        <p style="margin:4px 0;"><strong>Phone:</strong> ${driver.phone || "Not Provided"}</p>
      </div>

      <p style="font-size:15px; color:#555; margin-top:20px;">
        Please log in to your admin dashboard to verify the driver and allow access.
      </p>

      <p style="font-size:14px; color:#999; margin-top:25px;">
        Regards,<br/>
        <strong>Route Optimizer System</strong>
      </p>

    </div>
  </div>
  `
      );

      return res.status(403).json({
        message:
          "Your account is not yet verified. A reminder has been sent to the admin.",
      });
    }

    const isMatch = await bcrypt.compare(password, driver.password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid credentials" });

    const accessToken = jwt.sign(
      { id: driver._id, email: driver.email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
    );

    res.status(200).json({
      message: "Login successful",
      role: "driver",
      accessToken,
      user: {
        id: driver._id,
        username: driver.name,
        email: driver.email,
        status: driver.status,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

export const getDriverRoutes = async(req, res) =>{
  try {
    const { driverId } = req.params;
    const routes = await Route.find({ driverId })
      .populate({
        path: "deliveryPoints",
        select: "address status customerDetails lat lng weight failureReason deliveredAt"
      })
      .sort({ createdAt: -1 });
    
    if (!routes || routes.length === 0) {
      return res.status(200).json({
        message: "No routes found for this driver",
        routes: []
      });
    }

    const routesWithMaps = routes.map(route => {
      const routeObj = route.toObject();
      
      if (routeObj.optimizedSeq && routeObj.optimizedSeq.length > 0) {
        routeObj.googleMapsLink = generateGoogleMapsLink(routeObj.optimizedSeq, routeObj.travelMode);
      }
      
      return routeObj;
    });
    
    return res.status(200).json({
      message: "Routes found successfully!",
      routes: routesWithMaps
    });
  } catch (error) {
      return res.status(500).json({ 
        message: "Error fetching driver routes", 
        error: error.message 
      });
  }
  
}

// 📍 NEW: Get Driver Dashboard with Grouped Routes
export const getDriverDashboard = async (req, res) => {
  try {
    const { driverId } = req.params;

    // Fetch all routes for this driver
    const routes = await Route.find({ driverId })
      .populate({
        path: "deliveryPoints",
        select: "status"
      })
      .sort({ createdAt: -1 });

    if (!routes || routes.length === 0) {
      return res.status(200).json({
        message: "No routes found for this driver",
        assignedRoutes: [],
        inProgressRoutes: [],
        completedRoutes: [],
        summary: { assigned: 0, inProgress: 0, completed: 0, totalDeliveries: 0 }
      });
    }

    // Add Google Maps link to each route
    const routesWithMaps = routes.map(route => {
      const routeObj = route.toObject();
      
      // Generate Google Maps link if optimizedSeq exists
      if (routeObj.optimizedSeq && routeObj.optimizedSeq.length > 0) {
        routeObj.googleMapsLink = generateGoogleMapsLink(routeObj.optimizedSeq, routeObj.travelMode);
      }
      
      return routeObj;
    });

    // Group routes by status
    const assignedRoutes = routesWithMaps.filter(r => r.status === "assigned");
    const inProgressRoutes = routesWithMaps.filter(r => r.status === "in-progress");
    const completedRoutes = routesWithMaps.filter(r => r.status === "completed");

    // Calculate summary stats
    const totalDeliveries = routesWithMaps.reduce((sum, route) => 
      sum + (route.deliveryPoints?.length || 0), 0
    );

    return res.status(200).json({
      message: "Driver dashboard data fetched successfully",
      assignedRoutes,
      inProgressRoutes,
      completedRoutes,
      summary: {
        assigned: assignedRoutes.length,
        inProgress: inProgressRoutes.length,
        completed: completedRoutes.length,
        totalDeliveries
      }
    });
  } catch (error) {
    console.error("Error fetching driver dashboard:", error);
    return res.status(500).json({
      message: "Error fetching driver dashboard",
      error: error.message
    });
  }
};

// 📍 NEW: Start a Route (mark as in-progress)
export const startRoute = async (req, res) => {
  try {
    const { routeId } = req.params;
    const { driverId } = req.body;

    const route = await Route.findById(routeId);
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    // Verify the route belongs to this driver
    if (route.driverId.toString() !== driverId) {
      return res.status(403).json({ message: "Unauthorized: Route does not belong to this driver" });
    }

    if (route.status !== "assigned") {
      return res.status(400).json({ 
        message: `Cannot start route with status: ${route.status}. Only assigned routes can be started.` 
      });
    }

    // Update route status
    route.status = "in-progress";
    await route.save();

    // Update all delivery points to in-progress
    await DeliveryPoint.updateMany(
      { _id: { $in: route.deliveryPoints }, status: "assigned" },
      { $set: { status: "in-progress" } }
    );

    // Emit socket event (if Socket.IO is set up)
    const io = req.app.get("io");
    if (io) {
      io.emit("route_started", {
        routeId: route._id,
        driverId: route.driverId,
        adminId: route.adminId
      });
    }

    return res.status(200).json({
      message: "Route started successfully",
      route
    });
  } catch (error) {
    console.error("Error starting route:", error);
    return res.status(500).json({
      message: "Error starting route",
      error: error.message
    });
  }
};

// 📍 NEW: Update Delivery Status
export const updateDeliveryStatus = async (req, res) => {
  try {
    const { deliveryId } = req.params;
    const { status, failureReason, driverId } = req.body;

    // Validate status
    const validStatuses = ["in-progress", "delivered", "failed", "cancelled"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ 
        message: `Invalid status. Must be one of: ${validStatuses.join(", ")}` 
      });
    }

    const delivery = await DeliveryPoint.findById(deliveryId);
    if (!delivery) {
      return res.status(404).json({ message: "Delivery not found" });
    }

    // Update delivery status
    delivery.status = status;
    
    if (status === "delivered") {
      delivery.deliveredAt = new Date();
      delivery.failureReason = null;
    } else if (status === "failed" || status === "cancelled") {
      delivery.failureReason = failureReason || "No reason provided";
    }

    await delivery.save();

    // Find the route containing this delivery
    const route = await Route.findOne({ deliveryPoints: deliveryId });
    
    if (route) {
      // Check if all deliveries in the route are completed (delivered/failed/cancelled)
      const allDeliveries = await DeliveryPoint.find({ _id: { $in: route.deliveryPoints } });
      const allCompleted = allDeliveries.every(d => 
        ["delivered", "failed", "cancelled"].includes(d.status)
      );

      // If all deliveries are done, mark route as completed
      if (allCompleted && route.status !== "completed") {
        route.status = "completed";
        await route.save();

        // Update driver status to free if no other active routes
        const driver = await Driver.findById(route.driverId);
        if (driver) {
          const activeRoutes = await Route.find({
            driverId: driver._id,
            status: { $in: ["assigned", "in-progress"] }
          });

          if (activeRoutes.length === 0) {
            driver.status = "free";
            await driver.save();
          }
        }
      }

      // Emit socket event for real-time update
      const io = req.app.get("io");
      if (io) {
        io.emit("delivery_updated", {
          deliveryId: delivery._id,
          routeId: route._id,
          status: delivery.status,
          adminId: route.adminId,
          driverId: route.driverId,
          routeCompleted: allCompleted
        });
      }
    }

    return res.status(200).json({
      message: "Delivery status updated successfully",
      delivery
    });
  } catch (error) {
    console.error("Error updating delivery status:", error);
    return res.status(500).json({
      message: "Error updating delivery status",
      error: error.message
    });
  }
};

// 📍 NEW: Complete a Route Manually
export const completeRoute = async (req, res) => {
  try {
    const { routeId } = req.params;
    const { driverId } = req.body;

    const route = await Route.findById(routeId).populate("deliveryPoints");
    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    // Verify the route belongs to this driver
    if (route.driverId.toString() !== driverId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    // Check if there are pending deliveries
    const pendingDeliveries = route.deliveryPoints.filter(d => 
      !["delivered", "failed", "cancelled"].includes(d.status)
    );

    if (pendingDeliveries.length > 0) {
      return res.status(400).json({
        message: `Cannot complete route. ${pendingDeliveries.length} deliveries are still pending.`,
        pendingDeliveries: pendingDeliveries.map(d => ({
          id: d._id,
          address: d.address,
          status: d.status
        }))
      });
    }

    // Mark route as completed
    route.status = "completed";
    await route.save();

    // Update driver status to free if no other active routes
    const activeRoutes = await Route.find({
      driverId: driverId,
      status: { $in: ["assigned", "in-progress"] }
    });

    if (activeRoutes.length === 0) {
      await Driver.findByIdAndUpdate(driverId, { status: "free" });
    }

    // Emit socket event
    const io = req.app.get("io");
    if (io) {
      io.emit("route_completed", {
        routeId: route._id,
        driverId: route.driverId,
        adminId: route.adminId
      });
    }

    return res.status(200).json({
      message: "Route completed successfully",
      route
    });
  } catch (error) {
    console.error("Error completing route:", error);
    return res.status(500).json({
      message: "Error completing route",
      error: error.message
    });
  }
};
