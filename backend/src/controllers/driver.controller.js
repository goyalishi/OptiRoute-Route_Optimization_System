import Driver from "../models/driver.model.js";
import { Admin } from "../models/admin.model.js";
import Vehicle from "../models/vehicle.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import sendMail from "../services/Mail.service.js";

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
