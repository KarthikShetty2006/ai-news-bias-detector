import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";

import authRoutes from "./routes/authRoutes.js";
import errorHandler from "./middleware/errorMiddleware.js";
import newsRoutes from "./routes/newsRoutes.js";
import mlRoutes from "./routes/mlRoutes.js";
import statsRoutes from "./routes/statsRoutes.js";
import dashboardRoutes from "./routes/dashboardRoutes.js";
import bookmarkRoutes from "./routes/bookmarkRoutes.js"

const app = express();

app.use(cors());
app.use(helmet());
app.use(morgan("dev"));
app.use(express.json());

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "AI News Bias Detector Backend Running",
  });
});

app.get("/health", (req, res) => {
  res.json({
    success: true,
    status: "Healthy",
  });
});

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/news", newsRoutes);
app.use("/api/v1/ml", mlRoutes);
app.use("/api/v1/news/stats", statsRoutes);
app.use("/api/v1/dashboard", dashboardRoutes);
app.use("/api/v1/bookmarks", bookmarkRoutes);

app.use(errorHandler);

export default app;