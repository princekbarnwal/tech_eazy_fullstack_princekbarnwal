const parcelModel = require("./parcelModel")

class ParcelService {
  // Get all parcels
  async getAllParcels() {
    try {
      return await parcelModel.getAllParcels()
    } catch (error) {
      throw new Error(`Failed to fetch parcels: ${error.message}`)
    }
  }

  // Get parcel by ID
  async getParcelById(id) {
    try {
      const parcel = await parcelModel.getParcelById(id)
      if (!parcel) {
        throw new Error("Parcel not found")
      }
      return parcel
    } catch (error) {
      throw new Error(`Failed to fetch parcel: ${error.message}`)
    }
  }

  // Track parcel by tracking ID
  async trackParcel(trackingId) {
    try {
      const parcel = await parcelModel.getParcelByTrackingId(trackingId)
      if (!parcel) {
        throw new Error("Parcel not found")
      }
      return parcel
    } catch (error) {
      throw new Error(`Failed to track parcel: ${error.message}`)
    }
  }

  // Create new parcel
  async createParcel(parcelData) {
    try {
      console.log("Creating parcel with data:", parcelData) // Debug log

      // Validate required fields
      const requiredFields = ["customerName", "deliveryAddress", "contactNumber", "parcelSize", "weight", "vendor"]
      for (const field of requiredFields) {
        if (!parcelData[field] || parcelData[field].toString().trim() === "") {
          throw new Error(`${field} is required and cannot be empty`)
        }
      }

      // Validate parcel size
      const validSizes = ["Small", "Medium", "Large"]
      if (!validSizes.includes(parcelData.parcelSize)) {
        throw new Error(`Invalid parcel size. Must be one of: ${validSizes.join(", ")}`)
      }

      // Validate weight
      const weight = Number.parseFloat(parcelData.weight)
      if (isNaN(weight) || weight <= 0) {
        throw new Error("Weight must be a positive number")
      }
      parcelData.weight = weight

      console.log("Validation passed, creating parcel...") // Debug log

      const result = await parcelModel.createParcel(parcelData)
      console.log("Parcel created successfully:", result) // Debug log

      return result
    } catch (error) {
      console.error("Service error creating parcel:", error) // Debug log
      throw new Error(`Failed to create parcel: ${error.message}`)
    }
  }

  // Update parcel
  async updateParcel(id, parcelData) {
    try {
      // Check if parcel exists
      const existingParcel = await parcelModel.getParcelById(id)
      if (!existingParcel) {
        throw new Error("Parcel not found")
      }

      // Validate status if provided
      if (parcelData.status) {
        const validStatuses = ["Pending", "In Transit", "Delivered", "Failed"]
        if (!validStatuses.includes(parcelData.status)) {
          throw new Error("Invalid status")
        }
      }

      // Validate parcel size if provided
      if (parcelData.parcelSize) {
        const validSizes = ["Small", "Medium", "Large"]
        if (!validSizes.includes(parcelData.parcelSize)) {
          throw new Error("Invalid parcel size")
        }
      }

      // Validate weight if provided
      if (parcelData.weight !== undefined) {
        const weight = Number.parseFloat(parcelData.weight)
        if (isNaN(weight) || weight <= 0) {
          throw new Error("Weight must be a positive number")
        }
        parcelData.weight = weight
      }

      return await parcelModel.updateParcel(id, parcelData)
    } catch (error) {
      throw new Error(`Failed to update parcel: ${error.message}`)
    }
  }

  // Delete parcel
  async deleteParcel(id) {
    try {
      // Check if parcel exists
      const existingParcel = await parcelModel.getParcelById(id)
      if (!existingParcel) {
        throw new Error("Parcel not found")
      }

      return await parcelModel.deleteParcel(id)
    } catch (error) {
      throw new Error(`Failed to delete parcel: ${error.message}`)
    }
  }

  // Get parcels by status
  async getParcelsByStatus(status) {
    try {
      const validStatuses = ["Pending", "In Transit", "Delivered", "Failed"]
      if (!validStatuses.includes(status)) {
        throw new Error("Invalid status")
      }

      return await parcelModel.getParcelsByStatus(status)
    } catch (error) {
      throw new Error(`Failed to fetch parcels by status: ${error.message}`)
    }
  }

  // Get dashboard statistics
  async getDashboardStats() {
    try {
      return await parcelModel.getDashboardStats()
    } catch (error) {
      throw new Error(`Failed to fetch dashboard stats: ${error.message}`)
    }
  }

  // Bulk operations (for future use)
  async createBulkParcels(parcelsData) {
    try {
      const results = []
      for (const parcelData of parcelsData) {
        const result = await this.createParcel(parcelData)
        results.push(result)
      }
      return results
    } catch (error) {
      throw new Error(`Failed to create bulk parcels: ${error.message}`)
    }
  }
}

module.exports = new ParcelService()
