import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchAdminProducts } from "../Redux/slices/adminProductSlice";
import { fetchAllOrders } from "../Redux/slices/adminOrderSlice";

function AdminHomepage() {
  const dispatch = useDispatch();
  const {
    products = [],
    loading: productsLoading,
    error: productsError,
  } = useSelector((state) => state.adminProducts || {});

  const {
    orders = [],
    totalOrders,
    totalSales,
    loading: ordersLoading,
    error: ordersError,
  } = useSelector((state) => state.adminOrders);

  useEffect(() => {
    dispatch(fetchAdminProducts());
    dispatch(fetchAllOrders());
  }, [dispatch]);

  return (
    <div className="w-full min-h-screen bg-gray-50 p-6">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h1>
      {productsLoading || ordersLoading ? (
        <p> Loading...</p>
      ) : productsError ? (
        <p className="text-red-500">
          {" "}
          Error fetching products: {productsError}
        </p>
      ) : ordersError ? (
        <p className="text-red-500"> Error fetching orders: {ordersError} </p>
      ) : (
        // {/* Dashboard Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white shadow-md rounded-2xl">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">
              Revenue
            </h2>
            <p className="text-3xl font-bold text-gray-800">
              {totalSales.toFixed(2)}
            </p>
          </div>

          <div className="p-6 bg-white shadow-md rounded-2xl">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">
              Total Orders
            </h2>
            <p className="text-3xl font-bold text-gray-800">{totalOrders} </p>
            <Link
              to="/admin/orders"
              className="inline-block mt-2 text-sm text-blue-600 hover:underline"
            >
              Manage orders
            </Link>
          </div>

          <div className="p-6 bg-white shadow-md rounded-2xl">
            <h2 className="text-lg font-semibold text-gray-600 mb-2">
              Total Products
            </h2>
            <p className="text-3xl font-bold text-gray-800">
              {products.length}
            </p>
            <Link
              to="/admin/products"
              className="inline-block mt-2 text-sm text-blue-600 hover:underline"
            >
              Manage products
            </Link>
          </div>
        </div>
      )}
      {/* Recent Orders */}
      <div className="mt-10">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">Recent Orders</h2>
        <div className="overflow-x-auto bg-white rounded-xl shadow-md">
          <table className="min-w-full text-sm text-gray-700">
            <thead className="bg-gray-100 text-xs uppercase text-gray-500">
              <tr>
                <th className="py-3 px-4 text-left">Order ID</th>
                <th className="py-3 px-4 text-left">User</th>
                <th className="py-3 px-4 text-left">Total Price</th>
                <th className="py-3 px-4 text-left">Status</th>
              </tr>
            </thead>
            <tbody>
              {orders.length > 0 ? (
                orders.map((order) => (
                  <tr
                    key={order._id}
                    className="border-t hover:bg-gray-50 transition-colors"
                  >
                    <td className="p-4">{order._id}</td>
                    <td className="p-4">{order?.user?.name || "Admin"}</td>
                    <td className="p-4">${order.totalPrice}</td>
                    <td className="p-4">{order.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={4} className="p-4 text-center text-gray-500">
                    No recent orders found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default AdminHomepage;
