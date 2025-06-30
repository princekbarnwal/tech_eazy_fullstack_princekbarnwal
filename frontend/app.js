// API Base URL
const API_BASE_URL = "http://localhost:5000/api"

// Global variables
let currentSection = "dashboard"
let parcels = []

// Import axios
// const axios = require("axios")
// import axios from 'axios'

// Initialize the application
document.addEventListener("DOMContentLoaded", () => {
  loadDashboard()
  setupEventListeners()
})

// Setup event listeners
function setupEventListeners() {
  // Parcel form submission
  document.getElementById("parcel-form").addEventListener("submit", handleAddParcel)

  // Edit form submission
  document.getElementById("edit-form").addEventListener("submit", handleEditParcel)

  // Track parcel on Enter key
  document.getElementById("tracking-id").addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      trackParcel()
    }
  })
}

// Navigation functions
function showSection(sectionId) {
  // Hide all sections
  document.querySelectorAll(".section").forEach((section) => {
    section.classList.remove("active")
  })

  // Remove active class from all nav buttons
  document.querySelectorAll(".nav-btn").forEach((btn) => {
    btn.classList.remove("active")
  })

  // Show selected section
  document.getElementById(sectionId).classList.add("active")

  // Add active class to clicked button
  event.target.classList.add("active")

  currentSection = sectionId

  // Load data based on section
  switch (sectionId) {
    case "dashboard":
      loadDashboard()
      break
    case "manage-parcels":
      loadParcels()
      break
  }
}

// Dashboard functions
async function loadDashboard() {
  try {
    const response = await axios.get(`${API_BASE_URL}/dashboard/stats`)
    if (response.data.success) {
      updateDashboardStats(response.data.data)
    }

    // Load recent parcels
    const parcelsResponse = await axios.get(`${API_BASE_URL}/parcels`)
    if (parcelsResponse.data.success) {
      displayRecentParcels(parcelsResponse.data.data.slice(0, 6))
    }
  } catch (error) {
    console.error("Error loading dashboard:", error)
    showNotification("Error loading dashboard data", "error")
  }
}

function updateDashboardStats(stats) {
  document.getElementById("total-parcels").textContent = stats.total || 0
  document.getElementById("pending-parcels").textContent = stats.pending || 0
  document.getElementById("transit-parcels").textContent = stats.inTransit || 0
  document.getElementById("delivered-parcels").textContent = stats.delivered || 0
}

function displayRecentParcels(recentParcels) {
  const container = document.getElementById("recent-parcels-list")

  if (recentParcels.length === 0) {
    container.innerHTML = '<p class="empty-message">No parcels found. Add your first parcel to get started!</p>'
    return
  }

  container.innerHTML = recentParcels.map((parcel) => createParcelCard(parcel, false)).join("")
}

// Parcel management functions
async function handleAddParcel(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const parcelData = Object.fromEntries(formData.entries())

  try {
    const response = await axios.post(`${API_BASE_URL}/parcels`, parcelData)

    if (response.data.success) {
      showNotification("Parcel added successfully!", "success")
      e.target.reset()
      loadDashboard() // Refresh dashboard
    }
  } catch (error) {
    console.error("Error adding parcel:", error)
    showNotification("Error adding parcel", "error")
  }
}

async function loadParcels() {
  try {
    const response = await axios.get(`${API_BASE_URL}/parcels`)

    if (response.data.success) {
      parcels = response.data.data
      displayParcels(parcels)
      document.getElementById("parcel-count").textContent = `${parcels.length} parcels`
    }
  } catch (error) {
    console.error("Error loading parcels:", error)
    showNotification("Error loading parcels", "error")
  }
}

function displayParcels(parcelList) {
  const container = document.getElementById("parcels-list")

  if (parcelList.length === 0) {
    container.innerHTML = '<p class="empty-message">No parcels found.</p>'
    return
  }

  container.innerHTML = parcelList.map((parcel) => createParcelCard(parcel, true)).join("")
}

function createParcelCard(parcel, showActions = true) {
  const statusClass = parcel.status.toLowerCase().replace(" ", "-")
  const actionsHtml = showActions
    ? `
        <div class="parcel-actions">
            <button onclick="editParcel(${parcel.id})" class="edit-btn">Edit</button>
            <button onclick="deleteParcel(${parcel.id})" class="delete-btn">Delete</button>
        </div>
    `
    : ""

  return `
        <div class="parcel-card">
            <div class="parcel-header">
                <h4>${parcel.customerName}</h4>
                <span class="status-badge ${statusClass}">${parcel.status}</span>
            </div>
            <div class="parcel-details">
                <p><strong>Tracking ID:</strong> ${parcel.trackingId}</p>
                <p><strong>Contact:</strong> ${parcel.contactNumber}</p>
                <p><strong>Address:</strong> ${parcel.deliveryAddress}</p>
                <p><strong>Size:</strong> ${parcel.parcelSize} | <strong>Weight:</strong> ${parcel.weight}kg</p>
                <p><strong>Vendor:</strong> ${parcel.vendor}</p>
                <p><strong>Created:</strong> ${new Date(parcel.createdAt).toLocaleDateString()}</p>
            </div>
            ${actionsHtml}
        </div>
    `
}

// Edit parcel functions
function editParcel(id) {
  const parcel = parcels.find((p) => p.id === id)
  if (!parcel) return

  // Populate edit form
  document.getElementById("edit-id").value = parcel.id
  document.getElementById("edit-customerName").value = parcel.customerName
  document.getElementById("edit-contactNumber").value = parcel.contactNumber
  document.getElementById("edit-deliveryAddress").value = parcel.deliveryAddress
  document.getElementById("edit-status").value = parcel.status
  document.getElementById("edit-parcelSize").value = parcel.parcelSize
  document.getElementById("edit-weight").value = parcel.weight

  // Show modal
  document.getElementById("edit-modal").style.display = "block"
}

async function handleEditParcel(e) {
  e.preventDefault()

  const formData = new FormData(e.target)
  const parcelData = Object.fromEntries(formData.entries())
  const id = parcelData.id
  delete parcelData.id

  try {
    const response = await axios.put(`${API_BASE_URL}/parcels/${id}`, parcelData)

    if (response.data.success) {
      showNotification("Parcel updated successfully!", "success")
      closeEditModal()
      loadParcels()
      loadDashboard()
    }
  } catch (error) {
    console.error("Error updating parcel:", error)
    showNotification("Error updating parcel", "error")
  }
}

function closeEditModal() {
  document.getElementById("edit-modal").style.display = "none"
}

// Delete parcel function
async function deleteParcel(id) {
  if (!confirm("Are you sure you want to delete this parcel?")) {
    return
  }

  try {
    const response = await axios.delete(`${API_BASE_URL}/parcels/${id}`)

    if (response.data.success) {
      showNotification("Parcel deleted successfully!", "success")
      loadParcels()
      loadDashboard()
    }
  } catch (error) {
    console.error("Error deleting parcel:", error)
    showNotification("Error deleting parcel", "error")
  }
}

// Tracking functions
async function trackParcel() {
  const trackingId = document.getElementById("tracking-id").value.trim()

  if (!trackingId) {
    showNotification("Please enter a tracking ID", "error")
    return
  }

  try {
    const response = await axios.get(`${API_BASE_URL}/parcels/track/${trackingId}`)

    if (response.data.success) {
      displayTrackingResult(response.data.data)
    } else {
      displayTrackingResult(null, trackingId)
    }
  } catch (error) {
    console.error("Error tracking parcel:", error)
    displayTrackingResult(null, trackingId)
  }
}

function displayTrackingResult(parcel, trackingId = "") {
  const container = document.getElementById("tracking-result")

  if (parcel) {
    const statusClass = parcel.status.toLowerCase().replace(" ", "-")
    container.innerHTML = `
            <div class="tracking-found">
                <div class="result-header">
                    <h4>${parcel.customerName}</h4>
                    <span class="status-badge ${statusClass}">${parcel.status}</span>
                </div>
                <div class="result-details">
                    <div class="detail-section">
                        <h5>Parcel Information</h5>
                        <p><strong>Tracking ID:</strong> ${parcel.trackingId}</p>
                        <p><strong>Size:</strong> ${parcel.parcelSize}</p>
                        <p><strong>Weight:</strong> ${parcel.weight} kg</p>
                        <p><strong>Vendor:</strong> ${parcel.vendor}</p>
                    </div>
                    <div class="detail-section">
                        <h5>Delivery Information</h5>
                        <p><strong>Customer:</strong> ${parcel.customerName}</p>
                        <p><strong>Contact:</strong> ${parcel.contactNumber}</p>
                        <p><strong>Address:</strong> ${parcel.deliveryAddress}</p>
                    </div>
                    <div class="detail-section">
                        <h5>Timeline</h5>
                        <p><strong>Created:</strong> ${new Date(parcel.createdAt).toLocaleString()}</p>
                        <p><strong>Last Updated:</strong> ${new Date(parcel.updatedAt).toLocaleString()}</p>
                    </div>
                </div>
            </div>
        `
  } else {
    container.innerHTML = `
            <div class="tracking-not-found">
                <p>No parcel found with tracking ID: <strong>${trackingId}</strong></p>
                <p>Please check the tracking ID and try again.</p>
            </div>
        `
  }

  container.style.display = "block"
}

// Utility functions
function showNotification(message, type = "info") {
  // Create notification element
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.textContent = message

  // Add to page
  document.body.appendChild(notification)

  // Show notification
  setTimeout(() => {
    notification.classList.add("show")
  }, 100)

  // Remove notification after 3 seconds
  setTimeout(() => {
    notification.classList.remove("show")
    setTimeout(() => {
      document.body.removeChild(notification)
    }, 300)
  }, 3000)
}

// Close modal when clicking outside
window.onclick = (event) => {
  const modal = document.getElementById("edit-modal")
  if (event.target === modal) {
    closeEditModal()
  }
}
