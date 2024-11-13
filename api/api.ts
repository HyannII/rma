import axios, { AxiosInstance } from "axios";
import { toast } from "react-toastify";
import { RefreshTokenApi } from "./auth.api";

const BASE_URL = "http://localhost:5001/api";

class Api {
    apiInstance: AxiosInstance;
    refreshTokenPromise: Promise<any> | null = null;
    constructor() {
        // const accessToken = localStorage.getItem("accessToken");
        this.apiInstance = axios.create({
            baseURL: BASE_URL,
            timeout: 1000 * 10 * 10,
            headers: {
                "Content-Type": "application/json",
                // Authorization: accessToken ? `Bearer ${accessToken}` : "",
            },
        });
        this.initRequestInterceptor();
        this.initResponseInterceptor();
    }

    private initRequestInterceptor() {
        this.apiInstance.interceptors.request.use(
            (config) => {
                const accessToken = localStorage.getItem("accessToken");
                console.log("accessToken in request: ", accessToken);

                // Thêm header Authorization vào config của từng request
                if (accessToken) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
                return config;
            },
            (error) => Promise.reject(error)
        );
    }

    private initResponseInterceptor() {
        this.apiInstance.interceptors.response.use(
            (response) => response,
            (error) => this.handleResponseError(error)
        );
    }

    private async handleResponseError(error: any) {
        const originRequest = error.config;

        if (error.response?.status === 401) {
            window.location.href = "/login";
            return Promise.reject(error);
        }

        // Kiểm tra lỗi 410, yêu cầu refresh token
        if (error.response?.status === 410 && originRequest) {
            if (!this.refreshTokenPromise) {
                const refreshToken = localStorage.getItem(
                    "refreshToken"
                ) as string;

                // Gọi API refresh token
                this.refreshTokenPromise = await RefreshTokenApi({
                    refreshToken,
                })
                    .then((res) => {
                        const accessToken = res.data.accessToken;
                        // Lưu lại accessToken mới vào localStorage
                        console.log(
                            "New Access Token after get from api refreshToken: ",
                            accessToken
                        );
                        localStorage.setItem("accessToken", accessToken);
                        // Cập nhật lại header Authorization cho axios
                        this.apiInstance.defaults.headers.Authorization = `Bearer ${accessToken}`;
                    })
                    .catch((err) => {
                        // console.log("Error refreshing token:", err);
                        // Đưa người dùng quay lại trang login
                        localStorage.removeItem("accessToken");
                        localStorage.removeItem("refreshToken");
                        localStorage.removeItem("userInfo");
                        window.location.href = "/login";
                        toast.error(
                            "Phiên đăng nhập đã kết thúc. Vui lòng đăng nhập lại!"
                        );
                        return Promise.reject(err);
                    })
                    .finally(() => {
                        // Reset promise refreshToken
                        this.refreshTokenPromise = null;
                    });
            }
            return this.refreshTokenPromise.then(() => {
                // Sau khi refresh token thành công, gửi lại request ban đầu
                originRequest.headers.Authorization = `Bearer ${localStorage.getItem(
                    "accessToken"
                )}`;
                return this.apiInstance(originRequest); // Gửi lại request
            });
        }

        if (error.response?.status === 403) {
            toast.error(
                "Bạn không có quyền truy cập vào trang này. Vui lòng kiểm tra quyền hạn của bạn."
            );
        }
        // Hiển thị thông báo lỗi nếu không phải lỗi 410
        if (error.response?.status !== 410) {
            toast.error(error.response?.data?.message || error.message);
            return;
        }

        return Promise.reject(error);
    }
}

const api = new Api();
export default api.apiInstance;
