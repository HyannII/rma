"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import DashboardWrapper from "./dashboardWrapper";
import MuiXLicense from "./MuiXLicense";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import "dayjs/locale/vi";
import { viVN } from "@mui/x-date-pickers/locales";

const inter = Inter({ subsets: ["latin"] });

// Create a client
const queryClient = new QueryClient();

export default function RootLayout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <html lang="en">
            <body className={inter.className}>
                <QueryClientProvider client={queryClient}>
                    <LocalizationProvider
                        dateAdapter={AdapterDayjs}
                        adapterLocale="vi"
                        localeText={
                            viVN.components.MuiLocalizationProvider.defaultProps
                                .localeText
                        }
                    >
                        <DashboardWrapper>{children}</DashboardWrapper>
                    </LocalizationProvider>
                </QueryClientProvider>
                <MuiXLicense />
            </body>
        </html>
    );
}
