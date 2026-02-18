import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Mock Data
let expenses = [
    { id: '1', title: 'Groceries', amount: 150.50, date: '2023-10-26', category: 'Food' },
    { id: '2', title: 'Uber Ride', amount: 25.00, date: '2023-10-25', category: 'Transport' },
];

// Routes
app.get('/', (req: Request, res: Response) => {
    res.send('Smart Expense Tracker API is running');
});

app.get('/api/expenses', (req: Request, res: Response) => {
    res.json(expenses);
});

app.post('/api/expenses', (req: Request, res: Response) => {
    const newExpense = {
        id: Math.random().toString(36).substr(2, 9),
        ...req.body
    };
    expenses.push(newExpense);
    res.status(201).json(newExpense);
});

app.delete('/api/expenses/:id', (req: Request, res: Response) => {
    const { id } = req.params;
    expenses = expenses.filter(e => e.id !== id);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
