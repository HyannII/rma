"use client";

import { Inter } from "next/font/google";
import "./globals.css";
import DashboardWrapper from "./dashboardWrapper";
import MuiXLicense from "./MuiXLicense";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

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
          <DashboardWrapper>{children}</DashboardWrapper>
        </QueryClientProvider>
        <MuiXLicense />
      </body>
    </html>
  );
}
