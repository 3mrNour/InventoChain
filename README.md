# Invento Chain (Supply Chain Management System)

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-v18+-339933?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js"/>
  <img src="https://img.shields.io/badge/Express-v5.2.1-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express"/>
  <img src="https://img.shields.io/badge/MongoDB-v6+-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB"/>
  <img src="https://img.shields.io/badge/Mongoose-v9.3.0-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose"/>
  <img src="https://img.shields.io/badge/JWT-Auth-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT"/>
  <img src="https://img.shields.io/badge/License-ISC-blue?style=for-the-badge" alt="License"/>
</p>

<p align="center">
  A robust, production-ready RESTful API for Supply Chain Management built with <strong>Node.js</strong>, <strong>Express 5</strong>, and <strong>MongoDB</strong>. Features enterprise-grade security, atomic inventory operations, and comprehensive order tracking with full audit trails.
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
- [Business Logic Deep Dive](#business-logic-deep-dive)
- [Validation Rules](#validation-rules)
- [Security Features](#security-features)
- [Error Handling](#error-handling)
- [License](#license)

---

## Key Features

### Robust Authentication & Authorization

- **JWT-Based Authentication**: Secure token generation with 10-hour expiration using `jsonwebtoken`
- **Role-Based Access Control (RBAC)**: Granular permissions for three distinct roles:
  - `ADMIN` - Full system access including user management, supplier operations, and order tracking
  - `USER` - Consumer operations (browse products, place orders, view suppliers)
  - `SUPPLIER` - Product catalog management and order tracking visibility

### Advanced Order Processing Logic

- **Automated Product Snapshotting**: Critical product data (`name`, `priceAtPurchase`, `supplierId`) is captured at the moment of purchase and stored as **embedded sub-documents** within the order. This ensures **data integrity** and **financial accuracy** even if product catalogs are modified post-purchase.

- **Server-Side Price Calculation**: Total order price (`totalPrice`) is computed exclusively on the server by iterating through items and summing `price × quantity`, preventing client-side price manipulation and ensuring **atomicity** in financial transactions.

- **Stock Validation**: Real-time inventory checks validate available quantity before order confirmation, returning `400 Insufficient stock` when product quantity is insufficient.

### Inventory & Stock Synchronization

- **Atomic Bulk Operations**: Inventory updates leverage MongoDB's `bulkWrite` with `$inc` operator for **high-performance atomic decrements**:
  ```javascript
  const bulkOps = items.map((item) => ({
    updateOne: {
      filter: { _id: item.productId },
      update: { $inc: { quantity: -item.quantity } },
    },
  }));
  await Product.bulkWrite(bulkOps);
  ```
  This ensures all stock updates execute in a single database round-trip with **atomicity guarantees**.

### Multi-Layered Order Tracking System

- **Dedicated OrderTracking Model**: Separates tracking concerns from order data using a **denormalized status schema** for optimized query performance.

- **Comprehensive Status History**: Every lifecycle event is logged in a `statusHistory` array with:
  - `status` - The status at this checkpoint (`PENDING`, `SHIPPED`, `DELIVERED`, `CANCELLED`)
  - `timestamp` - Auto-generated timestamp (`Date.now`)
  - `message` - Contextual description of the event

- **Status Mirroring**: Current status is synchronized across both `Order.status` and `OrderTracking.status` fields when updated via the tracking endpoint. This **denormalization pattern** enables optimized read performance on both models while maintaining a complete audit trail in `statusHistory`.

### Validation & Data Integrity

- **Multi-Layer Validation**: Request validation using `express-validator` chains with:
  - Email format validation with `normalizeEmail()`
  - Strong password enforcement (`isStrongPassword()`)
  - Phone number validation with locale support (`ar-EG`)
  - MongoDB ObjectId validation (`isMongoId()`)
  - Array validation with nested field rules (`items.*.productId`)

### Clean Architecture

- **Strict MVC Pattern**: Clear separation across Models, Controllers, and Routes
- **Custom Middleware Stack**: Modular `verifyToken` and `allowedTo` middlewares for authentication/authorization
- **Centralized Constants**: Status codes (`HttpResponseText`), user roles (`userRoles`), and order statuses (`orderStatus`) in dedicated utility modules

---

## Architecture

```
FinalProject/
├── index.js                    # Application entry point
├── package.json                # Dependencies & scripts
├── .env                        # Environment configuration (gitignored)
├── .env.example                # Environment template
│
├── postman/
│   ├── InventoChain.postman_collection.json
│   └── Dev.postman_environment.json
│
├── controllers/                # Business logic layer
│   ├── auth.controller.js      # Login & registration handlers
│   ├── user.controller.js      # User CRUD operations
│   ├── supplier.controller.js  # Supplier management
│   ├── product.controller.js   # Product catalog operations
│   ├── order.controller.js     # Order processing with snapshotting & bulkWrite
│   └── orderTracking.controller.js  # Status updates with mirroring
│
├── models/                     # Data layer (Mongoose schemas)
│   ├── user.model.js           # User schema with role enum
│   ├── suppplier.model.js      # Supplier schema
│   ├── product.model.js        # Product schema with findByName static
│   ├── order.model.js          # Order schema with item sub-documents
│   └── tracking.model.js       # OrderTracking with statusHistory array
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
│   ├── verifyToken.js          # JWT verification middleware
│   ├── allowedTo.js            # Role-based authorization factory
│   ├── auth.validation.js      # Registration & update validation
│   ├── supplier.validation.js  # Supplier input validation
│   ├── product.validation.js   # Product input validation
│   ├── order.validation.js     # Order placement validation
│   └── orderTracking.validation.js  # Status update validation
│
└── utils/                      # Utility modules
    ├── HttpResponseText.js     # Response status constants (success, fail, error)
    ├── userRoles.js            # User role constants (ADMIN, USER, SUPPLIER)
    ├── orderStatus.js          # Order status constants (PENDING, SHIPPED, etc.)
    └── generateJWT.js          # Token generation utility (10H expiry)
```

---

## Tech Stack

| Technology | Version | Purpose |
|------------|---------|---------|
| **Node.js** | 18+ | Runtime environment |
| **Express** | 5.2.1 | Web application framework |
| **MongoDB** | 6+ | NoSQL database |
| **Mongoose** | 9.3.0 | MongoDB ODM with schema validation |
| **jsonwebtoken** | 9.0.3 | JWT authentication |
| **bcrypt** | 6.0.0 | Password hashing (cost factor: 10) |
| **express-validator** | 7.3.1 | Request validation middleware |
| **validator** | 13.15.26 | String validation utilities |
| **cors** | 2.8.6 | Cross-Origin Resource Sharing |
| **dotenv** | 17.3.1 | Environment configuration |
| **nodemon** | 3.1.14 | Development server with hot reload |

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
   Server Connected Sucsessfully
   Server is listening in Port : 2000
   ```

### Environment Variables

Create a `.env` file based on `.env.example`:

| Variable | Description | Required |
|----------|-------------|----------|
| `MONGO_URL` | MongoDB connection string | Yes |
| `PORT` | Server port number | Yes |
| `JWT_SECRET_KEY` | Secret key for JWT signing (min 32 chars recommended) | Yes |

```env
MONGO_URL=mongodb://localhost:27017/supply_chain_db
PORT=2000
JWT_SECRET_KEY=your-256-bit-secret-key-here
```

### Postman Collection
For easy testing, a Postman Collection and Environment are provided in the `/postman` folder:
1. Import `InventoChain.postman_collection.json` into Postman.
2. Import `Dev.postman_environment.json`.
3. Start the server and enjoy testing the endpoints!

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

| Method | Endpoint | Description | Auth | Middleware |
|--------|----------|-------------|------|------------|
| `POST` | `/api/auth/register` | Register new user | No | `authValidation` |
| `POST` | `/api/auth/login` | User login | No | - |

#### Register User

```http
POST /api/auth/register
Content-Type: application/json
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

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `firstName` | String | Yes | Non-empty, trimmed |
| `lastName` | String | Yes | Non-empty, trimmed |
| `email` | String | Yes | Valid email, normalized |
| `password` | String | Yes | Min 8 chars, strong password |
| `role` | String | No | Enum: `USER`, `SUPPLIER`, `ADMIN` (default: `USER`) |

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "user": {
      "_id": "507f1f77bcf86cd799439011",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "role": "USER",
      "token": "eyJhbGciOiJIUzI1NiIs...",
      "createdAt": "2026-03-19T10:30:00.000Z",
      "updatedAt": "2026-03-19T10:30:00.000Z"
    }
  }
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json
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
    "message": "welcome",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

---

### Users

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| `GET` | `/api/users` | Get all users | Yes | ADMIN |
| `GET` | `/api/users/:userId` | Get user by ID | Yes | ADMIN |
| `PATCH` | `/api/users/:userId` | Update user | Yes | ADMIN, USER |
| `DELETE` | `/api/users/:userId` | Delete user | Yes | ADMIN |

#### Get All Users

```http
GET /api/users
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "users": [
      {
        "_id": "507f1f77bcf86cd799439011",
        "firstName": "John",
        "lastName": "Doe",
        "email": "john.doe@example.com",
        "role": "USER",
        "createdAt": "2026-03-19T10:30:00.000Z"
      }
    ]
  }
}
```

> **Note:** Password field is excluded from response using projection.

---

### Suppliers

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| `GET` | `/api/suppliers` | Get all suppliers | Yes | ADMIN, USER |
| `POST` | `/api/suppliers` | Create supplier | Yes | ADMIN |
| `GET` | `/api/suppliers/:supplierId` | Get supplier by ID | Yes | ADMIN, USER |
| `PATCH` | `/api/suppliers/:supplierId` | Update supplier | Yes | ADMIN |
| `DELETE` | `/api/suppliers/:supplierId` | Delete supplier | Yes | ADMIN |

#### Create Supplier

```http
POST /api/suppliers
Authorization: Bearer <token>
Content-Type: application/json
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

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | String | Yes | 2-500 characters |
| `phone` | String | Yes | Valid Egyptian mobile (`ar-EG`) |
| `email` | String | Yes | Valid email format |
| `address` | String | Yes | 5-2500 characters |

**Success Response (201):**
```json
{
  "status": "success",
  "data": {
    "supplier": {
      "_id": "507f1f77bcf86cd799439021",
      "name": "Acme Industrial Supplies",
      "phone": "01012345678",
      "email": "contact@acme.com",
      "address": "123 Industrial Zone, Cairo, Egypt",
      "createdAt": "2026-03-19T10:30:00.000Z"
    }
  }
}
```

---

### Products

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| `GET` | `/api/products` | Get all products (paginated) | No | - |
| `POST` | `/api/products` | Create product | Yes | ADMIN, SUPPLIER |
| `GET` | `/api/products/:productId` | Get product by ID | No | - |
| `PATCH` | `/api/products/:productId` | Update product | Yes | ADMIN, SUPPLIER |
| `DELETE` | `/api/products/:productId` | Delete product | Yes | ADMIN, SUPPLIER |
| `GET` | `/api/products/supplier/:supplierId` | Get products by supplier | Yes | Any authenticated |

#### Get All Products

```http
GET /api/products?page=1&limit=10
```

**Query Parameters:**
| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `page` | Number | 1 | Page number |
| `limit` | Number | 10 | Items per page |

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "products": [
      {
        "_id": "507f1f77bcf86cd799439031",
        "name": "Industrial Steel Pipes",
        "description": "High-grade galvanized steel pipes",
        "price": 150,
        "quantity": 500,
        "unit": "pieces",
        "category": "Raw Materials",
        "supplierId": {
          "_id": "507f1f77bcf86cd799439021",
          "name": "Acme Industrial",
          "phone": "01012345678"
        },
        "image": "https://example.com/steel-pipes.jpg"
      }
    ]
  }
}
```

#### Create Product

```http
POST /api/products
Authorization: Bearer <token>
Content-Type: application/json
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
  "supplierId": "507f1f77bcf86cd799439021",
  "image": "https://example.com/images/steel-pipes.jpg"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `name` | String | Yes | Non-empty, trimmed |
| `description` | String | Yes | Non-empty, trimmed |
| `price` | Number | Yes | Numeric, ≥ 0 |
| `quantity` | Number | Yes | Integer, ≥ 0 |
| `unit` | String | Yes | Non-empty |
| `category` | String | Yes | Non-empty |
| `supplierId` | ObjectId | Yes | Valid MongoDB ObjectId |
| `image` | String | No | URL string |

---

### Orders

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| `GET` | `/api/orders` | Get all orders | Yes | Any authenticated |
| `POST` | `/api/orders` | Place new order | Yes | ADMIN, USER |
| `GET` | `/api/orders/:orderId` | Get order by ID | No | - |

#### Place Order

```http
POST /api/orders
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "items": [
    {
      "productId": "507f1f77bcf86cd799439031",
      "quantity": 10
    },
    {
      "productId": "507f1f77bcf86cd799439032",
      "quantity": 5
    }
  ]
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `items` | Array | Yes | Min 1 item |
| `items.*.productId` | ObjectId | Yes | Valid MongoDB ObjectId |
| `items.*.quantity` | Number | Yes | Integer, ≥ 1 |

**Success Response (201):**
```json
{
  "status": "success",
  "data": {
    "order": {
      "_id": "507f1f77bcf86cd799439099",
      "userId": "507f1f77bcf86cd799439001",
      "items": [
        {
          "productId": "507f1f77bcf86cd799439031",
          "name": "Industrial Steel Pipes",
          "priceAtPurchase": 150,
          "supplierId": "507f1f77bcf86cd799439021",
          "quantity": 10
        }
      ],
      "totalPrice": 1500,
      "status": "PENDING",
      "createdAt": "2026-03-19T10:30:00.000Z"
    }
  }
}
```

> **Data Integrity Note:** The `name`, `priceAtPurchase`, and `supplierId` fields are **automatically captured (snapshotted)** from the product catalog at order time. This ensures historical accuracy even if product details change after the order is placed.

---

### Order Tracking

| Method | Endpoint | Description | Auth | Roles |
|--------|----------|-------------|------|-------|
| `GET` | `/api/orderTracker/:orderId` | Get tracking status | Yes | ADMIN, SUPPLIER |
| `POST` | `/api/orderTracker/:orderId` | Update order status | Yes | ADMIN, SUPPLIER |

#### Get Order Tracking

```http
GET /api/orderTracker/:orderId
Authorization: Bearer <token>
```

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "tracking": {
      "_id": "507f1f77bcf86cd799439100",
      "order": {
        "_id": "507f1f77bcf86cd799439099",
        "userId": "507f1f77bcf86cd799439001",
        "totalPrice": 1500,
        "items": [...],
        "createdAt": "2026-03-19T10:30:00.000Z"
      },
      "status": "SHIPPED",
      "statusHistory": [
        {
          "status": "PENDING",
          "timestamp": "2026-03-19T10:30:00.000Z",
          "message": "Order has been created successfully and is awaiting processing."
        },
        {
          "status": "SHIPPED",
          "timestamp": "2026-03-19T14:00:00.000Z",
          "message": "Order status moved to SHIPPED"
        }
      ]
    }
  }
}
```

#### Update Order Status

```http
POST /api/orderTracker/:orderId
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "status": "SHIPPED",
  "message": "Package dispatched from warehouse"
}
```

| Field | Type | Required | Validation |
|-------|------|----------|------------|
| `status` | String | Yes | Enum: `PENDING`, `SHIPPED`, `DELIVERED`, `CANCELLED` |
| `message` | String | No | Custom status message |

**Success Response (200):**
```json
{
  "status": "success",
  "data": {
    "orderHistory": [
      {
        "status": "PENDING",
        "timestamp": "2026-03-19T10:30:00.000Z",
        "message": "Order has been created successfully and is awaiting processing."
      },
      {
        "status": "SHIPPED",
        "timestamp": "2026-03-19T14:00:00.000Z",
        "message": "Package dispatched from warehouse"
      }
    ]
  }
}
```

> **Status Mirroring:** When status is updated via this endpoint, both `Order.status` and `OrderTracking.status` are synchronized, maintaining a **denormalized status schema** for optimized read operations.

#### Order Status Flow

```
PENDING → SHIPPED → DELIVERED
    ↓
CANCELLED
```

| Status | Description |
|--------|-------------|
| `PENDING` | Order created, awaiting processing |
| `SHIPPED` | Order dispatched from warehouse |
| `DELIVERED` | Order successfully delivered |
| `CANCELLED` | Order cancelled |

---

## Data Models

### User Schema

```javascript
{
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    unique: true,
    validate: [validator.isEmail, "Please provide a valid email"]
  },
  password: { 
    type: String, 
    required: true, 
    minlength: 8,
    validate: [validator.isStrongPassword, "Please enter a strong password"]
  },
  role: { 
    type: String, 
    enum: ["ADMIN", "USER", "SUPPLIER"], 
    default: "USER" 
  },
  token: { type: String },
  timestamps: true  // createdAt, updatedAt
}
```

### Supplier Schema

```javascript
{
  name: { type: String, required: true, trim: true },
  phone: { type: String, required: true, trim: true, unique: true },
  email: { type: String, trim: true, lowercase: true },
  address: { type: String, required: true, trim: true },
  timestamps: true
}
```

### Product Schema

```javascript
{
  name: { type: String, required: true, trim: true },
  description: { type: String, required: true, trim: true },
  price: { type: Number, required: true, min: 0 },
  quantity: { type: Number, required: true, min: 0 },
  unit: { type: String, required: true, trim: true },
  category: { type: String, required: true, trim: true },
  supplierId: { 
    type: ObjectId, 
    ref: "Supplier", 
    required: true 
  },
  image: { type: String },
  timestamps: true
}

// Static method
statics: {
  findByName(productName) {
    return this.find({ name: new RegExp(productName, "i") });
  }
}
```

### Order Schema (with Embedded Snapshots)

```javascript
{
  userId: { type: ObjectId, ref: "User", required: true },
  items: [{
    productId: { type: ObjectId, ref: "Product", required: true },
    name: { type: String, required: true },           // Snapshot
    priceAtPurchase: { type: Number, required: true }, // Snapshot
    supplierId: { type: ObjectId, ref: "Supplier", required: true }, // Snapshot
    quantity: { type: Number, required: true, min: 1 },
    _id: false  // Disable auto _id for sub-documents
  }],
  totalPrice: { type: Number, required: true },
  status: { 
    type: String, 
    enum: ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"], 
    default: "PENDING" 
  },
  timestamps: true
}
```

### OrderTracking Schema (Denormalized Status)

```javascript
{
  order: { 
    type: ObjectId, 
    ref: "Order", 
    required: true 
  },
  status: { 
    type: String, 
    enum: ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"], 
    default: "PENDING" 
  },
  statusHistory: [{
    status: { 
      type: String, 
      enum: ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"]
    },
    timestamp: { type: Date, default: Date.now },
    message: { type: String }
  }]
}
```

### Model Relationships

```
┌─────────────────┐     ┌─────────────────┐
│      User       │     │    Supplier     │
│  (_id, role)    │     │  (_id, name)    │
└────────┬────────┘     └────────┬────────┘
         │                       │
         │ userId                │ supplierId
         ▼                       ▼
┌─────────────────┐     ┌─────────────────┐
│      Order      │◄────│    Product      │
│  (items[])      │     │  (quantity)     │
└────────┬────────┘     └─────────────────┘
         │
         │ order (ref)
         ▼
┌─────────────────┐
│  OrderTracking  │
│ (statusHistory) │
└─────────────────┘
```

---

## Business Logic Deep Dive

### Product Snapshotting Mechanism

When an order is placed, product data is captured and embedded within the order document:

```javascript
// From order.controller.js - PlaceOrder function
for (const item of items) {
  let productExist = await Product.findById(item.productId);
  
  // Capture snapshot data from current product state
  const name = productExist.name;
  const price = productExist.price;
  
  // Store snapshots in order item
  item.name = name;
  item.priceAtPurchase = price;
  item.supplierId = productExist.supplierId;
}
```

This **document versioning pattern** ensures that historical orders maintain accurate records regardless of future product catalog changes.

### Atomic Inventory Updates

Stock decrements use MongoDB's `bulkWrite` for **atomic operations**:

```javascript
// From order.controller.js - PlaceOrder function
const bulkOps = items.map((item) => ({
  updateOne: {
    filter: { _id: item.productId },
    update: { $inc: { quantity: -item.quantity } },
  },
}));

await Product.bulkWrite(bulkOps);
```

Benefits:
- Single database round-trip for multiple updates
- Atomic execution prevents partial updates
- `$inc` operator ensures thread-safe decrements

### Status Mirroring Implementation

The `updateStatus` controller synchronizes status across both models:

```javascript
// From orderTracking.controller.js - updateStatus function
// Update Order model
order.status = status;
await order.save();

// Update OrderTracking model (mirroring)
tracking.status = status;
tracking.statusHistory.push({
  status: status,
  message: message || `Order status moved to ${status}`,
  timestamp: new Date(),
});
await tracking.save();
```

This **denormalized status schema** enables:
- Fast status reads directly from Order documents
- Complete audit trail in OrderTracking.statusHistory
- Flexible querying on either model

---

## Validation Rules

### Authentication Validation (`authValidation`)

| Field | Rules |
|-------|-------|
| `firstName` | Required, String, Trimmed |
| `lastName` | Required, String, Trimmed |
| `email` | Required, Valid email, Normalized |
| `password` | Required, Min 8 chars, `isStrongPassword()` |
| `role` | Optional, Enum: `USER`, `SUPPLIER`, `ADMIN` |

### User Update Validation (`updateUser`)

| Field | Rules |
|-------|-------|
| `firstName` | Optional, String, Trimmed |
| `lastName` | Optional, String, Trimmed |
| `email` | Optional, Valid email, Normalized |
| `password` | Optional, Min 8 chars |
| `role` | Optional, Enum: `USER`, `SUPPLIER`, `ADMIN` |

### Supplier Validation (`addSupplierValidation`)

| Field | Rules |
|-------|-------|
| `name` | Required, 2-500 chars, String |
| `phone` | Required, Valid Egyptian mobile (`isMobilePhone("ar-EG")`) |
| `email` | Required, Valid email |
| `address` | Required, 5-2500 chars, String |

### Product Validation (`addProductValidation`)

| Field | Rules |
|-------|-------|
| `name` | Required, String, Trimmed |
| `description` | Required, Trimmed |
| `price` | Required, Numeric, ≥ 0 |
| `quantity` | Required, Integer, ≥ 0 |
| `category` | Required, Trimmed |
| `supplierId` | Required, Valid `isMongoId()` |

### Product Update Validation (`updateProductValidation`)

| Field | Rules |
|-------|-------|
| `price` | Optional, Numeric |
| `quantity` | Optional, Integer, ≥ 0 |

### Order Validation (`placeOrderValidation`)

| Field | Rules |
|-------|-------|
| `items` | Required, Array, Min 1 item |
| `items.*.productId` | Required, Valid `isMongoId()` |
| `items.*.quantity` | Required, Integer, ≥ 1 |

### Order Status Validation (`updateOrderStatus`)

| Field | Rules |
|-------|-------|
| `status` | Required, Enum: `PENDING`, `SHIPPED`, `DELIVERED`, `CANCELLED` |

---

## Security Features

### JWT Authentication Middleware (`verifyToken`)

Validates JWT tokens from the `Authorization` header:

```javascript
const authHeader = req.headers["Authorization"] || req.headers["authorization"];
const token = authHeader.split(" ")[1];
jwt.verify(token, process.env.JWT_SECRET_KEY);
```

**Token Format:**
```
Authorization: Bearer eyJhbGciOiJIUzI1NiIs...
```

**JWT Payload:**
```json
{
  "email": "user@example.com",
  "id": "507f1f77bcf86cd799439011",
  "role": "USER",
  "iat": 1679234400,
  "exp": 1679270400
}
```

### Role-Based Authorization (`allowedTo`)

Factory function that creates role-checking middleware:

```javascript
module.exports = (...roles) => {
  return (req, res, next) => {
    const decodedToken = jwt.verify(token, process.env.JWT_SECRET_KEY);
    const authorized = roles.find((role) => role === decodedToken.role);
    if (!authorized) {
      return res.status(401).json({
        status: "fail",
        data: { message: "Not Authorized!" }
      });
    }
    next();
  };
};
```

**Usage Examples:**
```javascript
// Only ADMIN can access
allowedTo(userRoles.ADMIN)

// ADMIN or USER can access
allowedTo(userRoles.ADMIN, userRoles.USER)

// ADMIN or SUPPLIER can access
allowedTo(userRoles.ADMIN, userRoles.SUPPLIER)
```

### Password Security

- Hashed using **bcrypt** with cost factor of 10
- Strong password validation enforces:
  - Minimum 8 characters
  - Lowercase letter
  - Uppercase letter
  - Number
  - Symbol

---

## Error Handling

### HTTP Status Codes

| Code | Status | Description |
|------|--------|-------------|
| `200` | success | Request successful |
| `201` | success | Resource created |
| `400` | fail | Validation error / Bad request / Insufficient stock |
| `401` | fail | Unauthorized / Invalid token / Not authorized for role |
| `404` | fail | Resource not found |
| `500` | error | Internal server error |

### Validation Error Response

```json
{
  "status": "fail",
  "data": {
    "ValidationErrors": [
      {
        "type": "field",
        "value": "invalid-email",
        "msg": "Please provide a valid email address",
        "path": "email",
        "location": "body"
      }
    ]
  }
}
```

### Stock Validation Error

```json
{
  "status": "fail",
  "data": { "message": "Insufficient stock" }
}
```

### Global 404 Handler

Unmatched routes return a standardized 404 response:

```json
{
  "status": "fail",
  "data": { "message": "Route Not Found!" }
}
```

---

## License

This project is licensed under the **ISC License**.

---

<p align="center">
  Built with precision for Supply Chain Excellence
</p>
