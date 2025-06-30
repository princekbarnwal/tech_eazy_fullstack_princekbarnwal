# Zero Mile Delivery System - Frontend

A vanilla HTML/CSS/JavaScript frontend for the Zero Mile Delivery System.

## Features

- **Dashboard**: Overview with statistics and recent parcels
- **Add Parcel**: Form to create new parcels
- **Manage Parcels**: View, edit, and delete existing parcels
- **Track Parcel**: Search parcels by tracking ID
- **Responsive Design**: Works on desktop and mobile devices

## Technologies Used

- HTML5
- CSS3 (Grid, Flexbox, Animations)
- Vanilla JavaScript (ES6+)
- Axios for HTTP requests

## Setup

1. Ensure the backend server is running on `http://localhost:5000`
2. Open `index.html` in a web browser
3. Or serve using a local server:
   \`\`\`bash
   # Using Python
   python -m http.server 8000
   
   # Using Node.js
   npx serve .
   \`\`\`

## File Structure

\`\`\`
frontend/
├── index.html          # Main HTML file
├── app.js             # JavaScript logic with Axios
├── style.css          # CSS styling
└── README.md          # This file
\`\`\`

## API Integration

The frontend communicates with the backend API using Axios:

- `GET /api/parcels` - Fetch all parcels
- `POST /api/parcels` - Create new parcel
- `PUT /api/parcels/:id` - Update parcel
- `DELETE /api/parcels/:id` - Delete parcel
- `GET /api/parcels/track/:trackingId` - Track parcel
- `GET /api/dashboard/stats` - Get dashboard statistics

## Features Overview

### Dashboard
- Real-time statistics (Total, Pending, In Transit, Delivered)
- Recent parcels display
- Auto-refresh functionality

### Add Parcel
- Form validation
- Success/error notifications
- Auto-generated tracking IDs

### Manage Parcels
- Grid view of all parcels
- Inline editing with modal
- Delete confirmation
- Status updates

### Track Parcel
- Search by tracking ID
- Detailed parcel information
- Timeline display

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Development

To modify the frontend:

1. Edit HTML structure in `index.html`
2. Update styling in `style.css`
3. Modify JavaScript logic in `app.js`
4. Test with the backend API running

## Notes

- The frontend expects the backend to run on `http://localhost:5000`
- CORS must be enabled on the backend
- All API responses should follow the standard format: `{success: boolean, data: any, message?: string}`
\`\`\`

Now let's create the backend files:
