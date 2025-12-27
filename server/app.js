import express from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./Routes/user.route.js";
import payURoutes from "./Routes/payu.route.js";
import expertRoutes from "./Routes/expert.route.js";
import calendarRoutes from "./Routes/calendar.route.js";
import meetingRoutes from "./Routes/meeting.route.js";
import contactRoutes from "./Routes/contact.route.js";
import fastapiRoutes from "./Routes/fastapi.route.js";
// import razorpayRoutes from "./Routes/payment.route.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";
import session from "express-session";
import "./config/passport.config.js";
import { scheduleMeetingReminders } from "./utils/meetingReminderCron.js";
const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
scheduleMeetingReminders();
app.use(express.urlencoded({ extended: true }));

// CORS configuration - must be before routes
const allowedOrigins = [
  process.env.frontendurl,
  "http://localhost:5173",
  "http://localhost:8001",
  "http://localhost:5030",
  "https://advizy.onrender.com",
  "https://www.advizy.in",
  // "http://advizy-adminpanel.onrender.com",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  optionsSuccessStatus: 204,
};

// Apply CORS for all routes
app.use(cors(corsOptions));

app.use(
  session({
    secret: "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",
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }, // Set secure to true in production with HTTPS
  })
);

app.use(passport.initialize());
app.use(passport.session());

// Handle preflight requests for all routes
app.options('*', cors(corsOptions));

// Health check endpoints
app.get("/ping", (req, res) => {
  res.status(200).json({
    status: "ok",
    message: "pong",
    timestamp: new Date().toISOString()
  });
});

app.get("/health", (req, res) => {
  res.status(200).json({
    status: "healthy",
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString()
  });
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/expert", expertRoutes);
app.use("/api/v1/calendar", calendarRoutes);
app.use("/api/v1/meeting", meetingRoutes);
app.use("/api/v1/contact", contactRoutes);
app.use("/api/v1/fastapi", fastapiRoutes);
// app.use("/api/v1/payment", razorpayRoutes);
app.use("/api/v1/payu", payURoutes);

// app.use('/api/v1/admin', adminRoutes);

app.use("*", (req, res) => {
  res.status(404).send("404 invalid response");
});

app.use(errorMiddleware);

export default app;
