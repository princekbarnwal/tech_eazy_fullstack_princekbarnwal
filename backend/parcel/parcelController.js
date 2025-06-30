const express = require("express")
const router = express.Router()
const parcelService = require("./parcelService")

// GET /api/parcels - Get all parcels
router.get("/", async (req, res) => {
  try {
    const parcels = await parcelService.getAllParcels()
    res.json({
      success: true,
      data: parcels,
      count: parcels.length,
    })
  } catch (error) {
    console.error("Get all parcels error:", error)
    res.status(500).json({
      success: false,
      message: error.message,
    })
  }
})

// GET /api/parcels/track/:trackingId - Track parcel by tracking ID
router.get("/track/:trackingId", async (req, res) => {
  try {
    const { trackingId } = req.params
    const parcel = await parcelService.trackParcel(trackingId)

    res.json({
      success: true,
      data: parcel,
    })
  } catch (error) {
    console.error("Track parcel error:", error)
    res.status(404).json({
      success: false,
      message: error.message,
    })
  }
})

// GET /api/parcels/status/:status - Get parcels by status
router.get("/status/:status", async (req, res) => {
  try {
    const { status } = req.params
    const parcels = await parcelService.getParcelsByStatus(status)

    res.json({
      success: true,
      data: parcels,
      count: parcels.length,
    })
  } catch (error) {
    console.error("Get parcels by status error:", error)
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
})

// GET /api/parcels/:id - Get parcel by ID
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const parcel = await parcelService.getParcelById(Number.parseInt(id))

    res.json({
      success: true,
      data: parcel,
    })
  } catch (error) {
    console.error("Get parcel by ID error:", error)
    res.status(404).json({
      success: false,
      message: error.message,
    })
  }
})

// POST /api/parcels - Create new parcel
router.post("/", async (req, res) => {
  try {
    const parcel = await parcelService.createParcel(req.body)

    res.status(201).json({
      success: true,
      message: "Parcel created successfully",
      data: parcel,
    })
  } catch (error) {
    console.error("Create parcel error:", error)
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
})

// PUT /api/parcels/:id - Update parcel
router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const parcel = await parcelService.updateParcel(Number.parseInt(id), req.body)

    res.json({
      success: true,
      message: "Parcel updated successfully",
      data: parcel,
    })
  } catch (error) {
    console.error("Update parcel error:", error)
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
})

// DELETE /api/parcels/:id - Delete parcel
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params
    const result = await parcelService.deleteParcel(Number.parseInt(id))

    res.json({
      success: true,
      message: "Parcel deleted successfully",
      data: result,
    })
  } catch (error) {
    console.error("Delete parcel error:", error)
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
})

// POST /api/parcels/bulk - Create multiple parcels (for future use)
router.post("/bulk", async (req, res) => {
  try {
    const { parcels } = req.body

    if (!Array.isArray(parcels)) {
      return res.status(400).json({
        success: false,
        message: "Parcels must be an array",
      })
    }

    const results = await parcelService.createBulkParcels(parcels)

    res.status(201).json({
      success: true,
      message: `${results.length} parcels created successfully`,
      data: results,
    })
  } catch (error) {
    console.error("Bulk create parcels error:", error)
    res.status(400).json({
      success: false,
      message: error.message,
    })
  }
})

module.exports = router
