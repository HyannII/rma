export interface IDish_ProductsResponse {
    products_id: number;
    quantity: string;
}

export interface ICreateDish_ProductsBody {
    products_id: number;
    items_id: number;
    quantity: string;
}
