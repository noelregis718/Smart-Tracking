import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ExpensesProvider } from './context/ExpensesContext';
import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

const DashboardRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
      </Routes>
    </Layout>
  );
};

const App = () => {
  return (
    <Router>
      <AuthProvider>
        <ExpensesProvider>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/auth" element={<Auth />} />
            <Route
              path="/dashboard/*"
              element={
                <ProtectedRoute>
                  <DashboardRoutes />
                </ProtectedRoute>
              }
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ExpensesProvider>
      </AuthProvider>
    </Router>
  );
};

export default App;
