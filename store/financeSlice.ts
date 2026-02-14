import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface Transaction {
    id: string;
    type: 'INCOME' | 'EXPENSE';
    category: string;
    amount: number;
    date: string;
    note?: string;
}

interface FinanceState {
    transactions: Transaction[];
    balance: number;
}

const initialState: FinanceState = {
    transactions: [],
    balance: 0,
};

export const financeSlice = createSlice({
    name: 'finance',
    initialState,
    reducers: {
        addTransaction: (state, action: PayloadAction<Transaction>) => {
            state.transactions.unshift(action.payload);
            if (action.payload.type === 'INCOME') {
                state.balance += action.payload.amount;
            } else {
                state.balance -= action.payload.amount;
            }
        },
        setTransactions: (state, action: PayloadAction<Transaction[]>) => {
            state.transactions = action.payload;
            // Recalculate balance
            let bal = 0;
            action.payload.forEach(t => {
                if (t.type === 'INCOME') bal += t.amount;
                else bal -= t.amount;
            });
            state.balance = bal;
        }
    },
});

export const { addTransaction, setTransactions } = financeSlice.actions;
export default financeSlice.reducer;
