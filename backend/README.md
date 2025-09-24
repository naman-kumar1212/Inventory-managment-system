# Inventory Management System - Backend API

A comprehensive REST API for inventory management built with Node.js, Express.js, and MongoDB.

## 🚀 Features

- **User Management**: Registration, authentication, role-based access control
- **Product Management**: CRUD operations, stock tracking, categories
- **Supplier Management**: Supplier information, performance tracking
- **Order Management**: Purchase orders, sales orders, order tracking
- **Inventory Tracking**: Stock movements, low stock alerts, analytics
- **Dashboard & Analytics**: Real-time insights, charts, KPIs
- **Reports**: Inventory, sales, supplier performance reports (JSON/CSV)
- **Security**: JWT authentication, rate limiting, input validation
- **Permissions**: Role-based and department-based access control

## 🛠️ Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB (with in-memory fallback)
- **Authentication**: JWT (JSON Web Tokens)
- **Validation**: express-validator
- **Security**: bcryptjs, express-rate-limit
- **Logging**: morgan
- **Development**: nodemon, cors

## 📋 Prerequisites

- Node.js (v14 or higher)
- MongoDB (optional - will use in-memory storage if not available)
- npm or yarn

## 🔧 Installation

1. **Clone the repository**
```bash
git clone <repository-url>
cd inventory-management-system/backend
```

2. **Install dependencies**
```bash
npm install
```

3. **Set up environment variables**
Create a `.env` file in the backend directory:
```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb://localhost:27017/inventory_management
JWT_SECRET=your-super-secret-jwt-key-here
JWT_EXPIRE=30d
INTERNAL_API_KEY=your-internal-api-key
```

4. **Start MongoDB** (optional)
```bash
# If you have MongoDB installed locally
mongod
```

5. **Run the application**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## 🧪 Testing

Test the API endpoints:
```bash
npm run test:api
```

This will run a comprehensive test suite that:
- Checks API health
- Tests user registration/login
- Creates sample data
- Tests all major endpoints
- Verifies authentication and permissions

## 📚 API Documentation

### Base URL
```
http://localhost:5000/api
```

### Authentication
Most endpoints require a JWT token in the Authorization header:
```
Authorization: Bearer <your-jwt-token>
```

### Main Endpoints

| Endpoint | Description |
|----------|-------------|
| `GET /api/health` | Health check |
| `POST /api/auth/register` | User registration |
| `POST /api/auth/login` | User login |
| `GET /api/auth/me` | Get current user |
| `GET /api/products` | Get all products |
| `POST /api/products` | Create product |
| `GET /api/categories` | Get all categories |
| `GET /api/suppliers` | Get all suppliers |
| `GET /api/orders` | Get all orders |
| `GET /api/dashboard/overview` | Dashboard data |
| `GET /api/reports/inventory` | Inventory report |

For complete API documentation, see [API_DOCUMENTATION.md](./API_DOCUMENTATION.md)

## 🔐 User Roles & Permissions

### Roles
- **Admin**: Full system access
- **Manager**: Management-level access
- **Employee**: Department-specific access

### Departments
- **Management**: Full oversight
- **Inventory**: Product and stock management
- **Sales**: Sales orders and customer management
- **Purchasing**: Purchase orders and supplier management
- **Warehouse**: Stock movements and fulfillment

## 📊 Database Models

### Core Models
- **User**: System users with roles and departments
- **Product**: Inventory items with stock tracking
- **Category**: Product categorization (hierarchical)
- **Supplier**: Vendor information and performance
- **Order**: Purchase/sales orders with items
- **StockMovement**: Inventory movement tracking

## 🔒 Security Features

- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt with salt rounds
- **Rate Limiting**: Prevents API abuse
- **Input Validation**: Comprehensive request validation
- **Role-Based Access**: Granular permission system
- **CORS Protection**: Cross-origin request handling

## 📈 Monitoring & Analytics

### Dashboard Metrics
- Product counts and inventory value
- Low stock alerts
- Recent orders and movements
- Sales analytics and trends

### Reports
- **Inventory Report**: Stock levels, values, categories
- **Sales Report**: Revenue, trends, top products
- **Stock Movement Report**: All inventory changes
- **Supplier Performance**: Delivery rates, order values

## 🚨 Error Handling

The API uses standard HTTP status codes:
- `200` - Success
- `201` - Created
- `400` - Bad Request (validation errors)
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `429` - Too Many Requests
- `500` - Internal Server Error

## 🔄 Development Workflow

1. **Start development server**
```bash
npm run dev
```

2. **Test API endpoints**
```bash
npm run test:api
```

3. **Check logs** - The server logs all requests and errors

4. **Database** - Uses MongoDB if available, otherwise in-memory storage

## 📁 Project Structure

```
backend/
├── config/
│   └── db.js                 # Database configuration
├── controllers/
│   ├── authController.js     # Authentication logic
│   ├── userController.js     # User management
│   ├── productController.js  # Product management
│   ├── categoryController.js # Category management
│   ├── dashboardController.js# Dashboard analytics
│   └── reportController.js   # Report generation
├── middleware/
│   ├── authMiddleware.js     # JWT authentication
│   ├── roleMiddleware.js     # Role-based access
│   ├── validationMiddleware.js# Input validation
│   ├── rateLimitMiddleware.js# Rate limiting
│   └── errorMiddleware.js    # Error handling
├── models/
│   ├── User.js              # User model
│   ├── Product.js           # Product model
│   ├── Category.js          # Category model
│   ├── Supplier.js          # Supplier model
│   ├── Order.js             # Order model
│   └── StockMovement.js     # Stock movement model
├── routes/
│   ├── authRoutes.js        # Auth endpoints
│   ├── userRoutes.js        # User endpoints
│   ├── productRoutes.js     # Product endpoints
│   ├── categoryRoutes.js    # Category endpoints
│   ├── supplierRoutes.js    # Supplier endpoints
│   ├── orderRoutes.js       # Order endpoints
│   ├── dashboardRoutes.js   # Dashboard endpoints
│   └── reportRoutes.js      # Report endpoints
├── server.js                # Main server file
├── test-api.js             # API test script
└── package.json            # Dependencies
```

## 🌟 Key Features Implemented

✅ **Complete Authentication System**
- User registration with validation
- JWT-based login/logout
- Password hashing and security
- Role-based access control

✅ **Comprehensive Product Management**
- CRUD operations for products
- Stock level tracking
- Category and supplier associations
- Bulk stock updates

✅ **Advanced Order System**
- Purchase and sales orders
- Order status tracking
- Automatic stock adjustments
- Order validation and business logic

✅ **Real-time Dashboard**
- Key performance indicators
- Inventory analytics
- Sales trends and charts
- Alert system for low stock

✅ **Flexible Reporting**
- Multiple report types
- JSON and CSV export formats
- Date range filtering
- Performance analytics

✅ **Enterprise Security**
- Multi-level permission system
- Rate limiting and abuse prevention
- Input validation and sanitization
- Audit trails for all operations

## 🚀 Deployment

For production deployment:

1. Set `NODE_ENV=production`
2. Use a production MongoDB instance
3. Set secure JWT secrets
4. Configure proper CORS origins
5. Set up SSL/HTTPS
6. Use PM2 or similar for process management

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License.

## 🆘 Support

For issues and questions:
1. Check the API documentation
2. Run the test suite
3. Check server logs
4. Review error messages

The system is designed to be robust and provide clear error messages to help with debugging and development.