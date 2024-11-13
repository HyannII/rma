export interface ILogin {
    username: string;
    password: string;
}

export interface ILoginResponse {
    id: number;
    email: string;
    username: string;
    role: string;
    accessToken: string;
    refreshToken: string;
}

export interface IUserInfo {
    id: number;
    email: string;
    username: string;
    role: string;
}

export interface IRefreshToken {
    refreshToken: string;
}
