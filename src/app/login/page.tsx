// components/LoginForm.tsx
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { AiFillEye, AiFillEyeInvisible } from "react-icons/ai";
import { toast } from "react-toastify";
import { LoginAPI } from "../../../api/auth.api";
import { ILogin, IUserInfo } from "../../../interfaces/auth.interface";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ILogin>();

  const [isLoading, setIsLoading] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const onSubmit: SubmitHandler<ILogin> = async (data) => {
    setIsLoading(true); // Bắt đầu loading
    try {
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
    } catch (error) {
      toast.error("Đăng nhập thất bại. Vui lòng thử lại!");
    } finally {
      setIsLoading(false); // Kết thúc loading
    }
  };
  const labelCssStyles = "block text-sm font-medium text-gray-700";
  const inputCssStyles =
    "block w-full mb-2 p-2 border-gray-500 border-2 rounded-md text-zinc-800";

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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <div>
            <label className={labelCssStyles}>Tên tài khoản</label>
            <input
              type="text"
              {...register("username", {
                required: "Username is required",
              })}
              className={inputCssStyles}
              placeholder=""
            />
            {errors.username && (
              <p className="mt-1 text-sm text-red-600">
                {errors.username.message}
              </p>
            )}
          </div>

          <div className="relative">
            <label className={labelCssStyles}>Mật khẩu</label>
            <input
              type={showPassword ? "text" : "password"}
              {...register("password", {
                required: "Password is required",
              })}
              className={inputCssStyles}
              placeholder=""
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute right-3 top-1/2 transform -translate-y-1/16 text-gray-600"
            >
              {showPassword ? <Eye color="black" /> : <EyeOff color="black" />}
            </button>
            {errors.password && (
              <p className="mt-1 text-sm text-red-600">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className={`w-full py-2 text-white rounded focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isLoading
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={isLoading} // Vô hiệu hóa nút khi đang tải
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg
                  className="w-5 h-5 mr-2 text-white animate-spin"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8v8H4z"
                  ></path>
                </svg>
                Đang tải...
              </div>
            ) : (
              "Đăng nhập"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
