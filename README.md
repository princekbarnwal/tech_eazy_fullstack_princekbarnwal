# Zero Mile Delivery System

A full-stack parcel management and tracking application built with **Node.js, Express.js, SQLite, HTML, CSS, and JavaScript**. The system enables users to create, manage, update, delete, and track parcels through a simple, responsive web interface.

## Features

### Dashboard
- View total parcels and delivery statistics.
- Monitor pending, in-transit, and delivered parcels.
- Display recent parcel records.
- Automatically refresh dashboard data.

### Parcel Management
- Create new parcels with customer and delivery details.
- View all registered parcels.
- Update parcel information and delivery status.
- Delete parcels with confirmation.
- Automatically generate unique tracking IDs.

### Parcel Tracking
- Search for parcels using their tracking IDs.
- View parcel details, including customer, vendor, and delivery address.
- Monitor parcel delivery status and timeline.

### Backend API
- RESTful API with complete CRUD operations.
- SQLite database for persistent storage.
- MVC architecture with separate model, service, and controller layers.
- Input validation and error handling.
- CORS support for frontend-backend communication.
- Dashboard statistics and parcel status filtering.

## Technology Stack

| Component | Technology |
|---|---|
| Runtime | Node.js |
| Backend Framework | Express.js |
| Database | SQLite3 |
| Frontend | HTML5, CSS3, JavaScript (ES6+) |
| HTTP Client | Axios |
| Architecture | Model-View-Controller (MVC) |
| API Testing | Postman |

## Project Structure

```text
zero-mile-delivery-system/
├── backend/
│   ├── server.js
│   ├── parcel/
│   │   ├── parcelModel.js
│   │   ├── parcelService.js
│   │   └── parcelController.js
│   ├── db/
│   │   └── parcel.db
│   ├── package.json
│   ├── .env
│   ├── postman_collection.json
│   └── README.md
│
├── frontend/
│   ├── index.html
│   ├── app.js
│   ├── style.css
│   └── README.md
│
└── README.md
```

*Note: The root README documents the complete project. The individual backend and frontend README files are optional.*

## Prerequisites

Before running the application, ensure you have installed:

- [Node.js](https://nodejs.org/) (preferably an active LTS version).
- npm (included with Node.js).
- A modern web browser.
- [Postman](https://www.postman.com/) (optional, for API testing).

## Installation and Setup

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd zero-mile-delivery-system
```

Replace `<your-repository-url>` with your actual Git repository URL.

### 2. Set Up the Backend

Navigate to the backend directory:

```bash
cd backend
```

Install the dependencies:

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env` file inside the `backend` directory:

```env
PORT=5000
NODE_ENV=development
DB_PATH=./db/parcel.db
```

These values are examples based on the backend configuration. Ensure the server loads environment variables and resolves the database path correctly.

### 4. Start the Backend Server

For development:

```bash
npm run dev
```

For production:

```bash
npm start
```

Ensure the corresponding scripts are configured in `backend/package.json`.

The backend API should be available at:

`http://localhost:5000`

The database must be initialized automatically by the backend or created through an appropriate database initialization script.

### 5. Start the Frontend

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
```

You can serve the frontend using Python:

```bash
python -m http.server 8000
```

Alternatively, use a Node.js static file server:

```bash
npx serve .
```

Open the URL displayed by your chosen server. For the Python command, the default URL is:

`http://localhost:8000`

You can also open `index.html` directly in a browser, although serving the frontend over HTTP is generally preferable.

**Important:** The frontend API base URL must point to `http://localhost:5000`, and the backend must permit requests from the frontend's origin.

## API Documentation

Base URL:

```text
http://localhost:5000/api
```

### Parcel Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/parcels` | Retrieve all parcels |
| GET | `/parcels/:id` | Retrieve a parcel by database ID |
| POST | `/parcels` | Create a new parcel |
| PUT | `/parcels/:id` | Update an existing parcel |
| DELETE | `/parcels/:id` | Delete a parcel |

### Tracking and Status Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/parcels/track/:trackingId` | Find a parcel by tracking ID |
| GET | `/parcels/status/:status` | Retrieve parcels by delivery status |

Supported delivery statuses:

- `Pending`
- `In Transit`
- `Delivered`
- `Failed`

### Dashboard and Utility Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/dashboard/stats` | Retrieve dashboard statistics |
| GET | `/health` | Check backend health |

### Example: Create a Parcel

**Request**

```http
POST /api/parcels
Content-Type: application/json
```

**Request body**

```json
{
  "customerName": "John Doe",
  "deliveryAddress": "123 Main St, City, State 12345",
  "contactNumber": "+1234567890",
  "parcelSize": "Medium",
  "weight": 2.5,
  "vendor": "ABC Logistics"
}
```

The backend should generate a unique tracking ID and assign the default status `Pending`.

**Example response**

The exact fields depend on the implemented controller and service:

```json
{
  "success": true,
  "message": "Parcel created successfully",
  "data": {
    "id": 1,
    "trackingId": "ZMD123456789",
    "customerName": "John Doe",
    "deliveryAddress": "123 Main St, City, State 12345",
    "contactNumber": "+1234567890",
    "parcelSize": "Medium",
    "weight": 2.5,
    "vendor": "ABC Logistics",
    "status": "Pending"
  }
}
```

The tracking ID above is illustrative; the actual ID will be generated by the application.

### Standard API Response

Successful responses should follow a consistent structure:

```json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": {}
}
```

Error responses:

```json
{
  "success": false,
  "message": "Error description"
}
```

The exact HTTP status codes and response fields depend on the implemented API handlers.

## Database Schema

The application uses SQLite to store parcel records persistently.

### Parcels Table

```sql
CREATE TABLE parcels (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    trackingId TEXT UNIQUE NOT NULL,
    customerName TEXT NOT NULL,
    deliveryAddress TEXT NOT NULL,
    contactNumber TEXT NOT NULL,
    parcelSize TEXT NOT NULL
        CHECK (parcelSize IN ('Small', 'Medium', 'Large')),
    weight REAL NOT NULL,
    vendor TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Pending'
        CHECK (status IN (
            'Pending',
            'In Transit',
            'Delivered',
            'Failed'
        )),
    createdAt DATETIME DEFAULT CURRENT_TIMESTAMP,
    updatedAt DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

### Database Fields

| Field | Description |
|---|---|
| `id` | Auto-incrementing database identifier |
| `trackingId` | Unique parcel tracking identifier |
| `customerName` | Name of the customer |
| `deliveryAddress` | Destination address |
| `contactNumber` | Customer contact number |
| `parcelSize` | Parcel size: Small, Medium, or Large |
| `weight` | Parcel weight |
| `vendor` | Delivery vendor or logistics provider |
| `status` | Current delivery status |
| `createdAt` | Record creation timestamp |
| `updatedAt` | Last update timestamp |

## Frontend and Backend Integration

The frontend uses Axios to communicate with the Express API.

The main API operations are:

- Fetch parcel records with `GET /api/parcels`.
- Submit new parcels with `POST /api/parcels`.
- Update parcel details with `PUT /api/parcels/:id`.
- Delete parcel records with `DELETE /api/parcels/:id`.
- Search tracking IDs with `GET /api/parcels/track/:trackingId`.
- Retrieve dashboard data with `GET /api/dashboard/stats`.

The backend should enable JSON request parsing and configure CORS for the frontend's origin.

## Testing

### Test the Health Endpoint

```bash
curl http://localhost:5000/api/health
```

### Retrieve All Parcels

```bash
curl http://localhost:5000/api/parcels
```

### Create a Parcel

```bash
curl -X POST http://localhost:5000/api/parcels \
  -H "Content-Type: application/json" \
  -d '{
    "customerName": "Test User",
    "deliveryAddress": "123 Test Street",
    "contactNumber": "1234567890",
    "parcelSize": "Medium",
    "weight": 1.5,
    "vendor": "Test Vendor"
  }'
```

### Test with Postman

1. Start the backend server.
2. Import `backend/postman_collection.json` into Postman.
3. Set the base URL to `http://localhost:5000`.
4. Test the parcel CRUD, tracking, status, and dashboard endpoints.
5. Verify response data and HTTP status codes.

The Postman collection should contain requests matching the actual implemented routes.

## Validation and Error Handling

The backend should validate incoming data before performing database operations.

Recommended validation rules include:

- Required customer name, address, contact number, parcel size, weight, and vendor.
- Parcel size restricted to `Small`, `Medium`, or `Large`.
- Weight must be a valid positive number.
- Delivery status must match one of the supported values.
- Tracking IDs must be unique.
- Requests for nonexistent parcels should return an appropriate not-found response.
- Invalid requests should return meaningful error messages.
- Database failures should be handled without exposing sensitive internal details.

## Security Considerations

For production deployments, consider implementing:

- Strict input validation and sanitization.
- Parameterized SQL queries to prevent SQL injection.
- Restricted CORS origins instead of unrestricted access.
- Rate limiting for public endpoints.
- Authentication and role-based authorization.
- Secure environment variable management.
- HTTPS and appropriate security headers.
- Regular database backups and recovery procedures.

**Note:** CORS is not an authentication or authorization mechanism. If parcel information is sensitive, protect the relevant endpoints with appropriate access controls.

## Performance and Scalability

SQLite is suitable for small and medium-sized deployments with modest write concurrency.

As the application grows, consider:

- Adding indexes for frequently queried fields such as `trackingId` and `status`.
- Using pagination for large parcel lists.
- Optimizing database queries.
- Avoiding unnecessary full-table reads.
- Considering PostgreSQL or MySQL for applications requiring greater write concurrency and multi-instance deployment.

## Production Deployment

Before deploying the application:

1. Set `NODE_ENV=production`.
2. Configure the production port and database path.
3. Restrict CORS to trusted frontend origins.
4. Use a process manager such as PM2 where appropriate.
5. Configure a reverse proxy such as Nginx if needed.
6. Enable HTTPS.
7. Set up database backups and monitoring.
8. Review authentication, authorization, and input validation.
9. Verify that the SQLite database directory is writable and persists across deployments.

## Troubleshooting

| Issue | Possible Solution |
|---|---|
| Port already in use | Stop the conflicting process or configure another port |
| Module not found | Run `npm install` in the backend directory |
| Database locked | Check for competing database operations or connections |
| Database file missing | Verify initialization and the configured database path |
| Frontend cannot connect | Confirm the backend is running and the API URL is correct |
| CORS errors | Check the backend CORS configuration and frontend origin |
| Parcel not found | Verify the database ID or tracking ID |
| Invalid request | Check required fields, data types, parcel size, and status values |

## Future Enhancements

Potential improvements include:

- User authentication and role-based access control.
- Delivery agent management.
- Live parcel status updates.
- Notifications through email or SMS.
- Advanced search, filtering, and pagination.
- Delivery history and proof of delivery.
- Analytics and downloadable reports.
- Automated integration and API tests.
- Migration to PostgreSQL for larger deployments.

## License

Add your chosen license here, such as the MIT License, if applicable.

## Author

Developed as a parcel management and tracking system using a Node.js backend and a vanilla JavaScript frontend.
