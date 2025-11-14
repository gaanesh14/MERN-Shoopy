import React, { useState } from "react";
import { Link, useLocation, useNavigate,Navigate } from "react-router-dom";
import login from "../assets/assets/login.webp";
import { loginUser,registerUser } from "../Redux/slices/authSlice";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { mergeCart } from "../Redux/slices/cartSlice";
import { toast } from "sonner";


function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch()
  const navigate = useNavigate();
  const location = useLocation();
  const {user, guestId, loginStatus} = useSelector((state) => state.auth);
  const {cart} = useSelector((state) => state.cart);

  // Get redirected parameters and check if it's checkout or something
  const redirect = new URLSearchParams(location.search).get("redirect") || "/";
  const isCheckOutRedirect = redirect.includes("checkout");

  useEffect(() => {
    if(loginStatus !== "success") return;
    if(user){
      if(cart?.products.length > 0 && guestId){
        dispatch(mergeCart({guestId,user})).then(() => {
          navigate(isCheckOutRedirect ? "/checkout" : "/");
        })
      }else{
        navigate(isCheckOutRedirect ? "/checkout" : "/")
      }
    }
  },[loginStatus,user,guestId,cart,navigate,isCheckOutRedirect,dispatch]);
 
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const result = await dispatch(loginUser({email,password})).unwrap()
      toast.success("Login Successful!")
    } catch (error) {
      toast.error("Invalid Crendintials")
    }
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
            Enter Your Username and Password to login
          </p>
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
            SignIn
          </button>
          <p className="mt-6 text-center text-sm">
            Don't have an account?{" "}
            <Link to={`/register?redirect=${encodeURIComponent(redirect)}`}className="text-blue-500">
              Register
            </Link>
          </p>
        </form>
      </div>
      <div className="hidden md:block w-1/2 bg-gray-800">
        <div className="h-full flex flex-col justify-center ">
          <img
            className="h-[750px] w-full object-cover items-center rounded border"
            src={login}
            alt="Login"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
}

export default Login;
