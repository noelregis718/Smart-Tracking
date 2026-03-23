# Smart Expense Tracker

The **Smart Expense Tracker** is a premium, modern fintech application built with React, Node.js, and PostgreSQL. It features a stunning dashboard UI inspired by top-tier financial apps with real-time expense tracking and analytics.

---

## 🚀 Key Features

-   **Rupee-First Dashboard**: All monetary values are standardized to the Indian Rupee symbol (₹) using `en-IN` numbering for a localized financial experience.
-   **Premium Tile-Based UI**: A modern, airy design featuring white Sidebar and Header tiles against a light neutral grey background for maximum focus.
-   **Local Real-time Expenses**: Full CRUD for expenses, powered by a local **PostgreSQL** database for privacy and performance.
-   **Income & Recurring Tracking**: Built-in management for salary/revenue streams and automated subscription tracking with due reminders.
-   **Financial Forecasting**: Live net worth projections and burn-rate analytics using **Recharts** to predict future savings.
-   **Advanced Analytics Suite**: Multi-KPI metrics, currency conversion tools, and market intelligence at a glance.
-   **Secure Hybrid Authentication**: Powered by **Clerk** with manual integration for custom backend data isolation.

---

## 🛠️ Technology Stack

### Frontend
-   **React (Vite)**: Lightning-fast rendering and modern UX.
-   **TypeScript**: Type-safe development.
-   **Recharts**: Interactive performance and trend charts.
-   **Framer Motion**: Smooth micro-animations and transitions.
-   **Three.js & Cobe**: 3D visualization and vibrant UI elements.
-   **Lucide React**: Premium iconography.
-   **Clerk React**: Enterprise-grade user authentication.
-   **EmailJS**: Automated contact form communication.
-   **Axios**: Centralized API client for backend communication.

### Backend
-   **Node.js (Express)**: Modular and scalable API architecture.
-   **Prisma ORM**: Modern database toolkit for PostgreSQL.
-   **PostgreSQL**: Robust local data persistence.
-   **JWT & Bcrypt**: Secure password hashing and custom token management.
-   **Clerk SDK**: Integration for unified user sessions.

---

## 🏃 Local Setup

### 1. Prerequisites
- Node.js (v18+)
- PostgreSQL (running locally)

### 2. Backend Configuration
1. Navigate to `/backend`.
2. Run `npm install`.
3. Create a `.env` file (see `.env.example`).
4. Initialize the database:
   ```bash
   npx prisma migrate dev --name init
   ```
5. Start the server:
   ```bash
   npm run dev
   ```

### 3. Frontend Configuration
1. Navigate to `/frontend`.
2. Run `npm install`.
3. Create a `.env` file (see `.env.example`).
4. Start the app:
   ```bash
   npm run dev
   ```

---

## 📁 Project Structure

```
├── backend/            # Express.js API & Prisma Schema
├── frontend/           # React/Vite UI Components
├── scripts/            # Utility & Maintenance Scripts
└── README.md           # Project documentation
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
