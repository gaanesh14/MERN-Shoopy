import React from "react";
import { RiDeleteBin3Line } from "react-icons/ri";
import { useDispatch } from "react-redux";
import { removeFromCart, updateCartItemQuantity } from "../../Redux/slices/cartSlice";
import { toast } from "sonner";


function CartContents({cart, userId, guestId}) {
  const dispatch = useDispatch();

  // Handle adding or substracting to cart.
  const handleAddToCart = (productId, delta, quantity, size,color) => {
    const newQuantity = quantity + delta;
    if(newQuantity >= 1){
      dispatch(
        updateCartItemQuantity({
          productId,
          quantity: newQuantity,
          guestId,
          userId,
          size,
          color
        })
      )
    }
  }
 
  const handleRemoveFromCart = (productId,size,color) => {
    dispatch(removeFromCart({productId,guestId,userId,size,color}))
    toast.success("Product Successfully removed from cart!",{duration:"1000"})
       
  }
  const formatPrice = (value) => {
  const num = Number(value);
  const str = String(value);

  // Check if there are decimals
  if (str.includes(".")) {
    const [intPart, decPart] = str.split(".");

    // More than 2 decimals → return integer only
    if (decPart.length > 2) {
      return Number(intPart).toLocaleString("en-US");
    }

    // 1 decimal → pad to 2
    if (decPart.length === 1) {
      return `${Number(intPart).toLocaleString("en-US")}.${decPart}0`;
    }

    // 2 decimals → keep as is
    return `${Number(intPart).toLocaleString("en-US")}.${decPart}`;
  }

  // No decimals → add .00
  return `${Number(str).toLocaleString("en-US")}.00`;
};


  return (
    <div>
      {cart?.products?.map((item, id) => (
        <div
          key={id}
          className="flex justify-between py-4 border-b text-sm"
        >
          <div className="flex items-start">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-24 sm:w-20 sm:h-24 object-cover mr-4 rounded"
            />
            <div>
              <h3> {item.name}</h3>
              <p className="text-sm text-gray-500">
                color:{item.color} | size: {item.size}
              </p>
              <div className="flex items-start mt-4">
                <button className="border rounded text-sm size-6 font-semibold"
                  onClick={() => handleAddToCart(
                   item.productId,
                   -1,
                   item.quantity,
                   item.size,
                   item.color
                  )}
                >
                  {" "}
                  -{" "}
                </button>
                <span className="mx-4"> {item.quantity} </span>
                <button className="border rounded text-sm size-6 font-semibold"
                  onClick={() => handleAddToCart(
                   item.productId,
                   1,
                   item.quantity,
                   item.size,
                   item.color
                  )}
                >
                  {" "}
                  +{" "}
                </button>
              </div>
            </div>
          </div>
          <div className="items-center">
            <p className="font-sm"> $ {formatPrice(item.price)}</p>
            <button 
             onClick={ () => 
             handleRemoveFromCart(
              item.productId, 
              item.size,
              item.color
              )}
            >
              <RiDeleteBin3Line className="h-6 w-6 mt-2 ml-6 text-red-600" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}

export default CartContents;
