# Zero Mile Delivery System - Backend

A Node.js/Express backend API with SQLite database for the Zero Mile Delivery System.

## Features

- **RESTful API**: Complete CRUD operations for parcels
- **SQLite Database**: Lightweight, file-based database
- **MVC Architecture**: Model-View-Controller pattern
- **Data Validation**: Input validation and error handling
- **CORS Support**: Cross-origin resource sharing enabled
- **Auto-generated Tracking IDs**: Unique tracking identifiers

## Technology Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: SQLite3
- **Architecture**: MVC (Model-View-Controller)

## Project Structure

\`\`\`
backend/
├── server.js                  # Main server file
├── parcel/
│   ├── parcelModel.js        # Database model (SQLite)
│   ├── parcelService.js      # Business logic layer
│   └── parcelController.js   # Route handlers
├── db/
│   └── parcel.db            # SQLite database file
├── package.json             # Dependencies
├── README.md               # This file
└── postman_collection.json # API testing collection
\`\`\`

## Setup & Installation

1. **Install Dependencies**
   \`\`\`bash
   npm install
   \`\`\`

2. **Start Development Server**
   \`\`\`bash
   npm run dev
   \`\`\`

3. **Start Production Server**
   \`\`\`bash
   npm start
   \`\`\`

The server will run on `http://localhost:5000`

## API Endpoints

### Parcels

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/parcels` | Get all parcels |
| GET | `/api/parcels/:id` | Get parcel by ID |
| POST | `/api/parcels` | Create new parcel |
| PUT | `/api/parcels/:id` | Update parcel |
| DELETE | `/api/parcels/:id` | Delete parcel |

### Tracking

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/parcels/track/:trackingId` | Track parcel by tracking ID |
| GET | `/api/parcels/status/:status` | Get parcels by status |

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/dashboard/stats` | Get dashboard statistics |

### Utility

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | Health check |

## Request/Response Format

### Create Parcel Request
\`\`\`json
{
  "customerName": "John Doe",
  "deliveryAddress": "123 Main St, City, State 12345",
  "contactNumber": "+1234567890",
  "parcelSize": "Medium",
  "weight": 2.5,
  "vendor": "ABC Logistics"
}
\`\`\`

### Standard Response Format
\`\`\`json
{
  "success": true,
  "message": "Operation completed successfully",
  "data": { ... }
}
\`\`\`

### Error Response Format
\`\`\`json
{
  "success": false,
  "message": "Error description"
}
\`\`\`

## Database Schema

### Parcels Table

\`\`\`sql
CREATE TABLE parcels (
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
);
\`\`\`

## Environment Variables

Create a `.env` file (optional):

\`\`\`env
PORT=5000
NODE_ENV=development
DB_PATH=./db/parcel.db
\`\`\`

## Error Handling

The API includes comprehensive error handling:

- **Validation Errors**: Invalid input data
- **Not Found Errors**: Resource doesn't exist
- **Database Errors**: SQLite operation failures
- **Server Errors**: Internal server issues

## Development

### Adding New Features

1. **Model Layer**: Add database operations in `parcelModel.js`
2. **Service Layer**: Add business logic in `parcelService.js`
3. **Controller Layer**: Add route handlers in `parcelController.js`
4. **Server**: Register routes in `server.js`

### Testing

Use the provided Postman collection or test manually:

\`\`\`bash
# Health check
curl http://localhost:5000/api/health

# Get all parcels
curl http://localhost:5000/api/parcels

# Create parcel
curl -X POST http://localhost:5000/api/parcels \
  -H "Content-Type: application/json" \
  -d '{"customerName":"Test User","deliveryAddress":"123 Test St","contactNumber":"1234567890","parcelSize":"Medium","weight":1.5,"vendor":"Test Vendor"}'
\`\`\`

## Production Deployment

1. Set `NODE_ENV=production`
2. Use process manager like PM2
3. Set up reverse proxy (Nginx)
4. Configure SSL/HTTPS
5. Set up database backups

## Security Considerations

- Input validation and sanitization
- SQL injection prevention (parameterized queries)
- CORS configuration
- Rate limiting (recommended)
- Authentication/Authorization (future enhancement)

## Performance

- SQLite is suitable for small to medium applications
- Consider PostgreSQL/MySQL for high-traffic applications
- Implement caching for frequently accessed data
- Add database indexing for better query performance

## Troubleshooting

### Common Issues

1. **Database locked**: Close existing connections
2. **Port in use**: Change PORT in server.js
3. **Permission errors**: Check file/folder permissions
4. **Module not found**: Run `npm install`

### Logs

Server logs include:
- Request/response information
- Database operations
- Error details
- Performance metrics
\`\`\`

Now the Postman collection:
