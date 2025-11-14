import React, { useState,useEffect } from "react";
import { Link,useNavigate,useLocation } from "react-router-dom";
import register from "../assets/assets/w-top2.webp";
import {registerUser} from '../Redux/slices/authSlice'
import { useDispatch,useSelector } from "react-redux";
import { mergeCart } from "../Redux/slices/cartSlice";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation();
  const {user, guestId} = useSelector((state) => state.auth);
  const {cart} = useSelector((state) => state.cart);

  // Get redirected parameters and check if it's checkout or something
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckOutRedirect = redirect.includes("checkout");

  useEffect(() => {
    if(user){
      if(cart?.products.length > 0 && guestId){
        dispatch(mergeCart({guestId,user})).then(() => {
          navigate(isCheckOutRedirect ? "/checkout" : "/");
        })
      }else{
        navigate(isCheckOutRedirect ? "/checkout" : "/")
      }
    }
  },[user,guestId,cart,navigate,isCheckOutRedirect,dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(registerUser({name,email,password}))
    //console.log(" the details:", { name, email, password });
  };
  return (
    <div className="flex">
      <div className="w-full md:w-1/2 flex flex-col justify-center items-center p-8 md:p-12">
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-md bg-white p-8 rounded-lg border shadow-sm"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-xl font-medium"> Welcome!</h2>
          </div>
          <h2 className="text-2xl font-bold text-center mb-6">
            {" "}
            Hey There! 👋{" "}
          </h2>
          <p className="text-center mb-6">
            {" "}
            Enter Your Username and Password to Register
          </p>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              {" "}
              User Name{" "}
            </label>
            <input
              type="text"
              value={name}
              placeholder="Enter Your Name"
              className="w-full p-2 border rounded"
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2"> Email </label>
            <input
              type="text"
              value={email}
              placeholder="Enter Your Email Address"
              className="w-full p-2 border rounded"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block text-sm font-semibold mb-2">
              {" "}
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-2 border rounded"
              placeholder="Enter Your password"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-black text-white p-2 rounded-lg font-semibold hover:bg-gray-700 transition"
          >
            Register
          </button>
          <p className="mt-6 text-center text-sm">
            You have an account?{" "}
            <Link to={`/login?redirect=${encodeURIComponent(redirect)}`} className="text-blue-500">
              Login
            </Link>
          </p>
        </form>
      </div>
      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center ">
          <img
            className="h-[750px] w-full object-fill items-center rounded border"
            src={register}
            alt="Register"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}

export default Register;
