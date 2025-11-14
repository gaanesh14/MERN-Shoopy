import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
// import men1 from "../assets/mens collection/mens1.jpg";
// import men2 from "../assets/mens collection/mens2.jpg";

function OrderDetailspage() {
  const { id } = useParams();
  const [orderDetails, setOrderDetails] = useState(null);

  useEffect(() => {
    const mockOrderdetails = {
      _id: id,
      createedAt: new Date(),
      isPaid: true,
      isDelivered: false,
      paymentMethod: "payPal",
      shippingMethod: "Standard",
      shippingAddress: { city: "New York", countery: "USA" },
      orderItems: [
        {
          productId: 1,
          name: "sweatshirt",
          price: 120,
          quantity: 1,
          //image: men2,
        },
        {
          productId: 2,
          name: "shirt",
          price: 100,
          quantity: 2,
          //image: men1,
        },
      ],
    };
    setOrderDetails(mockOrderdetails);
  }, [id]);
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
                {new Date(orderDetails.createedAt).toLocaleDateString()}
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
                  {orderDetails.isPaid ? "Approved" : "Pending"}
                </span>
                <span
                  className={`${
                    orderDetails.isDelivered
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  } 
                          px-3 rounded-full text-sm font-medium mb-2`}
                >
                  {orderDetails.isDelivered ? "Delivered" : "Pending"}
                </span>
              </div>
            </div>
          <div className="grid grid-cols-1 sm:grid-col-2 md:grid-cols-3 gap-8 mb-8">
            <div>
              <h4 className="text-lg font-semibold mb-2"> Payment Info</h4>
              <p> Payment Method: {orderDetails.paymentMethod} </p>
              <p> Status : {orderDetails.isPaid ? "paid" : "unPaid "}</p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-2"> Shipping Info</h4>
              <p> Shipping Method: {orderDetails.shippingMethod} </p>
              <p>
                Address :{""}
                {`${orderDetails.shippingAddress.city}, ${orderDetails.shippingAddress.countery}`}
              </p>
            </div>
          </div>
          {/* {Product List} */}
          <div className="overflow-x-auto">
            <h4 className="text-lg font-semibold mb-4"> Products </h4>
            <table className="min-w-full text-gray-600 mb-4">
              <thead className="bg-gray-600 text-white">
                <tr>
                  <th className="py-2 px-2"> Name </th>
                  <th className="py-2 px-2"> Unit price </th>
                  <th className="py-2 px-2"> Quantity </th>
                  <th className="py-2 px-2"> Total </th>
                </tr>
              </thead>
              <tbody>
                {orderDetails.orderItems.map((item) => (
                  <tr key={item.productId} className="border-b">
                    <td className="py-2 px-4 flex items-center ">
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-12 h-12 object-cover rounded-lg mr-4"
                        loading="lazy"
                      />
                      <Link
                        to={`/product/${item.productId}`}
                        className="text-blue-500 hover:underline"
                      >
                        {item.name}
                      </Link>
                    </td>
                    <td className="py-2 px-4 text-black"> ${item.price} </td>
                    <td className="py-2 px-4"> ${item.quantity} </td>
                    <td className="py-2 px-4">
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
