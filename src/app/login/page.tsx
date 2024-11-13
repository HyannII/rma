// components/LoginForm.tsx
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { toast } from "react-toastify";
import { LoginAPI } from "../../../api/auth.api";
import { ILogin, IUserInfo } from "../../../interfaces/auth.interface";

export default function Login() {
    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ILogin>();

    const togglePasswordVisibility = () => {
        setShowPassword(!showPassword);
    };

    const onSubmit: SubmitHandler<ILogin> = async (data) => {
        const response = await LoginAPI(data);
        const userInfo: IUserInfo = {
            id: response.id,
            email: response.email,
            username: response.username,
            role: response.role,
        };
        const accessToken: string = response.accessToken;
        const refreshToken: string = response.refreshToken;
        localStorage.setItem("accessToken", accessToken);
        localStorage.setItem("refreshToken", refreshToken);
        localStorage.setItem("userInfo", JSON.stringify(userInfo));
        router.push("/dashboard");
        toast.success("Đăng nhập thành công!");
    };

    return (
        <div
            className="flex items-center justify-center min-h-screen bg-gray-100"
            style={{
                backgroundImage:
                    "url('https://images.unsplash.com/photo-1485182708500-e8f1f318ba72')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-lg z-20">
                <h2 className="text-2xl font-bold text-center text-gray-800">
                    Đăng nhập
                </h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                    <div>
                        <label className="block text-gray-600">
                            Tên tài khoản
                        </label>
                        <input
                            type="text"
                            {...register("username", {
                                required: "Username is required",
                            })}
                            className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your username"
                        />
                        {errors.username && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.username.message}
                            </p>
                        )}
                    </div>

                    <div className="relative">
                        <label className="block text-gray-600">Mật khẩu</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            {...register("password", {
                                required: "Password is required",
                            })}
                            className="w-full p-2 mt-1 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                        />
                        <button
                            type="button"
                            onClick={togglePasswordVisibility}
                            className="absolute right-3 top-1/2 transform -translate-y-1/16 text-gray-600"
                        >
                            {showPassword ? (
                                <AiFillEyeInvisible size={30} />
                            ) : (
                                <AiFillEye size={30} />
                            )}
                        </button>
                        {errors.password && (
                            <p className="mt-1 text-sm text-red-600">
                                {errors.password.message}
                            </p>
                        )}
                    </div>

                    <button
                        type="submit"
                        className="w-full py-2 text-white bg-blue-500 rounded hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
}
