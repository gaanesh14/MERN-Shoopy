import React, { useEffect} from "react";
import { useDispatch,useSelector } from "react-redux";
import { fetchOrderDetails } from "../Redux/slices/orderSlice";
import { useParams, Link } from "react-router-dom";

function OrderDetailspage({}) {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { orderDetails, loading, error } = useSelector((state) => state.orders);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderDetails(id));
    } 
  }, [dispatch, id]);

  if (loading) return <p> Loading order details...</p>;
  if (error) return <p> Error: {error} </p>;
  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <h2 className="text-2xl md:text-3xl font-bold mb-6"> Oreder Details</h2>
      {!orderDetails ? (
        <p> NO Order Details Found</p>
      ) : (
        <div className="p-4 sm:p-6 rounded-lg border">
          <div className="flex flex-row sm:flex-col justify-between  mb-6">
            <div>
              <h3 className="text-lg md:text-xl font-semibold">
                Order ID : #{orderDetails._id}
              </h3>
              <p className="text-gray-600">
                {new Date(orderDetails.createdAt).toLocaleDateString()}
              </p>
             </div>
              <div className="flex flex-col items-start sm:items-end  justify-start mt-4 sm:mt-0">
                <span 
                  className={`${
                    orderDetails.isPaid
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  } 
                          px-3  rounded-full text-sm font-medium mb-2`}
                >
                   Payment: {orderDetails.isPaid ? "Approved" : "Pending"}
                </span>
                <span
                  className={`${
                    orderDetails.isDelivered
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  } 
                          px-3 rounded-full text-sm font-medium mb-2`}
                >
                  Delivary Status:{orderDetails.isDelivered ? "Delivered" : "Pending"}
                </span>
              </div>
            </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold mb-2"> Payment Info</h4>
              <p> Payment Method: {orderDetails ? orderDetails.paymentMethod : "cash on delivery"} </p>
              <p> Status : {orderDetails.isPaid ? "paid" : "unPaid "}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2"> Shipping Info</h4>
              <p> Shipping Method: {orderDetails.shippingMethod || "open box"} </p>
              <p>
                Address :{""}
                {`${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.countery}`}
              </p>
            </div>
          </div>
          {/* {Product List} */}
          <div className="overflow-x-auto">
            <h4 className="text-lg font-semibold mb-4"> Products </h4>
            <table className="min-w-full text-gray-600 mb-4 border-collapse">
              <thead className="bg-gray-600 text-white">
                <tr>
                  <th className="py-2 px-2 w-1/5 text-left"> Image </th>
                  <th className="py-2 px-2 w-1/4 text-left"> Name </th>
                  <th className="py-2 px-2 w-1/5 text-left"> Unit price </th>
                  <th className="py-2 px-2 w-1/5 text-left"> Quantity </th>
                  <th className="py-2 px-2 w-1/5 text-left"> Total </th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.orderItems.map((item) => (
                  <tr key={item.productId} className="border-b">
                    <td className="px-2 py-2">
                      <div className="flex items-center">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg"
                        loading="lazy"
                      />
                      <Link
                        to={`/product/${item.productId}`}
                        className="text-blue-500 hover:underline"
                      >
                      </Link>
                      </div>
                    </td>
                    <td className="py-2 px-2"> {item.name}</td>
                    <td className="py-2 px-2 text-black"> ${item.price} </td>
                    <td className="py-2 px-2"> {item.quantity} </td>
                    <td className="py-2 px-2">
                      {" "}
                      ${item.price * item.quantity}{" "}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Link to="/my-orders" className="text-blue-500 hover:underline">
            Back to My Orders
          </Link>
        </div>
      )}
    </div>
  );
}

export default OrderDetailspage;
