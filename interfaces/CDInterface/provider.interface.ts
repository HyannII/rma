export interface IProviderResponse {
    providers_id: number;  // Primary key
    name: string;
    image_url: string;
    address: string;
    phone: string;
    email: string;
    description: string;
    created_at: Date;
    updated_at: Date;
  }