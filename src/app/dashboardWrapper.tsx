"use client";

import React, { useEffect } from "react";
import { usePathname } from "next/navigation"; // Đảm bảo import đúng
import Navbar from "@/app/(components)/Navbar";
import Sidebar from "@/app/(components)/Sidebar";
import StoreProvider, { useAppSelector } from "./redux";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { ToastContainer, Bounce } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
const DashboardLayout = ({ children }: { children: React.ReactNode }) => {
    const pathname = usePathname();
    const isLoginPage = pathname === "/login";

    const isSidebarCollapsed = useAppSelector(
        (state) => state.global.isSidebarCollapsed
    );
    const isDarkMode = useAppSelector((state) => state.global.isDarkMode);

    useEffect(() => {
        if (isDarkMode) {
            document.documentElement.classList.add("dark");
        } else {
            document.documentElement.classList.add("light");
        }
    }, [isDarkMode]);

    return (
        <div
            className={`${
                isDarkMode ? "dark" : "light"
            } flex bg-gray-50 text-gray-900 w-full min-h-screen`}
        >
            {!isLoginPage ? (
                <>
                    <Sidebar />
                    <main
                        className={`flex flex-col w-full h-full py-7 px-9 bg-gray-50 ${
                            isSidebarCollapsed ? "md:pl-24" : "md:pl-72"
                        }`}
                    >
                        <Navbar />
                        {children}
                    </main>
                </>
            ) : (
                <main className="flex flex-col w-full h-full bg-gray-50">
                    {children}
                </main>
            )}
        </div>
    );
};

interface ToastProviderProps {
    children: React.ReactNode;
}

function ToastProvider({ children }: ToastProviderProps) {
    return (
        <>
            {children}
            <ToastContainer
                position="top-center"
                autoClose={2000}
                hideProgressBar
                newestOnTop={false}
                closeOnClick={false}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover
                theme="colored"
                transition={Bounce}
            />
        </>
    );
}

const DashboardWrapper = ({ children }: { children: React.ReactNode }) => {
    const queryClient = new QueryClient();
    useEffect(() => {
        if (typeof window === "undefined") return;

        const userInfo = localStorage.getItem("userInfo");
        const currentPath = window.location.pathname;

        if (currentPath !== "/login" && !userInfo) {
            // Nếu chưa đăng nhập và không ở trang login
            window.location.href = "/login";
        } else if (currentPath === "/login" && userInfo) {
            // Nếu đã đăng nhập và đang ở trang login
            window.location.href = "/dashboard"; // Chuyển đến dashboard hoặc trang chủ nếu đã đăng nhập
        }
    }, []);

    return (
        <QueryClientProvider client={queryClient}>
            <StoreProvider>
                <ToastProvider>
                    <DashboardLayout>{children}</DashboardLayout>
                </ToastProvider>
            </StoreProvider>
            <ReactQueryDevtools />
        </QueryClientProvider>
    );
};

export default DashboardWrapper;
