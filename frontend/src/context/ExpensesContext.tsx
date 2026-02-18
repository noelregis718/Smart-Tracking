import { createContext, useContext, useState, type ReactNode } from 'react';

export interface Expense {
    id: string;
    title: string;
    amount: number;
    date: string;
    category: string;
}

interface ExpensesContextType {
    expenses: Expense[];
    addExpense: (expense: Omit<Expense, 'id'>) => void;
    deleteExpense: (id: string) => void;
}

const ExpensesContext = createContext<ExpensesContextType | undefined>(undefined);

export const ExpensesProvider = ({ children }: { children: ReactNode }) => {
    const [expenses, setExpenses] = useState<Expense[]>([
        { id: '1', title: 'Groceries', amount: 150.50, date: '2023-10-26', category: 'Food' },
        { id: '2', title: 'Uber Ride', amount: 25.00, date: '2023-10-25', category: 'Transport' },
        { id: '3', title: 'Netflix Subscription', amount: 15.00, date: '2023-10-24', category: 'Entertainment' },
        { id: '4', title: 'Utilities', amount: 80.00, date: '2023-10-20', category: 'Bills' },
    ]);

    const addExpense = (expense: Omit<Expense, 'id'>) => {
        const newExpense = {
            ...expense,
            id: Math.random().toString(36).substr(2, 9),
        };
        setExpenses([newExpense, ...expenses]);
    };

    const deleteExpense = (id: string) => {
        setExpenses(expenses.filter((e) => e.id !== id));
    };

    return (
        <ExpensesContext.Provider value={{ expenses, addExpense, deleteExpense }}>
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
