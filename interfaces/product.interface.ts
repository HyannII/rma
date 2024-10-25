export interface IProductResponse {
  products_id: number;
  name: string;
  image_url: string;
  color: string;
  quantity: string;
  category: string;
  weight: string;
  unit: string;
  customer_price: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ICreateProductBody {
  name: string;
  image: File | null;
  color: string;
  quantity: string;
  category: string;
  weight: string;
  unit: string;
  customer_price: string;
  description: string;
}

export interface IDeleteProductResponse {
  message: string;
}

export interface IUpdateProductBody extends Partial<ICreateProductBody> {}
