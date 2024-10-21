export interface Bill {
    bill_id: number;
    staff: string;
    items: [
        {
            name: string;
            quantity: number;
            price: string;
        }
    ],
    total: string;
    created_at: string;
}