export interface ITransactionResponse {
    transactions_id: number;
    staff_id: number;
    providers_id: number;
    products_id: number;
    status: string;
    name: string;
    quantity: string;
    unit: string;
    price: string;
    description: string;
    created_at: string;
}

export interface ICreateTransactionBody {
    staff_id: number;
    providers_id: number;
    products_id: number;
    status: string;
    name: string;
    quantity: string;
    unit: string;
    price: string;
    description: string;
}

export interface IDeleteTransactionResponse {
    message: string;
}

export interface IUpdateTransactionBody extends Partial<ICreateTransactionBody> {}
