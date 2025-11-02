import Driver from "../models/driver.model.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

// ---------- SIGNUP ----------
export const driverSignup = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password)
      return res.status(400).json({ message: "Name, email, and password are required" });

    const existingDriver = await Driver.findOne({ email });
    if (existingDriver)
      return res.status(400).json({ message: "Email already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const newDriver = new Driver({
      name,
      email,
      password: hashedPassword,
      phone,
      verified: false, //  new drivers are unverified by default
    });

    await newDriver.save();

    res.status(201).json({
      message: "Driver registered successfully. Please wait for admin verification.",
      user: {
        id: newDriver._id,
        username: newDriver.username,
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
      return res.status(400).json({ message: "Email and password are required" });

    const driver = await Driver.findOne({ email });
    if (!driver)
      return res.status(404).json({ message: "Driver not found" });

    if (!driver.verified) {
      return res.status(403).json({
        message: "Your account is not yet verified. Please wait for admin approval.",
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
      role: "driver", // 🔹 Add this field
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

