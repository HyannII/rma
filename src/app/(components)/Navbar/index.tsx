"use client";

import { Menu, Moon, Settings, Sun } from "lucide-react";
import React from "react";
import Link from "next/link";
import { useAppDispatch, useAppSelector } from "@/app/redux";
import { setIsDarkMode, setIsSidebarCollapsed } from "../../../state";



const Navbar = () => {
  const dispatch = useAppDispatch();
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
              <Sun className="cursor-pointer text-gray-500" size={24}></Sun>
            ) : (
              <Moon className="cursor-pointer text-gray-500" size={24}></Moon>
            )}
          </button>
          <Link href="/" className="px-3">
            <Settings className="cursor-pointer text-gray-500" size={24} />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
