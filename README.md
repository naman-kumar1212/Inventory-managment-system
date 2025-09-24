# Inventory Management System

A full-stack inventory management application built with React (TypeScript) on the frontend and Express.js (Node.js) with MongoDB on the backend. The repository is structured as an npm workspace with `frontend/` and `backend/` packages.

## Features

- 📊 Dashboard with real-time statistics
- 📦 Product management (CRUD operations)
- 🔍 Advanced search and filtering
- 📱 Responsive design with Material-UI
- ⚡ Optimized performance with lazy loading
- 🔄 Bulk operations for products
- 📈 Real-time inventory tracking

## Tech Stack

### Frontend
- React 18 with TypeScript
- Material-UI (MUI) v5
- React Router v6
- Axios for API calls
- Performance optimizations

### Backend
- Express.js
- MongoDB with Mongoose
- CORS enabled
- Security middleware (Helmet, Rate limiting)
- Environment-based configuration

## Quick Start

### Prerequisites
- Node.js >= 16.0.0
- npm >= 8.0.0
- MongoDB (optional; the backend can run with an in-memory fallback)

### Installation

1. Clone the repository
   ```bash
   git clone <repository-url>
   cd inventory-management-system
   ```

2. Install all workspace dependencies (root, frontend, backend)
   ```bash
   npm run install:all
   ```

3. Set up environment variables
   - Backend `backend/.env` (create if missing):
     ```env
     NODE_ENV=development
     PORT=5000
     MONGODB_URI=mongodb://localhost:27017/inventory_management
     JWT_SECRET=your-secret
     JWT_EXPIRE=30d
     ```
   - Frontend: defaults to proxy API calls to `http://localhost:5000` (see `frontend/package.json: proxy`).

4. Start the development servers (concurrently runs backend and frontend)
   ```bash
   npm start
   ```

This will start:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000 (Health: http://localhost:5000/api/health)

### Start services independently
- Backend only (development):
  ```bash
  npm run start:backend
  ```
- Frontend only (development):
  ```bash
  npm run start:frontend
  ```


## Available Scripts

### Root (workspace) scripts
- `npm run install:all` – Install deps in root, frontend, and backend
- `npm start` – Run backend and frontend together (development)
- `npm run start:backend-first` – Start backend, then frontend (Windows timing helper)
- `npm run start:backend` – Run backend dev server (nodemon) from root
- `npm run start:frontend` – Run frontend dev server from root
- `npm run build` – Build the frontend for production
- `npm run setup` – Install all deps and build frontend
- `postinstall` – Hook to install all deps

### Frontend (in `frontend/`)
- `npm start` – Start development server (CRA-based)
- `npm run build` – Build for production
- `npm test` – Run tests

### Backend (in `backend/`)
- `npm run dev` – Start development server with nodemon
- `npm start` – Start production server
- `npm test` – Run backend tests (Jest)

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product
- `POST /api/products/bulk` - Bulk create products
- `DELETE /api/products/bulk` - Bulk delete products

### Health
- `GET /api/health` - Server health check

See more in `backend/README.md`.

## Performance Optimizations

- **Lazy Loading**: Route-based code splitting
- **Memoization**: React.memo for components
- **API Caching**: 30-second cache for GET requests
- **Bundle Optimization**: Tree shaking and minimal dependencies
- **Service Worker**: Static asset caching

## Project Structure

```
inventory-management-system/
├── frontend/                 # React frontend
│   ├── public/              # Static assets
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── hooks/          # Custom hooks
│   │   ├── services/       # API services
│   │   ├── types/          # TypeScript types
│   │   └── utils/          # Utility functions
│   └── package.json
├── backend/                 # Express backend
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Custom middleware
│   ├── models/            # Database models
│   ├── routes/            # API routes
│   └── package.json
└── package.json           # Root package.json
```

## Node.js and Modules

- The backend uses CommonJS (`require` / `module.exports`). See `backend/package.json` (`"type": "commonjs"`).
- To migrate to ESM, set `"type": "module"` and update imports accordingly.

## Health and Error Handling

- Health check endpoint: `GET /api/health` returns status, DB mode, and timestamp.
- Centralized error handler: `backend/middleware/errorMiddleware.js` formats errors and includes stack traces in development.
- Process-level safety nets in `backend/server.js`: `uncaughtException`, `unhandledRejection`, and graceful shutdown on `SIGTERM`.

## Read more
- Backend details: `backend/README.md`
- Frontend details: `frontend/README.md`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## License

MIT License - see [LICENSE](LICENSE) file for details
