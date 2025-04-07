import express from "express";
import cookieParser from 'cookie-parser';
import userRoutes from './Routes/user.route.js';
import expertRoutes from './Routes/expert.route.js';
import calendarRoutes from './Routes/calendar.route.js';
import meetingRoutes from './Routes/meeting.route.js';
import razorpayRoutes from './Routes/payment.route.js';
import adminRoutes from './Routes/admin.route.js'
import errorMiddleware from "./middlewares/error.middleware.js";
import morgan from "morgan";
import cors from 'cors';
import passport from "passport";
import session from 'express-session';
import './config/passport.config.js'
const app = express();

app.use(morgan('dev'));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

app.use(
    cors({
      origin: process.env.frontendurl, // Allow frontend
      credentials: true,
      methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
      allowedHeaders: ["Content-Type", "Authorization"],
    })
  );


app.use(session({
    secret: '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',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set secure to true in production with HTTPS
}));

app.use(passport.initialize());
app.use(passport.session());

app.use('/ping', (req, res) => {
    res.send('pong');
});

app.use('/api/v1/user', userRoutes);
app.use('/api/v1/expert', expertRoutes);
app.use('/api/v1/calendar', calendarRoutes);
app.use('/api/v1/meeting', meetingRoutes);
app.use('/api/v1/payment', razorpayRoutes);
// app.use('/api/v1/admin', adminRoutes);

app.use('*', (req, res) => {
    res.status(404).send('404 invalid response');
});

app.use(errorMiddleware);

export default app;
