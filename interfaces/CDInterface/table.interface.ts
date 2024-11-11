  // Tables Interface
  export interface ITable {
    tables_id: number;    // Primary key
    name: string;
    quantity: number;
    location: string;
    status: string;
    created_at: Date;
    updated_at: Date;
  }
  