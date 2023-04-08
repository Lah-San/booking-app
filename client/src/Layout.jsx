import React from "react";
import Header from "./pages/Header";
import { Outlet } from "react-router-dom";

function Layout() {
  return (
    <div className="p-5 md:px-20 lg:px-20 flex flex-col min-h-screen">
      <Header />
      <Outlet />
    </div>
  );
}

export default Layout;
