import { Product } from "@/types/product.types";

export interface IDishResponse {
  items_id: number;
  name: string;
  image_url: string;
  quantity: number;
  unit: string;
  category: string;
  price: string;
  products: Product[];
}

export interface ICreateDishBody {
  name: string;
  image: File | null;
  quantity: number;
  unit: string;
  category: string;
  price: string;
  products: Product[];
}

export interface IDeleteDishResponse {
  message: string;
}

export interface IUpdateDishBody extends Partial<ICreateDishBody> {}