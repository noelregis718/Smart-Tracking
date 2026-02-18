# Smart Expense Tracker

The Smart Expense Tracker is a modern, intuitive web application designed to help users manage their personal finances effectively. With real-time visualization, expense categorization, and secure authentication, taking control of your financial health has never been easier.

![Dashboard Preview](https://placehold.co/800x400?text=App+Preview)

## Features

-   **Dashboard Overview**: Get a quick snapshot of your total balance, income, and expenses with visual indicators.
-   **Expense Tracking**: Easily add, categorize, and delete expenses to keep your records up to date.
-   **Visual Analytics**: Interactive charts provide insights into spending habits by category.
-   **Secure Authentication**: User-friendly login and registration system to keep your data private.
-   **Responsive Design**: Fully optimized for desktop, tablet, and mobile devices.

## Technology Stack

### Frontend
-   **React (Vite)**: For a fast, responsive, and modern user interface.
-   **TypeScript**: Ensuring type safety and code reliability.
-   **CSS Modules**: Modular and scoped styling for maintainable CSS.
-   **Recharts**: Powerful data visualization library for React.
-   **Lucide React**: Beautiful and consistent iconography.

### Backend
-   **Node.js & Express**: Robust and scalable server-side environment.
-   **TypeScript**: unified language across the full stack.
-   **REST API**: Clean and standard API architecture.

## Getting Started

Follow these instructions to set up the project locally.

### Prerequisites
-   Node.js (v14 or higher)
-   npm (v6 or higher)

### Installation

1.  **Clone the repository**
    ```bash
    git clone https://github.com/yourusername/smart-expense-tracker.git
    cd smart-expense-tracker
    ```

2.  **Setup Backend**
    ```bash
    cd backend
    npm install
    npm run dev
    ```
    The backend server will start on `http://localhost:5000`.

3.  **Setup Frontend**
    Open a new terminal window:
    ```bash
    cd frontend
    npm install
    npm run dev
    ```
    The application will be available at `http://localhost:5173`.

## Project Structure

```
smart-expense-tracker/
├── frontend/           # React frontend application
│   ├── src/
│   │   ├── components/ # Reusable UI components
│   │   ├── content/    # Content & assets
│   │   ├── pages/      # Application pages (Dashboard, Auth, etc.)
│   │   └── context/    # State management context
│   └── ...
├── backend/            # Node.js backend server
│   ├── src/
│   │   ├── index.ts    # Server entry point
│   │   └── ...
│   └── ...
└── README.md           # Project documentation
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
