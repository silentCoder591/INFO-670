# Supply Chain ChatBot

A React Native mobile application with a Node.js backend for managing supply chain purchase orders through a chat interface.

## Prerequisites

### 1. Node.js and npm
- Install Node.js (v14 or higher) from [nodejs.org](https://nodejs.org/)
- npm comes bundled with Node.js
- Verify installation:
  ```bash
  node --version
  npm --version
  ```

### 2. MongoDB
- Install MongoDB (v4.4 or higher) from [mongodb.com](https://www.mongodb.com/try/download/community)
- Start MongoDB service on your system
- Verify installation:
  ```bash
  mongod --version
  ```
## Project Setup

### 1. Clone the Repository
```bash
git clone <repository-url>
cd SupplyChainChatBot
```

### 2. Backend Setup
1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the server directory:
   ```
   PORT=3000
   MONGODB_URI=mongodb://localhost:27017/supplychain
   ```

4. Run the database setup script:
   ```bash
   node setup.js
   ```

5. Start the server:
   ```bash
   npm start
   ```

### 3. Frontend Setup
1. In the root directory, install dependencies:
   ```bash
   npm install
   ```

2. Start the React Native app:
   ```bash
   npx expo start
   ```
3. Update the IP address in App.js
   ```bash
   const defaultIP = '192.XXX.X.XXX';
   ```

4. Run the app:
   - Scan QR code with Expo Go app (Android) or Camera app (iOS)
   - Press 'a' to run on Android emulator
   - Press 'i' to run on iOS simulator (Mac only)

## Project Structure

```
SupplyChainChatBot/
├── server/                 # Backend server
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── setup.js           # Database setup script
│   └── server.js          # Main server file
├── config.txt             # Configuration file for IP address
└── App.js                 # React Native frontend
```

## Requirements

### 1. Front-end
- React Native mobile application with Expo framework
- Real-time chat interface for user interactions
- Data Operations:
  - Write Operations:
    - Submit purchase order status updates
    - Send user queries and commands
  - Read Operations:
    - Display pending purchase orders
    - Show detailed purchase order information
    - Present formatted responses from the server
- Responsive UI with message bubbles and loading states
- Error handling and user feedback mechanisms

### 2. Server APIs
- RESTful API endpoints for purchase orders:
  - `GET /api/purchase-orders`:
    - Retrieves all purchase orders
    - Returns list of purchase orders with status
  - `GET /api/purchase-orders/pending`:
    - Retrieves all pending purchase orders
    - Returns filtered list of pending orders
  - `GET /api/purchase-orders/:id`:
    - Retrieves a specific purchase order by PO number
    - Returns detailed purchase order information
  - `PUT /api/purchase-orders/:id/status`:
    - Updates the status of a specific purchase order
    - Validates status values (Pending/Approved/Delivered/Cancelled)
    - Returns updated purchase order data

- JSON Response Format:
  ```json
  {
    "status": "success/error",
    "data": { /* purchase order data */ },
    "message": "Optional message for status updates"
  }
  ```

- Error Response Format:
  ```json
  {
    "status": "error",
    "message": "Error description",
    "error": "Detailed error message"
  }
  ```

- Data Handling:
  - MongoDB integration for persistent storage
  - Input validation and sanitization
  - Error handling with appropriate status codes
  - Response formatting and data transformation

### 3. Database/Datastore Integration
- MongoDB Schema Design:
  ```javascript
  PurchaseOrder {
    poNumber: String,      // Unique identifier
    status: String,        // Current status (Pending/Approved/Delivered/Cancelled)
    createdAt: Date,       // Creation timestamp
    updatedAt: Date,       // Last update timestamp
    // Additional fields as needed
  }
  ```
- NoSQL Implementation:
  - MongoDB as the primary database
  - Flexible schema design for easy modifications
  - Efficient querying and indexing
  - Data validation and type checking
  - Automatic timestamp management
  - Built-in support for JSON data structures

## Available Commands

The chat interface supports the following commands:

1. List pending purchase orders:
   - "List pending purchase orders"
   - "Show pending purchase orders"

2. Get purchase order details:
   - "Get details for PO [number]"
   - PO number must be 5 or more digits
   - Example: "Get details for PO 4500009285"

3. Update purchase order status:
   - "Mark PO [number] as [status]"
   - PO number must be 5 or more digits
   - Available statuses: pending, approved, delivered, cancelled
   - Example: "Mark PO 4500009285 as Delivered"

Note: All commands are case-insensitive, but the PO number must be exact and the status must match one of the available options.

