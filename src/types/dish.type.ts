import { Product } from "./product.types";


export interface Dish {
  items_id: number;
  name: string;
  image_url: string;
  unit: string;
  category: string;
  price: string;
  products: Product[];
}