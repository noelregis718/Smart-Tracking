# Smart Expense Tracker

The **Smart Expense Tracker** is a premium, modern fintech application built with React, Node.js, and PostgreSQL. It features a stunning dashboard UI inspired by top-tier financial apps with real-time expense tracking and analytics.

---

## 🚀 Key Features

-   **Fintech Dashboard Overview**: Minimalist dashboard with vibrant accents, featuring live net worth performance charts and recent transaction highlights.
-   **Local Real-time Expenses**: Full CRUD (Create, Read, Delete) for expenses, powered by a local **PostgreSQL** database for maximum privacy and performance.
-   **Secure Hybrid Authentication**: Powered by **Clerk** with a custom hybrid middleware supporting local **JWT** for seamless backend data isolation.
-   **Financial Summary**: Dynamic calculation of total tracked expenses and time-series data visualization using **Recharts**.
-   **Premium UI/UX**: Beautifully designed `Landing`, `About`, `Features`, `Contact`, `Privacy Policy`, and `Terms of Use` pages with a consistent premium dark and gradient theme.

---

## 🛠️ Technology Stack

### Frontend
-   **React (Vite)**: Lightning-fast rendering and modern UX.
-   **TypeScript**: Type-safe development.
-   **Recharts**: Interactive performance and trend charts.
-   **Lucide React**: Premium iconography.
-   **Clerk React**: Enterprise-grade user authentication.
-   **Axios**: Centralized API client for local backend communication.

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
