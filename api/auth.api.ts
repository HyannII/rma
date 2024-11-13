import {
    ILogin,
    ILoginResponse,
    IRefreshToken,
} from "../interfaces/auth.interface";
import api from "./api";

export const LoginAPI = async (loginForm: ILogin) => {
    const res = await api.post<ILoginResponse>("auth/login", {
        username: loginForm.username,
        password: loginForm.password,
    });
    return res.data;
};

export const RefreshTokenApi = async (token: string) => {
    return await api.put<IRefreshToken>("/auth/refresh_token", token);
};
