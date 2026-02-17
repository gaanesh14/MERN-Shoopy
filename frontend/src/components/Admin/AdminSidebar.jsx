import React from "react";
import {
  FaBoxOpen,
  FaClipboardList,
  FaSignOutAlt,
  FaStore,
  FaUser,
} from "react-icons/fa";
import { useDispatch } from "react-redux";
import { NavLink, useNavigate, Link } from "react-router-dom";
import { logOut } from "../../Redux/slices/authSlice";
import { clearCart } from "../../Redux/slices/cartSlice";

function AdminSidebar() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logOut());
    dispatch(clearCart());
    navigate("/");
  };
  return (
    <div className="p-6">
      <div className="mb-6">
        <Link to="/admin" className="text-2xl font-medium">
          {" "}
          Shoopy{" "}
        </Link>
      </div>
      <h2 className="text-xl font-medium mb-6 text-center"> Admin Dashboard</h2>
      <nav className="flex flex-col space-y-2">
        <NavLink
          to="users"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
              : " text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
          }
        >
          <FaUser />
          <span> Users </span>
        </NavLink>
        <NavLink
          to="products"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
              : " text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
          }
        >
          <FaBoxOpen />
          <span> Products </span>
        </NavLink>
        <NavLink
          to="orders"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
              : " text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
          }
        >
          <FaClipboardList />
          <span> Orders </span>
        </NavLink>
        <NavLink
          to="/"
          className={({ isActive }) =>
            isActive
              ? "bg-gray-700 text-white py-3 px-4 rounded flex items-center space-x-2"
              : " text-gray-300 hover:bg-gray-700 hover:text-white py-3 px-4 rounded flex items-center space-x-2"
          }
        >
          <FaStore />
          <span> Shop </span>
        </NavLink>
      </nav>
      <div className="mt-6">
        <button
          onClick={handleLogout}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded flex items-center justuify-center space-x-2"
        >
          <FaSignOutAlt />
          <span> Logout </span>
        </button>
      </div>
    </div>
  );
}

export default AdminSidebar;
