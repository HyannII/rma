export interface IProviderResponse {
  providers_id: number;
  name: string;
  image_url: string;
  address: string;
  phone: string;
  email: string;
  description: string;
  created_at: string;
  updated_at: string;
}

export interface ICreateProviderBody {
  name: string;
  image_url: string;
  address: string;
  phone: string;
  email: string;
  description: string;
}

export interface IDeleteProviderResponse {
  message: string;
}

export interface IUpdateProviderBody extends Partial<ICreateProviderBody> {}
