# Smart Expense Tracker

The **Smart Expense Tracker** is a premium, modern fintech application built with React, Node.js, and PostgreSQL. It features a stunning dashboard UI inspired by top-tier financial apps with real-time expense tracking and analytics.

---

## 🚀 Key Features

-   **High-Density Vertical Rhythm**: Aggressively refined spacing across Landing, Features, and About pages to achieve a professional, punchy, and modern "breathing" layout.
-   **Interactive Bento Grid**: A modernized, borderless visual showcase of core financial data using schematic and isometric animations.
-   **Founding Team Hub**: Professional, high-fidelity team profiles on the About page with official photography and integrated social presence.
-   **Budgeting Mastery Suite**: New analytical modules including **Savings Boost** (tracking surplus opportunity) and **Spending Pacing** (real-time velocity tracking).
-   **Wealth Shielding Tools**: Goal-oriented tracking with **Inflation Leak** (purchasing power loss) and **Turbo Wealth Simulation** (future project growth).
-   **Rupee-First Dashboard**: All monetary values are standardized to the Indian Rupee symbol (₹) using `en-IN` numbering for a localized financial experience.
-   **Secure Hybrid Authentication**: Powered by **Clerk** with manual integration for custom backend data isolation.
-   **Advanced Analytics Suite**: Multi-KPI metrics, currency conversion tools, and market intelligence at a glance.

---

## 🛠️ Technology Stack

### Frontend
-   **React (Vite 6)**: Lightning-fast rendering and modern UX built on the latest Vite standards.
-   **TypeScript**: Type-safe development across the entire stack.
-   **Framer Motion**: Smooth micro-animations, bento grid transitions, and state-driven UI logic.
-   **Recharts**: Interactive performance graphs and financial trend visualizations.
-   **Three.js & Cobe**: 3D visualization and vibrant UI elements for a premium feel.
-   **Lucide React**: Premium, consistent iconography.
-   **Clerk React**: Enterprise-grade user authentication and session management.

### Backend
-   **Node.js (Express)**: Modular and scalable API architecture.
-   **Prisma ORM**: Modern database toolkit for PostgreSQL.
-   **PostgreSQL**: Robust local data persistence for privacy-first tracking.
-   **JWT & Bcrypt**: Secure password hashing and custom token management for hybrid auth.

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
│   ├── public/         # High-res assets & team photography
│   └── src/            # Core logic & design system
├── scripts/            # Utility & Maintenance Scripts
└── README.md           # Project documentation
```

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
