export interface IStaffResponse {
    staff_id: number;
    name: string;
    gender: string;
    birthday: string;
    image_url: File | null;
    phone: string;
    citizen_id: string;
    role: string;
    salary: string;
    wage: string;
    username: string;
    password_hash: string;
    email: string;
    created_at: string;
}

export interface ICreateStaffBody {
    name: string;
    gender: string;
    birthday: string;
    image_url: File | null;
    phone: string;
    citizen_id: string;
    role: string;
    salary: string;
    wage: string;
    username: string;
    password_hash: string;
    email: string;
}

export interface IDeleteStaffResponse {
    message: string;
}

export interface IUpdateStaffBody extends Partial<ICreateStaffBody> {}
