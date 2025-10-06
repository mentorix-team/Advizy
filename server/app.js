import express from "express";
import cookieParser from "cookie-parser";
import userRoutes from "./Routes/user.route.js";
import payURoutes from "./Routes/payu.route.js";
import expertRoutes from "./Routes/expert.route.js";
import calendarRoutes from "./Routes/calendar.route.js";
import meetingRoutes from "./Routes/meeting.route.js";
// import razorpayRoutes from "./Routes/payment.route.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import morgan from "morgan";
import cors from "cors";
import passport from "passport";
import cron from 'node-cron';
import { updateMeetingStatus } from "./controllers/meeting.controller.js";
import session from "express-session";
import "./config/passport.config.js";

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

const allowedOrigins =
  process.env.NODE_ENV === "production"
    ? [
        "https://advizy.in",              // frontend (main domain)
        "https://www.advizy.in",          // (optional www)
        "https://advizy.onrender.com",    // server
        "https://www.admin.advizy.in",
        "http://advizy-adminpanel.onrender.com",
      ]
    : [
        "http://localhost:5173",
        "http://localhost:8001",
        "http://localhost:5030",
      ];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true); // allow Postman/curl
      if (allowedOrigins.includes(origin)) {
        return callback(null, origin); // return origin instead of true
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);


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

app.use("/ping", (req, res) => {
  res.send("pong");
});

app.use("/api/v1/user", userRoutes);
app.use("/api/v1/expert", expertRoutes);
app.use("/api/v1/calendar", calendarRoutes);
app.use("/api/v1/meeting", meetingRoutes);
// app.use("/api/v1/payment", razorpayRoutes);
app.use("/api/v1/payu", payURoutes);

// app.use('/api/v1/admin', adminRoutes);

// Run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  console.log('Running meeting status update');
  try {
    // Create mock req, res, next objects
    const req = {};
    const res = {
      status: (code) => ({
        json: (data) => console.log(`Response: ${code}`, data)
      })
    };
    const next = (error) => console.error('Error:', error);
    
    // Call your update function
    await updateMeetingStatus(req, res, next);
  } catch (error) {
    console.error('Error in scheduled task:', error);
  }
});

app.use("*", (req, res) => {
  res.status(404).send("404 invalid response");
});

app.use(errorMiddleware);

export default app;
