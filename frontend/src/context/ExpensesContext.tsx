import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from '@clerk/clerk-react';
import api, { setAuthToken } from '../lib/api';

export interface Expense {
    id: string;
    title: string;
    amount: number;
    date: string;
    category: string;
}

interface ExpensesContextType {
    expenses: Expense[];
    loading: boolean;
    addExpense: (expense: Omit<Expense, 'id'>) => Promise<void>;
    deleteExpense: (id: string) => Promise<void>;
    refreshExpenses: () => Promise<void>;
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

export const ExpensesProvider = ({ children }: { children: ReactNode }) => {
    const { getToken, isLoaded, isSignedIn } = useAuth();
    const [expenses, setExpenses] = useState<Expense[]>([]);
    const [loading, setLoading] = useState(true);

    const fetchExpenses = async () => {
        if (!isLoaded || !isSignedIn) return;
        
        try {
            setLoading(true);
            const token = await getToken();
            setAuthToken(token);
            const response = await api.get('/expenses');
            setExpenses(response.data);
        } catch (error) {
            console.error('Failed to fetch expenses:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchExpenses();
    }, [isLoaded, isSignedIn]);

    const addExpense = async (expense: Omit<Expense, 'id'>) => {
        try {
            const token = await getToken();
            setAuthToken(token);
            await api.post('/expenses', expense);
            await fetchExpenses();
        } catch (error) {
            console.error('Failed to add expense:', error);
        }
    };

    const deleteExpense = async (id: string) => {
        try {
            const token = await getToken();
            setAuthToken(token);
            await api.delete(`/expenses/${id}`);
            await fetchExpenses();
        } catch (error) {
            console.error('Failed to delete expense:', error);
        }
    };

    return (
        <ExpensesContext.Provider value={{ 
            expenses, 
            loading, 
            addExpense, 
            deleteExpense, 
            refreshExpenses: fetchExpenses 
        }}>
            {children}
        </ExpensesContext.Provider>
    );
};

export const useExpenses = () => {
    const context = useContext(ExpensesContext);
    if (context === undefined) {
        throw new Error('useExpenses must be used within an ExpensesProvider');
    }
    return context;
};
