import React from "react";
import Header from "../common/Header";
import Footer from "../common/Footer";
import { Outlet } from "react-router-dom";

function UserLayout() {
  return (
    <div>
      <Header />
      {/* <mainconent/> */}
      <main>
        <Outlet />
      </main>

      <Footer />
    </div>
  );
}

export default UserLayout;
