import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import adminRoutes from "./routes/admin.routes.js";
import driverRoutes from "./routes/driver.routes.js";
import optimizationRoutes from "./routes/optimization.routes.js";

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PATCH", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"] 
}));

app.use(express.json({limit: '20kb'}))
app.use(express.urlencoded({extended: true , limit: '20kb'}))
app.use(express.static('public'))
app.use(cookieParser())
app.use("/api/admin", adminRoutes);
app.use("/api/driver", driverRoutes);
app.use("/optimize", optimizationRoutes);


export { app }