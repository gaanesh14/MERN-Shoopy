import React from "react";
import { IoMdClose } from "react-icons/io";
import CartContents from "../cart/CartContents";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";

function CartDrawer({ drawerOpen, toggleCartDrawer }) {
  const navigate = useNavigate();
  const { user, guestId } = useSelector((state) => state.auth);
  const { cart } = useSelector((state) => state.cart);
  const userId = user ? user._id : null;
  const handleCheckOut = () => {
    toggleCartDrawer();
    if (!user) {
      navigate("/login?redirect=checkout");
    } else {
      navigate("/checkout");
    }
  };
  return (
    <div
      className={`fixed top-0 right-0 w-3/4 sm:w-1/2 md:w-[24rem] h-full bg-white shadow-lg transform transition-transform duration-300 flex flex-col z-50   
       ${drawerOpen ? "translate-x-0" : "translate-x-full"}`}
    >
      {/* {close button} */}
      <div className="flex justify-end p-4">
        <button onClick={toggleCartDrawer}>
          <IoMdClose className="h-6 w-6 text-gray-600" />
        </button>
      </div>
      {/* {Cart heading} */}
      <div className="flex-grow p-4 overflow-y-auto">
        <h2 className="text-xl font-semibold mb-4"> Your Cart </h2>
        {cart && cart?.products?.length > 0 ? (
          <CartContents cart={cart} userId={userId} guestId={guestId} />
        ) : (
          <p> Your Cart is empty..</p>
        )}
      </div>

      <div className="p-4 bg-white bottom-0 sticky">
        {cart && cart?.products?.length > 0 && (
          <>
            <button
              className="w-full bg-black text-white py-3 hover:bg-grey-800 font-semibold rounded-lg transition"
              onClick={handleCheckOut}
            >
              Checkout
            </button>
            <p className="text-sm text-center mt-2 tracking-tighter text-grey-600">
              {" "}
              shipping, taxes and discount codes calculate at check out{" "}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default CartDrawer;
