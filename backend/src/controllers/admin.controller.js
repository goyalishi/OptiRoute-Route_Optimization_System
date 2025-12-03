import { Admin } from "../models/admin.model.js";
import {  ApiError } from "../utils/apiError.js";
import Driver from "../models/driver.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
import sendMail from "../services/Mail.service.js";

// ---------- SIGNUP ----------
export const adminSignup = async (req, res) => {
  try {
    const { username, email, password } = req.body;
    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }


    const existingAdmin = await Admin.findOne({ email });
    if (existingAdmin) {
      return res.status(400).json({ message: "Email already registered" });
    }


    const newAdmin = new Admin({ username, email, password });
    await newAdmin.save();

    res.status(201).json({
      message: "Admin registered successfully",
      user: {
        id: newAdmin._id,
        username: newAdmin.username,
        email: newAdmin.email,
      },

    });
  } catch (error) {
    res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

// ---------- LOGIN ----------
export const adminLogin = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password)
      return res.status(400).json({ message: "Email and password required" });

    const admin = await Admin.findOne({ email });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    const isMatch = await admin.isPasswordCorrect(password);
    if (!isMatch)
      return res.status(401).json({ message: "Invalid email or password" });

    const accessToken = admin.generateAccessToken();
    const refreshToken = admin.generateRefreshToken();

    admin.refrreshToken = refreshToken;
    await admin.save();

    res.status(200).json({
      message: "Login successful",
      role: "admin", // 🔹 Add this field
      accessToken,
      refreshToken,
      user: {
        id: admin._id,
        username: admin.username,
        email: admin.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// ✅ GET All Drivers under Admin
export const getDriversByAdmin = async (req, res) => {
  try {
    const { adminId } = req.params;

    // Validate admin
    const admin = await Admin.findById(adminId);
    if (!admin) {
      return res.status(404).json({ message: "Admin not found" });
    }

    // fetch drivers linked to admin
    const drivers = await Driver.find({
      _id: { $in: admin.driverIds },
    });

    const verifiedDrivers = drivers.filter((d) => d.verified === true);
    const unverifiedDrivers = drivers.filter((d) => d.verified === false);

    res.status(200).json({
      verifiedDrivers,
      unverifiedDrivers,
    });
  } catch (error) {
    console.error("❌ Error in getDriversByAdmin:", error);
    res.status(500).json({ message: "Server error" });
  }
};

// ✅ VERIFY DRIVER
export const verifyDriver = async (req, res) => {
  try {
    //  console.log("hello");
    const { driverId } = req.params;

    const driver = await Driver.findById(driverId);
    if (!driver) {
      return res.status(404).json({ message: "Driver not found" });
    }

    driver.verified = true;
    await driver.save();
    await sendMail(
      driver.email,
      "Driver Verification Successful",
      `
  <div style="font-family: Arial, sans-serif; color: #333; line-height: 1.6; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 10px; background-color: #f9f9f9;">
    <h2 style="color: #2E86C1;">Hello ${driver.name},</h2>

    <p style="font-size: 16px;">🎉 Congratulations! Your driver account has been <strong>successfully verified</strong> by the admin.</p>

    <div style="background-color: #fff; padding: 15px; border-radius: 8px; box-shadow: 0 1px 3px rgba(0,0,0,0.1);">
      <h3 style="margin-top: 0;">Your Account Details:</h3>
      <ul style="list-style: none; padding-left: 0;">
        <li><strong>Name:</strong> ${driver.name}</li>
        <li><strong>Email:</strong> ${driver.email}</li>
        <li><strong>Phone:</strong> ${driver.phone || "Not Provided"}</li>
      </ul>
    </div>

    <p style="font-size: 16px;">You can now <a href="http://localhost:5173/login" style="color: #2E86C1; text-decoration: none;">log in</a> to the Route Optimizer System and start using your account.</p>

    <p style="margin-top: 30px; font-size: 14px; color: #777;">
      Regards,<br/>
      <strong>Route Optimizer System Team</strong>
    </p>
  </div>
  `
    );



    return res.status(200).json({ message: "Driver verified successfully" });
  } catch (error) {
    console.error("❌ Error verifying driver:", error);
    res.status(500).json({ message: "Server error" });
  }
};

