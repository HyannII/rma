  // Staff Interface
  export interface IStaffResponse {
    staff_id: number;  // Primary key
    name: string;
    birthday: Date;
    image_url: string;
    phone: string;
    citizen_id: string;
    role: string;
    salary: number;
    wage: number;
    created_at: Date;
    updated_at: Date;
  }
  