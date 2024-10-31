export interface IDishResponse {
  items_id: number;
  name: string;
  image_url: string;
  unit: string;
  category: string;
  price: string;
}

export interface ICreateDishBody {
  name: string;
  image: File | null;
  unit: string;
  category: string;
  price: string;
}

export interface IDeleteDishResponse {
  message: string;
}

export interface IUpdateDishBody extends Partial<ICreateDishBody> {}