import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Transaction {
    id: string;
    type: 'EXPENSE' | 'INCOME';
    amount: number;
    category: string;
    date: string; // ISO string
    note?: string;
}

const STORAGE_KEY = '@farm_transactions';

export const TransactionService = {
    async getTransactions(): Promise<Transaction[]> {
        try {
            const jsonValue = await AsyncStorage.getItem(STORAGE_KEY);
            return jsonValue != null ? JSON.parse(jsonValue) : [];
        } catch (e) {
            console.error("Failed to fetch transactions", e);
            return [];
        }
    },

    async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
        try {
            const newTransaction: Transaction = {
                id: Date.now().toString(), // Simple ID generation
                ...transaction
            };
            const currentTransactions = await this.getTransactions();
            const updatedTransactions = [newTransaction, ...currentTransactions];
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTransactions));
            return newTransaction;
        } catch (e) {
            console.error("Failed to add transaction", e);
            throw e;
        }
    },

    async deleteTransaction(id: string): Promise<void> {
        try {
            const currentTransactions = await this.getTransactions();
            const updatedTransactions = currentTransactions.filter(t => t.id !== id);
            await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedTransactions));
        } catch (e) {
            console.error("Failed to delete transaction", e);
            throw e;
        }
    },

    async getFinancialSummary() {
        const transactions = await this.getTransactions();
        let totalIncome = 0;
        let totalExpense = 0;

        transactions.forEach(t => {
            if (t.type === 'INCOME') {
                totalIncome += t.amount;
            } else {
                totalExpense += t.amount;
            }
        });

        return {
            totalIncome,
            totalExpense,
            netProfit: totalIncome - totalExpense
        };
    }
};
