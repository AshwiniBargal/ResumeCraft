const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// ===============================
// MIDDLEWARE
// ===============================

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    credentials: true,
  })
);

app.use(express.json());

// ===============================
// TEST API
// ===============================

app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "ResumeCraft API is running!",
  });
});

// ===============================
// API ROUTES
// ===============================

// Authentication
app.use("/api/auth", require("./routes/authRoutes"));

// Resume management
app.use("/api/resumes", require("./routes/resumeRoutes"));

// Template management
app.use("/api/templates", require("./routes/templateRoutes"));

// ===============================
// 404 HANDLER
// ===============================

app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: `Route not found: ${req.method} ${req.originalUrl}`,
  });
});

// ===============================
// ERROR HANDLER
// ===============================

app.use((err, req, res, next) => {
  console.error("Server error:", err.message);

  res.status(500).json({
    success: false,
    message: "Internal server error.",
  });
});

// ===============================
// CONNECT MONGODB + START SERVER
// ===============================

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing in .env file.");
    }

    await mongoose.connect(process.env.MONGODB_URI);

    console.log("MongoDB connected successfully");

    app.listen(PORT, () => {
      console.log(
        `ResumeCraft API running at http://localhost:${PORT}`
      );

      console.log("Authentication routes:");
      console.log("  POST /api/auth/register");
      console.log("  POST /api/auth/login");

      console.log("Resume routes:");
      console.log("  GET    /api/resumes");
      console.log("  POST   /api/resumes");
      console.log("  PUT    /api/resumes/:id");
      console.log("  DELETE /api/resumes/:id");

      console.log("Template routes:");
      console.log("  GET    /api/templates");
      console.log("  POST   /api/templates");
      console.log("  DELETE /api/templates/:id");
    });
  } catch (error) {
    console.error("Startup failed:", error.message);
    process.exit(1);
  }
}

startServer();