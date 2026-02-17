import React, { useState } from "react";
import { Link } from "react-router-dom";
import { HiOutlineUser } from "react-icons/hi2";
import { HiOutlineShoppingBag } from "react-icons/hi2";
import { HiBars3 } from "react-icons/hi2";
import Searchbar from "./Searchbar";
import CartDrawer from "../Layout/CartDrawer";
import { IoMdClose } from "react-icons/io";
import logo from "../../assets/bgs/logo3.png";
import { useSelector } from "react-redux";

function Navbar() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [navDrawerOpen, setNavDrawerOpen] = useState(false);
  const { cart } = useSelector((state) => state.cart);
  const { user } = useSelector((state) => state.auth);

  const cartItemCount =
    cart?.products?.reduce((total, product) => total + product.quantity, 0) ||
    0;

  const toggleNavDrawer = () => {
    setNavDrawerOpen(!navDrawerOpen);
  };

  const toggleCartDrawer = () => {
    setDrawerOpen(!drawerOpen);
    // console.log('open');
  };
  return (
    <div>
      <nav className="fixed top-0 left-0 w-full bg-gray-100 shadow-md z-50">
        <div className="container mx-auto flex items-center justify-between px-2 py-2"> 
        {/* {Logo-left} */}
        <div>
          <img src={logo} alt="logo" className="w-10 h-8 rounded-lg ml-4" />
          <Link to="/" className="text-lg font-medium text-blue-500">
            {" "}
            Shoopy{" "}
          </Link>
        </div>
        {/* {center- navigation bar} */}
        <div className="hidden md:flex space-x-4">
          <Link
            to="/collections/all?gender=Men"
            className="text-gray-800 hover:text-blue-600 text-sm font-medium uppercase"
          >
            {" "}
            Men{" "}
          </Link>
          <Link
            to="/collections/all?gender=Women"
            className="text-gray-800 hover:text-blue-600 text-sm font-medium uppercase"
          >
            {" "}
            Women{" "}
          </Link>
          <Link
            to="/collections/all?category=Top Wear"
            className="text-gray-800 hover:text-blue-600 text-sm font-medium uppercase"
          >
            {" "}
            TopWear{" "}
          </Link>
          <Link
            to="/collections/all?category=Bottom Wear"
            className="text-gray-800 hover:text-blue-600 text-sm font-medium uppercase"
          >
            {" "}
            BottomWear{" "}
          </Link>
        </div>
        {/* {Right Icons} */}
        <div className="flex items-center space-x-4 ">
          {user && user.role === "admin" && (
            <Link
              to="/admin"
              className="block bg-black px-2 rounded text-sm text-white"
            >
              {" "}
              Admin{" "}
            </Link>
          )}

          <Link to="/profile" className="hover:text-black">
            <HiOutlineUser className="h-6 w-6 text-gray-700 hover:text-blue-600" />
          </Link>
          <div className="overflow-hidden">
            <Searchbar className="hover:bg-gray-200" />
          </div>
          <button
            onClick={toggleCartDrawer}
            className="relative hover:text-black"
          >
            <HiOutlineShoppingBag className="h-6 w-6 text-gray-700 hover:text-blue-500" />
            {cartItemCount > 0 && (
              <span className="absolute -top-4 -right-3 bg-rabbit-red text-white text-sm rounded-full px-2 py-0.5">
                {cartItemCount}
              </span>
            )}
          </button>
          <button onClick={toggleNavDrawer} className="md:hidden">
            <HiBars3 className="h-6 w-6 text-gray-600" />
          </button>
        </div>
      </div>
      </nav>
      <CartDrawer drawerOpen={drawerOpen} toggleCartDrawer={toggleCartDrawer} />

      {/* {Mobile Navigation} */}
      <div
        className={`fixed top-0 left-0 w-3/4 sm:w-1/2 md:w-1/3 h-full bg-white shadow-lg transform transition-transform duration-300 z-50 
       ${navDrawerOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <div className="flex justift-end p-4">
          <button onClick={toggleNavDrawer}>
            <IoMdClose className="h-6 w-6 text-gray-600" />
          </button>
        </div>
        <div className="p-4">
          <h2 className="text-xl font-semibold mb-4"> Menu </h2>
          <nav className="space-y-4">
            <Link
              to="/collections/all?gender=Men"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              {" "}
              Men{" "}
            </Link>
            <Link
              to="/collections/all?gender=Women"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              {" "}
              Women{" "}
            </Link>
            <Link
              to="/collections/all?category=Top Wear"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              {" "}
              Top wear{" "}
            </Link>
            <Link
              to="/collections/all?category=Bottom Wear"
              onClick={toggleNavDrawer}
              className="block text-gray-600 hover:text-black"
            >
              {" "}
              Bottom wear{" "}
            </Link>
          </nav>
        </div>
      </div>
    </div>
  );
}

export default Navbar;
