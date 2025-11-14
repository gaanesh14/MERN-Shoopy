import React from "react";
import MyOrderPages from "./MyOrderPages";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { logOut } from "../Redux/slices/authSlice";
import { clearCart } from "../Redux/slices/cartSlice";

function Profile() {
  const {user} = useSelector((state) => state.auth);
  const navigate = useNavigate()
  const dispatch = useDispatch();

  useEffect(() => {
    if(!user){
      navigate("/login");
    }
  },[user,navigate])

  const handleLogout = () => {
    dispatch(logOut());
    dispatch(clearCart());
    navigate("/login")
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-grow container mx-auto p-4 md:p-6">
        <div className="flex flex-col md:flex-row md:space-x-6 space-y-6 md:space-y-0">
          {/* {Left section} */}
          <div className="w-full md:w-1/3 lg:w-1/4 shadow-md rounded-lg p-6">
            <h1 className="text-2xl md:text-3xl font-bold mb-4">{user?.name} </h1>
            <p className="text-lg text-gray-600 mb-4"> {user?.email} </p>
            <button 
              onClick={handleLogout}
              className="w-full bg-red-500 text-white py-1 px- rounded hover:bg-red-600">
              Logout
            </button>
          </div>
          {/* {right section} */}
          <div className="w-full md:w-2/3 lg:w-3/4">
            <MyOrderPages />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Profile;
