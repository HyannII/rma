interface Transaction {
    transaction_id: number;
    staff_id: number;
    providers_id: number;
    products_id: number;
    status: string;
    name: string;
    quantity: string;
    unit: string;
    price: string;
    description: string | null;
    created_at: string; // ISO 8601 formatted date-time string
    updated_at: string; // ISO 8601 formatted date-time string
  }
  
  interface DailyTotalTransaction {
    [date: string]: number;
  }
  
  interface TransactionData {
    transactions: Transaction[];
    totalCompleted: number;
    totalPending: number;
    totalCancelled: number;
    dailyTotals: DailyTotalTransaction;
    totalSum: number;
  }