interface BillItem {
  items_id: number;
  name: string;
  quantity: number;
  price: string; // Assuming price is a string representing a number
}

interface Bill {
  bill_id: number;
  staff: string;
  items: BillItem[];
  total: string; // Assuming total is a string representing a number
  created_at: string; // ISO 8601 formatted date-time string
}

interface DailyTotal {
  [date: string]: number;
}

interface BillData {
  bills: Bill[];
  dailyTotals: DailyTotal;
  totalSum: number;
}