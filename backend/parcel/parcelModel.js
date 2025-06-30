const sqlite3 = require("sqlite3").verbose()
const path = require("path")
const fs = require("fs")
const os = require("os")

// Use system temp directory or user home directory
const getDbPath = () => {
  // Try different locations in order of preference
  const locations = [
    path.join(__dirname, "../db"), // Original location
    path.join(os.homedir(), ".zero-mile-delivery"), // User home
    path.join(os.tmpdir(), "zero-mile-delivery"), // System temp
    path.join(process.cwd(), "data"), // Current working directory
  ]

  for (const location of locations) {
    try {
      // Ensure directory exists
      if (!fs.existsSync(location)) {
        fs.mkdirSync(location, { recursive: true })
      }

      // Test write permissions
      const testFile = path.join(location, "test-write.tmp")
      fs.writeFileSync(testFile, "test")
      fs.unlinkSync(testFile)

      console.log(`✅ Using database location: ${location}`)
      return path.join(location, "parcel.db")
    } catch (error) {
      console.log(`❌ Cannot use location ${location}:`, error.message)
      continue
    }
  }

  throw new Error("No writable location found for database")
}

const dbPath = getDbPath()

class ParcelModel {
  constructor() {
    this.db = null
  }

  // Initialize database connection and create tables
  async initializeDatabase() {
    return new Promise((resolve, reject) => {
      console.log(`📦 Initializing database at: ${dbPath}`)

      this.db = new sqlite3.Database(dbPath, (err) => {
        if (err) {
          console.error("Error opening database:", err)
          reject(err)
        } else {
          console.log("📦 Connected to SQLite database")
          this.createTables().then(resolve).catch(reject)
        }
      })
    })
  }

  // Create parcels table
  async createTables() {
    return new Promise((resolve, reject) => {
      const createTableSQL = `
                CREATE TABLE IF NOT EXISTS parcels (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    trackingId TEXT UNIQUE NOT NULL,
                    customerName TEXT NOT NULL,
                    deliveryAddress TEXT NOT NULL,
                    contactNumber TEXT NOT NULL,
                    parcelSize TEXT NOT NULL CHECK(parcelSize IN ('Small', 'Medium', 'Large')),
                    weight REAL NOT NULL,
                    vendor TEXT NOT NULL,
                    status TEXT NOT NULL DEFAULT 'Pending' CHECK(status IN ('Pending', 'In Transit', 'Delivered', 'Failed')),
                    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
                    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
                )
            `

      this.db.run(createTableSQL, (err) => {
        if (err) {
          console.error("Error creating table:", err)
          reject(err)
        } else {
          console.log("✅ Parcels table ready")
          resolve()
        }
      })
    })
  }

  // Generate unique tracking ID
  generateTrackingId() {
    const timestamp = Date.now().toString().slice(-6)
    return `ZM${timestamp}`
  }

  // Get all parcels
  async getAllParcels() {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM parcels ORDER BY createdAt DESC"

      this.db.all(sql, [], (err, rows) => {
        if (err) {
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  }

  // Get parcel by ID
  async getParcelById(id) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM parcels WHERE id = ?"

      this.db.get(sql, [id], (err, row) => {
        if (err) {
          reject(err)
        } else {
          resolve(row)
        }
      })
    })
  }

  // Get parcel by tracking ID
  async getParcelByTrackingId(trackingId) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM parcels WHERE trackingId = ?"

      this.db.get(sql, [trackingId], (err, row) => {
        if (err) {
          reject(err)
        } else {
          resolve(row)
        }
      })
    })
  }

  // Create new parcel
  async createParcel(parcelData) {
    return new Promise((resolve, reject) => {
      const trackingId = this.generateTrackingId()
      const sql = `
                INSERT INTO parcels (trackingId, customerName, deliveryAddress, contactNumber, parcelSize, weight, vendor)
                VALUES (?, ?, ?, ?, ?, ?, ?)
            `

      const params = [
        trackingId,
        parcelData.customerName,
        parcelData.deliveryAddress,
        parcelData.contactNumber,
        parcelData.parcelSize,
        parcelData.weight,
        parcelData.vendor,
      ]

      this.db.run(sql, params, function (err) {
        if (err) {
          reject(err)
        } else {
          resolve({
            id: this.lastID,
            trackingId: trackingId,
            ...parcelData,
            status: "Pending",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
          })
        }
      })
    })
  }

  // Update parcel
  async updateParcel(id, parcelData) {
    return new Promise((resolve, reject) => {
      const sql = `
                UPDATE parcels 
                SET customerName = ?, deliveryAddress = ?, contactNumber = ?, 
                    parcelSize = ?, weight = ?, status = ?, updatedAt = CURRENT_TIMESTAMP
                WHERE id = ?
            `

      const params = [
        parcelData.customerName,
        parcelData.deliveryAddress,
        parcelData.contactNumber,
        parcelData.parcelSize,
        parcelData.weight,
        parcelData.status,
        id,
      ]

      this.db.run(sql, params, function (err) {
        if (err) {
          reject(err)
        } else if (this.changes === 0) {
          reject(new Error("Parcel not found"))
        } else {
          resolve({ id, ...parcelData, updatedAt: new Date().toISOString() })
        }
      })
    })
  }

  // Delete parcel
  async deleteParcel(id) {
    return new Promise((resolve, reject) => {
      const sql = "DELETE FROM parcels WHERE id = ?"

      this.db.run(sql, [id], function (err) {
        if (err) {
          reject(err)
        } else if (this.changes === 0) {
          reject(new Error("Parcel not found"))
        } else {
          resolve({ id, deleted: true })
        }
      })
    })
  }

  // Get parcels by status
  async getParcelsByStatus(status) {
    return new Promise((resolve, reject) => {
      const sql = "SELECT * FROM parcels WHERE status = ? ORDER BY createdAt DESC"

      this.db.all(sql, [status], (err, rows) => {
        if (err) {
          reject(err)
        } else {
          resolve(rows)
        }
      })
    })
  }

  // Get dashboard statistics
  async getDashboardStats() {
    return new Promise((resolve, reject) => {
      const sql = `
                SELECT 
                    COUNT(*) as total,
                    SUM(CASE WHEN status = 'Pending' THEN 1 ELSE 0 END) as pending,
                    SUM(CASE WHEN status = 'In Transit' THEN 1 ELSE 0 END) as inTransit,
                    SUM(CASE WHEN status = 'Delivered' THEN 1 ELSE 0 END) as delivered,
                    SUM(CASE WHEN status = 'Failed' THEN 1 ELSE 0 END) as failed
                FROM parcels
            `

      this.db.get(sql, [], (err, row) => {
        if (err) {
          reject(err)
        } else {
          resolve(row)
        }
      })
    })
  }

  // Close database connection
  close() {
    if (this.db) {
      this.db.close((err) => {
        if (err) {
          console.error("Error closing database:", err)
        } else {
          console.log("📦 Database connection closed")
        }
      })
    }
  }
}

// Export singleton instance
const parcelModel = new ParcelModel()
module.exports = parcelModel
