# Invento Chain (Supply Chain Management System)
<p align="center">
  <img src="https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express-v5.2-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/MongoDB-v9+-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Mongoose-v9.3-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose"/>
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT"/>
  <img src="https://img.shields.io/badge/License-ISC-blue?style=for-the-badge" alt="License"/>
</p>

<p align="center">
  A robust, production-ready RESTful API for Supply Chain Management built with <strong>Node.js</strong>, <strong>Express 5</strong>, and <strong>MongoDB</strong>. Designed with enterprise-grade security, data integrity patterns, and scalable architecture.
</p>

---

## Table of Contents

- [Key Features](#key-features)
- [Architecture](#architecture)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Environment Variables](#environment-variables)
- [API Documentation](#api-documentation)
  - [Authentication](#authentication)
  - [Users](#users)
  - [Suppliers](#suppliers)
  - [Products](#products)
  - [Orders](#orders)
  - [Order Tracking](#order-tracking)
- [Data Models](#data-models)
- [Security Features](#security-features)
- [Error Handling](#error-handling)
- [License](#license)

---

## Key Features

### Robust Authentication & Authorization

- **JWT-Based Authentication**: Secure token generation with configurable expiration (10-hour default)
- **Role-Based Access Control (RBAC)**: Granular permissions for three distinct roles:
  - `ADMIN` - Full system access including supplier management and order tracking
  - `USER` - Standard consumer operations (browse products, place orders)
  - `SUPPLIER` - Supplier-specific access rights

### Advanced Order Processing Logic

- **Automated Product Snapshotting**: Critical product data (`name`, `priceAtPurchase`, `supplierId`) is captured at the moment of purchase and stored as sub-documents within the order. This ensures **data integrity** and **financial accuracy** even if product catalogs are modified post-purchase.

- **Server-Side Price Calculation**: Total order price is computed exclusively on the server, preventing client-side price manipulation and ensuring **atomicity** in financial transactions.

- **Stock Validation**: Real-time inventory checks prevent overselling by validating available quantity before order confirmation.

### Multi-Layered Order Tracking System

- **Dedicated OrderTracking Model**: Separates tracking concerns from order data for optimized query performance and maintainability.

- **Comprehensive Status History**: Every lifecycle event is logged with:
  - Status transition (`PENDING` → `SHIPPED` → `DELIVERED` | `CANCELLED`)
  - Timestamp (auto-generated)
  - Contextual message

- **Status Mirroring**: Current status is denormalized across both Order and Tracking models for optimized read performance while maintaining a complete audit trail.

### Validation & Data Integrity

- **Strict Input Validation**: Comprehensive request validation using `express-validator` with:
  - Email format validation
  - Strong password enforcement (uppercase, lowercase, numbers, symbols)
  - Phone number format validation (locale-aware)
  - MongoDB ObjectId validation
  - Array and nested object validation

### Clean Architecture

- **MVC Pattern**: Clear separation of concerns across Models, Controllers, and Routes
- **Custom Middleware Stack**: Modular authentication (`verifyToken`) and authorization (`allowedTo`) middlewares
- **Centralized Constants**: Status codes, user roles, and response texts maintained in dedicated utility modules

---

## Architecture

```
FinalProject/
├── index.js                    # Application entry point
├── package.json                # Dependencies & scripts
├── .env                        # Environment configuration
│
├── controllers/                # Business logic layer
│   ├── auth.controller.js      # Authentication handlers
│   ├── user.controller.js      # User CRUD operations
│   ├── supplier.controller.js  # Supplier management
│   ├── product.controller.js   # Product catalog operations
│   ├── order.controller.js     # Order processing logic
│   └── orderTracking.controller.js  # Tracking operations
│
├── models/                     # Data layer (Mongoose schemas)
│   ├── user.model.js           # User schema with role enum
│   ├── suppplier.model.js      # Supplier schema
│   ├── product.model.js        # Product schema with statics
│   ├── order.model.js          # Order schema with item sub-documents
│   └── tracking.model.js       # Order tracking with status history
│
├── routes/                     # API route definitions
│   ├── auth.route.js           # /api/auth/*
│   ├── user.route.js           # /api/users/*
│   ├── supplier.route.js       # /api/suppliers/*
│   ├── product.route.js        # /api/products/*
│   ├── order.route.js          # /api/orders/*
│   └── orderTracking.route.js  # /api/orderTracker/*
│
├── middlewares/                # Custom middleware functions
│   ├── verifyToken.js          # JWT verification
│   ├── allowedTo.js            # Role-based authorization
│   ├── auth.validation.js      # Auth request validation
│   ├── supplier.validation.js  # Supplier validation rules
│   ├── product.validation.js   # Product validation rules
│   ├── order.validation.js     # Order validation rules
│   └── orderTracking.validation.js  # Tracking validation
│
└── utils/                      # Utility modules
    ├── HttpResponseText.js     # Response status constants
    ├── userRoles.js            # User role enum
    ├── orderStatus.js          # Order status enum
    └── generateJWT.js          # Token generation utility
```

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | Runtime environment |
| **Express** | 5.2.1 | Web application framework |
| **MongoDB** | 6+ | NoSQL database |
| **Mongoose** | 9.3.0 | MongoDB ODM |
| **jsonwebtoken** | 9.0.3 | JWT authentication |
| **bcrypt** | 6.0.0 | Password hashing |
| **express-validator** | 7.3.1 | Request validation |
| **validator** | 13.15.26 | String validation utilities |
| **cors** | 2.8.6 | Cross-Origin Resource Sharing |
| **dotenv** | 17.3.1 | Environment configuration |

---

## Getting Started

### Prerequisites

- **Node.js** v18.0.0 or higher
- **MongoDB** v6.0 or higher (local installation or MongoDB Atlas)
- **npm** v9.0.0 or higher

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/3mrNour/InventoChain
   cd InventoChain
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

5. **Verify the server is running**
   ```
   Server Connected Successfully
   Server is listening in Port : 2000
   ```

### Environment Variables

Create a `.env` file in the project root with the following variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `PORT` | Server port number | `2000` |
| `MONGO_URL` | MongoDB connection string | `mongodb://localhost:27017/scm_db` |
| `JWT_SECRET_KEY` | Secret key for JWT signing | `your-super-secret-key-min-32-chars` |

```env
PORT=2000
MONGO_URL=mongodb://localhost:27017/supply_chain_db
JWT_SECRET_KEY=your-256-bit-secret-key-here
```

---

## API Documentation

### Base URL

```
http://localhost:2000/api
```

### Response Format

All responses follow a consistent JSON structure:

**Success Response:**
```json
{
  "status": "SUCCESS",
  "data": { ... }
}
```

**Error Response:**
```json
{
  "status": "FAIL" | "ERROR",
  "data": { "message": "Error description" }
}
```

---

### Authentication

#### Register User

```http
POST /api/auth/register
```

**Request Body:**
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john.doe@example.com",
  "password": "SecurePass123!",
  "role": "USER"  // Optional: ADMIN, USER, SUPPLIER (default: USER)
}
```

**Success Response (201):**
```json
{
  "status": "SUCCESS",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "USER",
      "token": "eyJhbGciOiJIUzI1NiIs..."
    }
  }
}
```

#### Login

```http
POST /api/auth/login
```

**Request Body:**
```json
{
  "email": "john.doe@example.com",
  "password": "SecurePass123!"
}
```

**Success Response (200):**
```json
{
  "status": "SUCCESS",
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Users

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| `GET` | `/api/users` | Get all users | No | - |
| `GET` | `/api/users/:userId` | Get user by ID | No | - |
| `PATCH` | `/api/users/:userId` | Update user | No | - |
| `DELETE` | `/api/users/:userId` | Delete user | No | - |

---

### Suppliers

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| `GET` | `/api/suppliers` | Get all suppliers | No | - |
| `POST` | `/api/suppliers` | Create supplier | No | - |
| `GET` | `/api/suppliers/:supplierId` | Get supplier by ID | No | - |
| `PATCH` | `/api/suppliers/:supplierId` | Update supplier | No | - |
| `DELETE` | `/api/suppliers/:supplierId` | Delete supplier | Yes | ADMIN |

#### Create Supplier

```http
POST /api/suppliers
```

**Request Body:**
```json
{
  "name": "Acme Industrial Supplies",
  "phone": "01012345678",
  "email": "contact@acme.com",
  "address": "123 Industrial Zone, Cairo, Egypt"
}
```

---

### Products

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| `GET` | `/api/products` | Get all products | No | - |
| `POST` | `/api/products` | Create product | No | - |
| `GET` | `/api/products/:productId` | Get product by ID | No | - |
| `PATCH` | `/api/products/:productId` | Update product | No | - |
| `DELETE` | `/api/products/:productId` | Delete product | No | - |
| `GET` | `/api/products/supplier/:supplierId` | Get products by supplier | No | - |

#### Create Product

```http
POST /api/products
```

**Request Body:**
```json
{
  "name": "Industrial Steel Pipes",
  "description": "High-grade galvanized steel pipes for industrial use",
  "price": 150.00,
  "quantity": 500,
  "unit": "pieces",
  "category": "Raw Materials",
  "supplierId": "507f1f77bcf86cd799439011",
  "image": "https://example.com/images/steel-pipes.jpg"
}
```

---

### Orders

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| `GET` | `/api/orders` | Get all orders | Yes | Any |
| `POST` | `/api/orders` | Place new order | Yes | ADMIN, USER |
| `GET` | `/api/orders/:orderId` | Get order by ID | No | - |

#### Place Order

```http
POST /api/orders
Authorization: Bearer <token>
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "507f1f77bcf86cd799439011",
      "quantity": 10
    },
    {
      "productId": "507f1f77bcf86cd799439012",
      "quantity": 5
    }
  ]
}
```

**Success Response (201):**
```json
{
  "status": "SUCCESS",
  "data": {
    "order": {
      "_id": "507f1f77bcf86cd799439099",
      "userId": "507f1f77bcf86cd799439001",
      "items": [
        {
          "productId": "507f1f77bcf86cd799439011",
          "name": "Industrial Steel Pipes",
          "priceAtPurchase": 150.00,
          "supplierId": "507f1f77bcf86cd799439021",
          "quantity": 10
        }
      ],
      "totalPrice": 1500.00,
      "status": "PENDING",
      "createdAt": "2026-03-19T10:30:00.000Z"
    }
  }
}
```

> **Note:** The `name`, `priceAtPurchase`, and `supplierId` are **automatically captured** from the product catalog at order time, ensuring data integrity for historical records.

---

### Order Tracking

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| `GET` | `/api/orderTracker` | Get tracking data | Yes | ADMIN |

#### Order Status Flow

```
PENDING → SHIPPED → DELIVERED
    ↓
CANCELLED
```

**Status Definitions:**

| Status | Description |
|--------|-------------|
| `PENDING` | Order created, awaiting processing |
| `SHIPPED` | Order dispatched from warehouse |
| `DELIVERED` | Order successfully delivered |
| `CANCELLED` | Order cancelled (triggers stock reversion) |

---

## Data Models

### User Schema

```javascript
{
  firstName: String,        // Required
  lastName: String,         // Required
  email: String,            // Required, Unique, Valid Email
  password: String,         // Required, Min 8 chars, Strong Password
  role: String,             // Enum: [ADMIN, USER, SUPPLIER], Default: USER
  token: String,            // JWT Token
  timestamps: true          // createdAt, updatedAt
}
```

### Order Schema (with Snapshotting)

```javascript
{
  userId: ObjectId,         // Reference to User
  items: [{
    productId: ObjectId,    // Reference to Product
    name: String,           // Snapshot: Product name at purchase
    priceAtPurchase: Number,// Snapshot: Price at purchase time
    supplierId: ObjectId,   // Snapshot: Supplier at purchase time
    quantity: Number        // Ordered quantity (min: 1)
  }],
  totalPrice: Number,       // Server-calculated total
  status: String,           // Enum: [PENDING, SHIPPED, DELIVERED, CANCELLED]
  timestamps: true
}
```

### OrderTracking Schema

```javascript
{
  orderId: ObjectId,        // Reference to Order
  status: String,           // Current status (mirrored)
  statusHistory: [{
    status: String,         // Status at this point
    timestamp: Date,        // Auto-generated timestamp
    message: String         // Contextual message
  }]
}
```

---

## Security Features

### Authentication Middleware

The `verifyToken` middleware validates JWT tokens from the `Authorization` header:

```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

### Role-Based Authorization

The `allowedTo` middleware factory restricts access based on user roles:

```javascript
// Only ADMIN can access
router.delete('/:id', verifyToken, allowedTo('ADMIN'), controller.delete);

// ADMIN or USER can access
router.post('/', verifyToken, allowedTo('ADMIN', 'USER'), controller.create);
```

### Password Security

- Passwords are hashed using **bcrypt** with a cost factor of 10
- Strong password validation enforces:
  - Minimum 8 characters
  - At least 1 uppercase letter
  - At least 1 lowercase letter
  - At least 1 number
  - At least 1 symbol

### Input Sanitization

All user inputs are validated and sanitized using `express-validator` before processing.

---

## Error Handling

### HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| `200` | SUCCESS | Request successful |
| `201` | SUCCESS | Resource created |
| `400` | FAIL | Validation error / Bad request |
| `401` | FAIL | Unauthorized / Invalid token |
| `404` | FAIL | Resource not found |
| `500` | ERROR | Internal server error |

### Validation Error Response

```json
{
  "status": "ERROR",
  "data": {
    "ValidationErrors": [
      {
        "type": "field",
        "value": "invalid-email",
        "msg": "Please provide a valid email",
        "path": "email",
        "location": "body"
      }
    ]
  }
}
```

### Global 404 Handler

Unmatched routes return a standardized 404 response:

```json
{
  "status": "FAIL",
  "data": { "message": "Route Not Found!" }
}
```

---

## License

This project is licensed under the **ISC License**.

---

<p align="center">
  Built with passion for Supply Chain Excellence
</p>
