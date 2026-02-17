import React, { useState } from "react";
import { FaBars } from "react-icons/fa";
import { Outlet } from "react-router-dom";
import AdminSidebar from "./AdminSidebar";

function AdminLayout() {
  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      {/* Mobile navbar */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-30 bg-gray-900 text-white p-4 flex justify-between items-center">
        <button onClick={toggleSidebar}>
          <FaBars size={24} />
        </button>
        <h1 className="text-xl font-semibold">Admin Dashboard</h1>
      </div>

      {/* Overlay for mobile sidebar */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 z-20 bg-black bg-opacity-50 md:hidden"
          onClick={toggleSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`bg-gray-900 text-white w-64 min-h-screen p-4 z-30 transition-transform duration-300 fixed md:relative md:translate-x-0 ${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <AdminSidebar />
      </div>

      {/* Main content */}
      <div className="flex-1 p-6 mt-16 md:mt-0 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
}

export default AdminLayout;
