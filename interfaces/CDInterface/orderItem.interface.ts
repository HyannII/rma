export interface IOrderItemResponse {
    items_id: number;     // Foreign key to Items
    orders_id: number;    // Foreign key to Orders
    quantity: number;
    description: string;
    created_at: Date;
    updated_at: Date;
  }