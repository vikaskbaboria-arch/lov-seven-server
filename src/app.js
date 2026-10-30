import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";

import cookieParser from "cookie-parser";
import hpp from "hpp";
import cors from "cors"
import DiscoveryRouter from "./routes/discovery.route.js"
import UserRouter from "./routes/User.route.js"
import ProfileRouter from "./routes/profile.route.js"
import LikeRouter  from "./routes/like.route.js"
import MatchRouter from "./routes/match.route.js"
import InterestRouter from "./routes/interest.route.js"
import MessageRouter from "./routes/message.route.js"
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});



app.use(helmet());

app.use(hpp()); // Prevent HTTP Parameter Pollution
app.use("/api", limiter);

app.use(express.json({limit:'16kb'}));
app.use(express.urlencoded({ extended: true, limit: "10kb" }));
app.use(cookieParser());
app.use(
  cors({
    origin: process.env.CLIENT_URL || "http://localhost:3001",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "X-Requested-With",
      "device-remember-token",
      "Access-Control-Allow-Origin",
      "Origin",
      "Accept",
    ],
  })
);

app.use('/api/v1/user',UserRouter);
app.use('/api/v1/profile',ProfileRouter)
app.use('/api/v1/like',LikeRouter)
app.use('/api/v1/matches',MatchRouter)
app.use('/api/v1/interset',InterestRouter)
app.use('/api/v1/dicovery',DiscoveryRouter)
app.use('/api/v1/message',MessageRouter)
app.use((req, res) => {
  res.status(404).json({
    status: "error",
    message: "Route not found",
  });
});

app.use((err, req, res, next) => {
  console.error(err);
  return res.status(err.statusCode || 500).json({
    status: "error",
    message: err.message || "Internal server error",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

export default app;