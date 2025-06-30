const express = require("express")
const cors = require("cors")
const path = require("path")
const parcelController = require("./parcel/parcelController")

const app = express()
const PORT = process.env.PORT || 5000

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Add this after the existing middleware and before the routes
app.use((req, res, next) => {
  console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`)
  console.log("Request body:", req.body)
  next()
})

// Make sure CORS is properly configured
app.use(
  cors({
    origin: ["http://localhost:8000", "http://127.0.0.1:8000", "http://localhost:3000", "*"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
)

// Serve static files (for frontend if needed)
app.use(express.static(path.join(__dirname, "../frontend")))

// API Routes
app.use("/api/parcels", parcelController)

// Dashboard stats endpoint
app.get("/api/dashboard/stats", async (req, res) => {
  try {
    const parcelService = require("./parcel/parcelService")
    const stats = await parcelService.getDashboardStats()

    res.json({
      success: true,
      data: stats,
    })
  } catch (error) {
    console.error("Dashboard stats error:", error)
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard statistics",
      error: error.message,
    })
  }
})

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    message: "Zero Mile Delivery API is running",
    timestamp: new Date().toISOString(),
  })
})

// 404 handler for API routes
app.use("/api/*", (req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found",
  })
})

// Serve frontend for all other routes
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../frontend/index.html"))
})

// Error handling middleware
app.use((err, req, res, next) => {
  console.error("Server error:", err.stack)
  res.status(500).json({
    success: false,
    message: "Internal server error",
    error: process.env.NODE_ENV === "development" ? err.message : "Something went wrong",
  })
})

// Initialize database and start server
const parcelModel = require("./parcel/parcelModel")

parcelModel
  .initializeDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Zero Mile Delivery Server running on port ${PORT}`)
      console.log(`📊 API endpoints: http://localhost:${PORT}/api`)
      console.log(`🌐 Frontend: http://localhost:${PORT}`)
      console.log(`💾 Database: SQLite (./db/parcel.db)`)
    })
  })
  .catch((error) => {
    console.error("Failed to initialize database:", error)
    process.exit(1)
  })

// Graceful shutdown
process.on("SIGINT", () => {
  console.log("\n🛑 Shutting down server...")
  process.exit(0)
})
