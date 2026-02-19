import { Layout } from './components/Layout';
import { Landing } from './pages/Landing';
import { Auth } from './pages/Auth';
import { Dashboard } from './pages/Dashboard';
import { Accounts } from './pages/Accounts';
import { Transactions } from './pages/Transactions';
import { CashFlow } from './pages/CashFlow';
import { Reports } from './pages/Reports';
import { Budget } from './pages/Budget';
import { Recurring } from './pages/Recurring';
import { Goals } from './pages/Goals';
import { Investments } from './pages/Investments';
import { Advice } from './pages/Advice';
import { Documents } from './pages/Documents';
import { Notes } from './pages/Notes';
import { Settings } from './pages/Settings';
import { Help } from './pages/Help';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import { ExpensesProvider } from './context/ExpensesContext';

const DashboardRoutes = () => {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/accounts" element={<Accounts />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/cashflow" element={<CashFlow />} />
        <Route path="/reports" element={<Reports />} />
        <Route path="/budget" element={<Budget />} />
        <Route path="/recurring" element={<Recurring />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/investments" element={<Investments />} />
        <Route path="/advice" element={<Advice />} />
        <Route path="/documents" element={<Documents />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/help" element={<Help />} />
      </Routes>
    </Layout>
  );
};

const App = () => {
  return (
    <Router>
      <ExpensesProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth" element={<Auth />} />
          <Route
            path="/dashboard/*"
            element={
              <>
                <SignedIn>
                  <DashboardRoutes />
                </SignedIn>
                <SignedOut>
                  <RedirectToSignIn />
                </SignedOut>
              </>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ExpensesProvider>
    </Router>
  );
};

export default App;
