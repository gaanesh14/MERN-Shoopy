import React from "react";
import Topbar from "../Layout/Topbar";
import Navbar from "./Navbar";

function Header() {
  return (
    <div>
      <header className="border-b border-gray-100 bg-slate-100">
        {/* <Topbar/> */}
        <Navbar />
      </header>
    </div>
  );
}

export default Header;
