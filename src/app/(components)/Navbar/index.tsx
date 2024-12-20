"use client";

import { useAppDispatch, useAppSelector } from "@/app/redux";
import { LogOut, Menu, Moon, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";
import { setIsDarkMode, setIsSidebarCollapsed } from "../../../state";

const Navbar = () => {
    const dispatch = useAppDispatch();
    const router = useRouter();

    const isSidebarCollapsed = useAppSelector(
        (state) => state.global.isSidebarCollapsed
    );
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    const toggleSidebar = () => {
        dispatch(setIsSidebarCollapsed(!isSidebarCollapsed));
    };

    const toggleDarkMode = () => {
        dispatch(setIsDarkMode(!isDarkMode));
    };

    const handleLogout = () => {
        // Hiển thị hộp thoại xác nhận đăng xuất
        const confirmLogout = window.confirm(
            "Bạn có chắc chắn muốn đăng xuất?"
        );
        if (!confirmLogout) return; // Hủy đăng xuất nếu người dùng chọn Cancel

        // Xóa token và thông tin người dùng khỏi localStorage
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        localStorage.removeItem("userInfo");

        toast.success("Đăng xuất thành công!");
        // Điều hướng về trang đăng nhập
        router.push("/login");
    };

    return (
        <div className="flex justify-between items-center w-full mb-7">
            {/* LEFT SIDE */}
            <div className="flex justify-between items-center gap-5">
                <button
                    className="px-3 py-3 bg-gray-100 rounded-full hover:bg-blue-100"
                    onClick={toggleSidebar}
                >
                    <Menu className="w-4 h-4" />
                </button>
            </div>

            {/* RIGHT SIDE */}
            <div className="flex justify-between items-center gap-5">
                <div className="flex">
                    <button onClick={toggleDarkMode} className="px-3">
                        {!isDarkMode ? (
                            <Sun
                                className="cursor-pointer text-gray-500"
                                size={24}
                            />
                        ) : (
                            <Moon
                                className="cursor-pointer text-gray-500"
                                size={24}
                            />
                        )}
                    </button>
                    {/* Logout Button */}
                    <button onClick={handleLogout} className="px-3">
                        <LogOut
                            className="cursor-pointer text-gray-500"
                            size={24}
                        />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Navbar;
